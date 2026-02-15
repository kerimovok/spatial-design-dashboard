import { create } from 'zustand'
import { mockApi } from '../api/mockApi'
import type { Designer, DesignerInput, DesignerUpdate } from '../types'

type DesignersState = {
	designers: Designer[]
	isLoading: boolean
	error: string | null
	fetchDesigners: () => Promise<void>
	addDesigner: (input: DesignerInput) => Promise<Designer | undefined>
	updateDesigner: (
		id: string,
		updates: DesignerUpdate,
	) => Promise<Designer | undefined>
	deleteDesigner: (id: string) => Promise<boolean>
}

export const useDesignersStore = create<DesignersState>((set, get) => ({
	designers: [],
	isLoading: false,
	error: null,
	fetchDesigners: async () => {
		set({ isLoading: true, error: null })
		try {
			const designers = await mockApi.getDesigners()
			set({ designers, isLoading: false })
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to load designers',
				isLoading: false,
			})
		}
	},
	addDesigner: async (input) => {
		set({ isLoading: true, error: null })
		try {
			const created = await mockApi.createDesigner(input)
			const next = [...get().designers, created]
			set({ designers: next, isLoading: false })
			return created
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to add designer',
				isLoading: false,
			})
			return undefined
		}
	},
	updateDesigner: async (id, updates) => {
		set({ isLoading: true, error: null })
		try {
			const updated = await mockApi.updateDesigner(id, updates)
			const next = get().designers.map((designer) =>
				designer.id === id ? updated : designer,
			)
			set({ designers: next, isLoading: false })
			return updated
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to update designer',
				isLoading: false,
			})
			return undefined
		}
	},
	deleteDesigner: async (id) => {
		set({ isLoading: true, error: null })
		try {
			await mockApi.deleteDesigner(id)
			const next = get().designers.filter(
				(designer) => designer.id !== id,
			)
			set({ designers: next, isLoading: false })
			return true
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Unable to delete designer',
				isLoading: false,
			})
			return false
		}
	},
}))
