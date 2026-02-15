import { useState } from 'react'
import type { Mesh } from 'three'
import type { Object3D as Object3DType, Size } from '../../types'

const sizeScale: Record<Size, number> = {
	small: 0.6,
	normal: 1,
	large: 1.5,
}

type Object3DProps = {
	object: Object3DType
	onSelect: (id: string) => void
	onMeshReady?: (mesh: Mesh | null) => void
}

const Object3D = ({ object, onSelect, onMeshReady }: Object3DProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const scale = sizeScale[object.size]

	const scaleMultiplier = isHovered ? 1.05 : 1
	const finalScale = scale * scaleMultiplier

	return (
		<mesh
			ref={onMeshReady}
			position={[object.position.x, object.position.y, object.position.z]}
			scale={[finalScale, finalScale, finalScale]}
			onPointerDown={(event) => {
				event.stopPropagation()
				onSelect(object.id)
			}}
			onPointerOver={() => setIsHovered(true)}
			onPointerOut={() => setIsHovered(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial
				color={object.color}
				emissive={isHovered ? '#e67d22' : '#000000'}
				emissiveIntensity={isHovered ? 0.4 : 0.05}
				metalness={0.2}
				roughness={0.4}
			/>
		</mesh>
	)
}

export default Object3D
