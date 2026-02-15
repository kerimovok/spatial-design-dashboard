import { create } from 'zustand'
import { mockApi } from '../api/mockApi'
import type { Object3D, ObjectInput, ObjectUpdate } from '../types'

type ObjectsState = {
	objects: Object3D[]
	selectedObjectId: string | null
	isLoading: boolean
	error: string | null
	fetchObjects: () => Promise<void>
	addObject: (input: ObjectInput) => Promise<Object3D | undefined>
	updateObject: (
		id: string,
		updates: ObjectUpdate,
	) => Promise<Object3D | undefined>
	deleteObject: (id: string) => Promise<boolean>
	selectObject: (id: string | null) => void
}

export const useObjectsStore = create<ObjectsState>((set, get) => ({
	objects: [],
	selectedObjectId: null,
	isLoading: false,
	error: null,
	fetchObjects: async () => {
		set({ isLoading: true, error: null })
		try {
			const objects = await mockApi.getObjects()
			set({ objects, isLoading: false })
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to load objects',
				isLoading: false,
			})
		}
	},
	addObject: async (input) => {
		set({ isLoading: true, error: null })
		try {
			const created = await mockApi.createObject(input)
			const next = [...get().objects, created]
			set({
				objects: next,
				isLoading: false,
				selectedObjectId: created.id,
			})
			return created
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to add object',
				isLoading: false,
			})
			return undefined
		}
	},
	updateObject: async (id, updates) => {
		set({ isLoading: true, error: null })
		try {
			const updated = await mockApi.updateObject(id, updates)
			const next = get().objects.map((object) =>
				object.id === id ? updated : object,
			)
			set({ objects: next, isLoading: false })
			return updated
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to update object',
				isLoading: false,
			})
			return undefined
		}
	},
	deleteObject: async (id) => {
		set({ isLoading: true, error: null })
		try {
			await mockApi.deleteObject(id)
			const next = get().objects.filter((object) => object.id !== id)
			const nextSelected =
				get().selectedObjectId === id ? null : get().selectedObjectId
			set({
				objects: next,
				selectedObjectId: nextSelected,
				isLoading: false,
			})
			return true
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to delete object',
				isLoading: false,
			})
			return false
		}
	},
	selectObject: (id) => set({ selectedObjectId: id }),
}))
