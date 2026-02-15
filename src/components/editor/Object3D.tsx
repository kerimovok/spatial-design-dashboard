import { useMemo, useState } from 'react'
import type { Mesh } from 'three'
import type { Object3D as Object3DType, Size } from '../../types'

const sizeScale: Record<Size, number> = {
	small: 0.6,
	normal: 1,
	large: 1.5,
}

type Object3DProps = {
	object: Object3DType
	isSelected: boolean
	onSelect: (id: string) => void
	onMeshReady?: (mesh: Mesh | null) => void
}

const Object3D = ({
	object,
	isSelected,
	onSelect,
	onMeshReady,
}: Object3DProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const scale = sizeScale[object.size]

	const color = useMemo(() => {
		if (isSelected) {
			return '#111827'
		}
		if (isHovered) {
			return '#1f2937'
		}
		return object.color
	}, [isHovered, isSelected, object.color])

	return (
		<mesh
			ref={onMeshReady}
			position={[object.position.x, object.position.y, object.position.z]}
			scale={[scale, scale, scale]}
			onPointerDown={(event) => {
				event.stopPropagation()
				onSelect(object.id)
			}}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial
				color={color}
				emissive={isSelected ? '#111827' : '#000000'}
				emissiveIntensity={isSelected ? 0.4 : 0.1}
				metalness={0.2}
				roughness={0.4}
			/>
		</mesh>
	)
}

export default Object3D
