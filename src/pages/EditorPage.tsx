import { useEffect, useMemo } from 'react'
import Scene3D from '../components/editor/Scene3D'
import ObjectPropertiesPanel from '../components/editor/ObjectPropertiesPanel'
import { useObjectsStore } from '../store/useObjectsStore'
import { useDesignersStore } from '../store/useDesignersStore'

const EditorPage = () => {
	const {
		objects,
		selectedObjectId,
		isLoading,
		error,
		updateObject,
		deleteObject,
		selectObject,
		fetchObjects,
	} = useObjectsStore()
	const { designers, fetchDesigners } = useDesignersStore()

	useEffect(() => {
		void fetchObjects()
		void fetchDesigners()
	}, [fetchObjects, fetchDesigners])

	const selectedObject = useMemo(
		() => objects.find((object) => object.id === selectedObjectId) ?? null,
		[objects, selectedObjectId],
	)

	const handleUpdate = async (updates: any) => {
		if (selectedObject) {
			await updateObject(selectedObject.id, updates)
		}
	}

	const handleDelete = async () => {
		if (selectedObject) {
			const success = await deleteObject(selectedObject.id)
			if (success) {
				selectObject(null)
				await fetchObjects()
			}
		}
	}

	return (
		<section className='space-y-6'>
			<div className='space-y-2'>
				<p className='text-xs uppercase tracking-[0.3em] text-black/50'>
					Spatial Editor
				</p>
				<h2 className='text-2xl font-semibold text-black'>
					3D Workspace
				</h2>
				<p className='max-w-2xl text-sm text-black/60'>
					Place objects, assign designers, and tune properties in a
					live 3D scene.
				</p>
			</div>
			<div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
				<Scene3D />
				<ObjectPropertiesPanel
					object={selectedObject}
					designers={designers}
					isSubmitting={isLoading}
					error={error}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
				/>
			</div>
		</section>
	)
}

export default EditorPage
