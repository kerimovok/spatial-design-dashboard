import { OrbitControls, TransformControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Mesh } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import Object3D from './Object3D'
import { useObjectsStore } from '../../store/useObjectsStore'

const Scene3D = () => {
	const {
		objects,
		selectedObjectId,
		fetchObjects,
		selectObject,
		updateObject,
	} = useObjectsStore()
	const orbitRef = useRef<OrbitControlsImpl | null>(null)
	const [isTransforming, setIsTransforming] = useState(false)
	const [selectedMesh, setSelectedMesh] = useState<Mesh | null>(null)

	useEffect(() => {
		void fetchObjects()
	}, [fetchObjects])

	const selectedObject = useMemo(
		() => objects.find((object) => object.id === selectedObjectId) ?? null,
		[objects, selectedObjectId],
	)

	const handleSelect = (id: string | null) => {
		setSelectedMesh(null)
		selectObject(id)
	}

	return (
		<div className='h-[480px] w-full rounded-[32px] border border-black/10 bg-white/70 shadow-[0_24px_70px_rgba(11,15,19,0.08)] overflow-hidden'>
			<Canvas camera={{ position: [4, 5, 6], fov: 45 }}>
				<ambientLight intensity={0.6} />
				<directionalLight position={[6, 8, 4]} intensity={0.9} />
				<gridHelper args={[12, 12, '#d1d5db', '#e5e7eb']} />
				<mesh
					rotation={[-Math.PI / 2, 0, 0]}
					onPointerDown={() => handleSelect(null)}
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
						isSelected={object.id === selectedObjectId}
						onSelect={handleSelect}
						onMeshReady={
							object.id === selectedObjectId
								? setSelectedMesh
								: undefined
						}
					/>
				))}
				{selectedObject && selectedMesh ? (
					<TransformControls
						object={selectedMesh}
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
							if (selectedMesh) {
								const { x, z } = selectedMesh.position
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
			</Canvas>
		</div>
	)
}

export default Scene3D
