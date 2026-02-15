export type Size = 'small' | 'normal' | 'large'

export type ColorHex = string

export interface Position {
	x: number
	y: number
	z: number
}

export interface Designer {
	id: string
	fullName: string
	workingHours: number
	attachedObjectsCount: number
}

export interface Object3D {
	id: string
	name: string
	designerId: string
	color: ColorHex
	position: Position
	size: Size
}

export type DesignerInput = Omit<Designer, 'id' | 'attachedObjectsCount'>

export type DesignerUpdate = Partial<DesignerInput>

export type ObjectInput = Omit<Object3D, 'id'>

export type ObjectUpdate = Partial<ObjectInput>
