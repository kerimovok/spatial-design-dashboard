import {
	type Designer,
	type DesignerInput,
	type DesignerUpdate,
	type Object3D,
	type ObjectInput,
	type ObjectUpdate,
} from '../types'
import { storage } from './storage'

const DESIGNERS_KEY = 'mock-designers'
const OBJECTS_KEY = 'mock-objects'

const seedDesigners: Designer[] = [
	{
		id: 'designer-joe-goldberg',
		fullName: 'Joe Goldberg',
		workingHours: 36,
		attachedObjectsCount: 0,
	},
	{
		id: 'designer-zayn-malik',
		fullName: 'Zayn Malik',
		workingHours: 40,
		attachedObjectsCount: 0,
	},
	{
		id: 'designer-harry-styles',
		fullName: 'Harry Styles',
		workingHours: 28,
		attachedObjectsCount: 0,
	},
]

const seedObjects: Object3D[] = [
	{
		id: 'object-01',
		name: 'Cube 1',
		designerId: 'designer-joe-goldberg',
		color: '#f97316',
		position: { x: -1.2, y: 0.5, z: 0.4 },
		size: 'normal',
	},
	{
		id: 'object-02',
		name: 'Cube 2',
		designerId: 'designer-zayn-malik',
		color: '#0ea5e9',
		position: { x: 0.9, y: 0.5, z: -0.2 },
		size: 'large',
	},
	{
		id: 'object-03',
		name: 'Cube 3',
		designerId: 'designer-harry-styles',
		color: '#111827',
		position: { x: 0.1, y: 0.5, z: 1.1 },
		size: 'small',
	},
]

const ensureSeed = () => {
	if (!storage.has(DESIGNERS_KEY)) {
		storage.set(DESIGNERS_KEY, seedDesigners)
	}
	if (!storage.has(OBJECTS_KEY)) {
		storage.set(OBJECTS_KEY, seedObjects)
	}
}

const computeDesignerCounts = (
	designers: Designer[],
	objects: Object3D[],
): Designer[] => {
	const counts = objects.reduce<Record<string, number>>((acc, object) => {
		acc[object.designerId] = (acc[object.designerId] ?? 0) + 1
		return acc
	}, {})

	return designers.map((designer) => ({
		...designer,
		attachedObjectsCount: counts[designer.id] ?? 0,
	}))
}

const readDesigners = (): Designer[] =>
	storage.get<Designer[]>(DESIGNERS_KEY, seedDesigners)

const readObjects = (): Object3D[] =>
	storage.get<Object3D[]>(OBJECTS_KEY, seedObjects)

const writeDesigners = (designers: Designer[]) => {
	storage.set(DESIGNERS_KEY, designers)
}

const writeObjects = (objects: Object3D[]) => {
	storage.set(OBJECTS_KEY, objects)
}

const withLatency = async <T>(value: T): Promise<T> => Promise.resolve(value)

const getDesigners = async (): Promise<Designer[]> => {
	ensureSeed()
	const designers = readDesigners()
	const objects = readObjects()
	const computed = computeDesignerCounts(designers, objects)
	writeDesigners(computed)
	return withLatency(computed)
}

const getDesigner = async (id: string): Promise<Designer | undefined> => {
	const designers = await getDesigners()
	return designers.find((designer) => designer.id === id)
}

const createDesigner = async (input: DesignerInput): Promise<Designer> => {
	ensureSeed()
	const designers = readDesigners()
	const newDesigner: Designer = {
		id: crypto.randomUUID(),
		attachedObjectsCount: 0,
		...input,
	}
	const updated = [...designers, newDesigner]
	writeDesigners(updated)
	return withLatency(newDesigner)
}

const updateDesigner = async (
	id: string,
	updates: DesignerUpdate,
): Promise<Designer> => {
	ensureSeed()
	const designers = readDesigners()
	const objects = readObjects()
	const index = designers.findIndex((designer) => designer.id === id)
	if (index < 0) {
		throw new Error('Designer not found')
	}
	const next = { ...designers[index], ...updates }
	const updated = [...designers]
	updated[index] = next
	const computed = computeDesignerCounts(updated, objects)
	writeDesigners(computed)
	return withLatency(computed[index])
}

const deleteDesigner = async (id: string): Promise<void> => {
	ensureSeed()
	const designers = readDesigners()
	const updated = designers.filter((designer) => designer.id !== id)
	writeDesigners(updated)
	await withLatency(undefined)
}

const getObjects = async (): Promise<Object3D[]> => {
	ensureSeed()
	return withLatency(readObjects())
}

const getObject = async (id: string): Promise<Object3D | undefined> => {
	const objects = await getObjects()
	return objects.find((object) => object.id === id)
}

const createObject = async (input: ObjectInput): Promise<Object3D> => {
	ensureSeed()
	const objects = readObjects()
	const newObject: Object3D = { id: crypto.randomUUID(), ...input }
	const updated = [...objects, newObject]
	writeObjects(updated)
	await getDesigners()
	return withLatency(newObject)
}

const updateObject = async (
	id: string,
	updates: ObjectUpdate,
): Promise<Object3D> => {
	ensureSeed()
	const objects = readObjects()
	const index = objects.findIndex((object) => object.id === id)
	if (index < 0) {
		throw new Error('Object not found')
	}
	const next = { ...objects[index], ...updates }
	const updated = [...objects]
	updated[index] = next
	writeObjects(updated)
	await getDesigners()
	return withLatency(updated[index])
}

const deleteObject = async (id: string): Promise<void> => {
	ensureSeed()
	const objects = readObjects()
	const updated = objects.filter((object) => object.id !== id)
	writeObjects(updated)
	await getDesigners()
	await withLatency(undefined)
}

export const mockApi = {
	getDesigners,
	getDesigner,
	createDesigner,
	updateDesigner,
	deleteDesigner,
	getObjects,
	getObject,
	createObject,
	updateObject,
	deleteObject,
}
