import { useEffect, useMemo, useState } from 'react'
import AddDesignerForm from './AddDesignerForm'
import DesignerCard from './DesignerCard'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { useDesignersStore } from '../../store/useDesignersStore'

const DesignersList = () => {
	const [isOpen, setIsOpen] = useState(false)
	const {
		designers,
		isLoading,
		error,
		fetchDesigners,
		addDesigner,
		deleteDesigner,
	} = useDesignersStore()

	useEffect(() => {
		void fetchDesigners()
	}, [fetchDesigners])

	const sortedDesigners = useMemo(
		() =>
			[...designers].sort((a, b) => a.fullName.localeCompare(b.fullName)),
		[designers],
	)

	const handleAdd = async (values: {
		fullName: string
		workingHours: number
	}) => {
		const created = await addDesigner(values)
		if (created) {
			setIsOpen(false)
			await fetchDesigners()
			return true
		}
		return false
	}

	const handleDelete = async (id: string) => {
		const success = await deleteDesigner(id)
		if (success) {
			await fetchDesigners()
		}
	}

	return (
		<section className='space-y-8'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div className='space-y-2'>
					<p className='text-xs uppercase tracking-[0.3em] text-black/50'>
						Active roster
					</p>
					<h3 className='text-2xl font-semibold text-black'>
						Designers roster
					</h3>
				</div>
				<Button variant='primary' onClick={() => setIsOpen(true)}>
					Add designer
				</Button>
			</div>
			{isLoading ? (
				<div className='rounded-3xl border border-black/10 bg-white/60 px-6 py-12 text-center text-sm text-black/60'>
					Loading designers...
				</div>
			) : sortedDesigners.length === 0 ? (
				<div className='rounded-3xl border border-dashed border-black/20 bg-white/60 px-6 py-12 text-center text-sm text-black/60'>
					No designers yet. Create the first roster entry.
				</div>
			) : (
				<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
					{sortedDesigners.map((designer) => (
						<DesignerCard
							key={designer.id}
							designer={designer}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title='Add designer'
			>
				<AddDesignerForm
					isSubmitting={isLoading}
					error={error}
					onSubmit={handleAdd}
				/>
			</Modal>
		</section>
	)
}

export default DesignersList
