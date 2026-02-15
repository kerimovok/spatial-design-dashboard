import { OrbitControls, TransformControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Raycaster, Vector2 } from 'three'
import type { Mesh } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import Object3D from './Object3D'
import DesignerSelector from './DesignerSelector'
import { useObjectsStore } from '../../store/useObjectsStore'
import { useDesignersStore } from '../../store/useDesignersStore'
import type { ObjectInput } from '../../types'

const raycaster = new Raycaster()
const mouse = new Vector2()

const SceneInner = ({
	onPlacementClick,
}: {
	onPlacementClick: (position: { x: number; z: number }) => void
}) => {
	const { camera, gl } = useThree()
	const { objects, selectedObjectId, selectObject, updateObject } =
		useObjectsStore()
	const orbitRef = useRef<OrbitControlsImpl | null>(null)
	const [isTransforming, setIsTransforming] = useState(false)
	const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null)
	const selectedMeshRef = useRef<Mesh | null>(null)
	const objectMeshesRef = useRef<Map<string, Mesh>>(new Map())
	const clickTimeRef = useRef<number>(0)

	const selectedObject = useMemo(
		() => objects.find((object) => object.id === selectedObjectId) ?? null,
		[objects, selectedObjectId],
	)

	useEffect(() => {
		const handleCanvasClick = (event: MouseEvent) => {
			const now = Date.now()
			const isDoubleClick = now - clickTimeRef.current < 300

			if (isDoubleClick) {
				const canvas = gl.domElement
				const rect = canvas.getBoundingClientRect()
				mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
				mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

				raycaster.setFromCamera(mouse, camera)

				const dot = Math.abs(raycaster.ray.direction.y)
				if (dot > 0.0001) {
					const t =
						-raycaster.ray.origin.y / raycaster.ray.direction.y
					const hitPoint = raycaster.ray.origin
						.clone()
						.addScaledVector(raycaster.ray.direction, t)
					onPlacementClick({ x: hitPoint.x, z: hitPoint.z })
				}
				clickTimeRef.current = 0
			} else {
				clickTimeRef.current = now
			}
		}

		gl.domElement.addEventListener('click', handleCanvasClick)
		return () =>
			gl.domElement.removeEventListener('click', handleCanvasClick)
	}, [gl, camera, onPlacementClick])

	// Problem: Three.js was firing onPointerOver events on all objects that the ray intersected, not just the closest one.
	// Solution: Track pointer movement and do raycasting manually to only hover the closest intersected object.
	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			// Track pointer movement for raycasting hover detection
			const canvas = gl.domElement
			const rect = canvas.getBoundingClientRect()
			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
			mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

			// Cast ray from camera through mouse position
			raycaster.setFromCamera(mouse, camera)

			const meshes = Array.from(objectMeshesRef.current.values())
			const intersects = raycaster.intersectObjects(meshes)

			// Only hover the closest object to prevent multiple highlights through transparent objects
			const closestIntersect = intersects[0]
			if (closestIntersect) {
				const mesh = closestIntersect.object as Mesh
				const objectId = Array.from(
					objectMeshesRef.current.entries(),
				).find(([_, m]) => m === mesh)?.[0]
				setHoveredObjectId(objectId ?? null)
			} else {
				setHoveredObjectId(null)
			}
		}

		gl.domElement.addEventListener('pointermove', handlePointerMove)
		return () =>
			gl.domElement.removeEventListener('pointermove', handlePointerMove)
	}, [gl, camera])

	return (
		<>
			<ambientLight intensity={0.6} />
			<directionalLight position={[6, 8, 4]} intensity={0.9} />
			<gridHelper args={[12, 12, '#d1d5db', '#e5e7eb']} />
			<mesh
				rotation={[-Math.PI / 2, 0, 0]}
				onPointerDown={() => selectObject(null)}
			>
				<planeGeometry args={[50, 50]} />
				<meshStandardMaterial
					color='#f3f4f6'
					transparent
					opacity={0.4}
				/>
			</mesh>
			{objects.map((object) => (
				<Object3D
					key={object.id}
					object={object}
					isHovered={hoveredObjectId === object.id}
					onSelect={selectObject}
					onMeshReady={(mesh) => {
						// Track meshes for raycasting hover detection
						if (mesh) {
							objectMeshesRef.current.set(object.id, mesh)
						} else {
							objectMeshesRef.current.delete(object.id)
						}
						if (object.id === selectedObjectId) {
							selectedMeshRef.current = mesh
						}
					}}
				/>
			))}
			{selectedObject && selectedMeshRef.current ? (
				<TransformControls
					object={selectedMeshRef.current}
					mode='translate'
					onMouseDown={() => {
						setIsTransforming(true)
						if (orbitRef.current) {
							orbitRef.current.enabled = false
						}
					}}
					onMouseUp={() => {
						setIsTransforming(false)
						if (orbitRef.current) {
							orbitRef.current.enabled = true
						}
						if (selectedMeshRef.current) {
							const { x, z } = selectedMeshRef.current.position
							void updateObject(selectedObject.id, {
								position: {
									x,
									y: selectedObject.position.y,
									z,
								},
							})
						}
					}}
				/>
			) : null}
			<OrbitControls ref={orbitRef} enabled={!isTransforming} />
		</>
	)
}

const Scene3D = () => {
	const { objects, fetchObjects, addObject, selectObject } = useObjectsStore()
	const { designers, fetchDesigners } = useDesignersStore()
	const [showDesignerSelector, setShowDesignerSelector] = useState(false)
	const [placementPos, setPlacementPos] = useState<{
		x: number
		z: number
	} | null>(null)

	useEffect(() => {
		void fetchObjects()
		void fetchDesigners()
	}, [fetchObjects, fetchDesigners])

	const handlePlacementClick = (position: { x: number; z: number }) => {
		setPlacementPos(position)
		setShowDesignerSelector(true)
	}

	const handleDesignerSelect = async (designerId: string) => {
		if (!placementPos) return

		const colors = ['#f97316', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6']
		const randomColor = colors[Math.floor(Math.random() * colors.length)]

		const newObject: ObjectInput = {
			name: `Object ${objects.length + 1}`,
			designerId,
			color: randomColor,
			position: { x: placementPos.x, y: 0.5, z: placementPos.z },
			size: 'normal',
		}

		const created = await addObject(newObject)
		if (created) {
			selectObject(created.id)
			await fetchObjects()
		}

		setShowDesignerSelector(false)
		setPlacementPos(null)
	}

	return (
		<>
			<div className='relative h-[480px] w-full overflow-hidden rounded-[32px] border border-black/10 bg-white/70 shadow-[0_24px_70px_rgba(11,15,19,0.08)]'>
				<Canvas camera={{ position: [4, 5, 6], fov: 45 }}>
					<SceneInner onPlacementClick={handlePlacementClick} />
				</Canvas>
				{showDesignerSelector && (
					<div className='absolute inset-0 pointer-events-none' />
				)}
			</div>
			{showDesignerSelector && (
				<DesignerSelector
					designers={designers}
					onSelect={handleDesignerSelect}
					onCancel={() => {
						setShowDesignerSelector(false)
						setPlacementPos(null)
					}}
				/>
			)}
		</>
	)
}

export default Scene3D
