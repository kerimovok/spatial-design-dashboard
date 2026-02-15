import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver, useForm } from 'react-hook-form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import type { Designer, Object3D, ObjectUpdate } from '../../types'
import { objectSchema, type ObjectFormValues } from '../../utils/validation'

type ObjectPropertiesPanelProps = {
	object: Object3D | null
	designers: Designer[]
	isSubmitting: boolean
	error?: string | null
	onUpdate: (updates: ObjectUpdate) => Promise<void>
	onDelete: () => Promise<void>
}

const ObjectPropertiesPanel = ({
	object,
	designers,
	isSubmitting,
	error,
	onUpdate,
	onDelete,
}: ObjectPropertiesPanelProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ObjectFormValues>({
		resolver: zodResolver(objectSchema) as Resolver<ObjectFormValues>,
		values: object
			? {
					name: object.name,
					color: object.color,
					size: object.size,
					designerId: object.designerId,
				}
			: undefined,
	})

	const submitHandler = handleSubmit(async (values: ObjectFormValues) => {
		await onUpdate(values)
	})

	if (!object) {
		return (
			<aside className='flex flex-col items-center justify-center rounded-[32px] border border-black/10 bg-white/70 p-6 text-center text-sm text-black/50 shadow-[0_24px_70px_rgba(11,15,19,0.08)]'>
				<p>Select an object to edit its properties.</p>
			</aside>
		)
	}

	return (
		<aside className='space-y-6 rounded-[32px] border border-black/10 bg-white/70 p-6 shadow-[0_24px_70px_rgba(11,15,19,0.08)]'>
			<div className='space-y-2 border-b border-black/10 pb-4'>
				<p className='text-xs uppercase tracking-[0.3em] text-black/40'>
					Object Editor
				</p>
				<h3 className='truncate text-lg font-semibold text-black'>
					{object.name}
				</h3>
			</div>

			<form className='space-y-4' onSubmit={submitHandler}>
				<Input
					label='Name'
					placeholder='Object name'
					error={errors.name?.message}
					register={register('name')}
				/>

				<Input
					label='Color'
					type='color'
					error={errors.color?.message}
					hint='Hex format: #FF5733'
					register={register('color')}
					// Just for the purposes of this task, I'm hardcoding the className here to make the color input look better.
					className='w-full rounded-2xl border border-black/15 bg-white/70 text-sm tracking-normal text-black shadow-[0_12px_24px_rgba(11,15,19,0.05)] transition focus:border-black/40 focus:outline-none'
				/>

				<Select
					label='Size'
					options={[
						{ value: 'small', label: 'Small' },
						{ value: 'normal', label: 'Normal' },
						{ value: 'large', label: 'Large' },
					]}
					error={errors.size?.message}
					register={register('size')}
				/>

				<Select
					label='Designer'
					options={designers.map((designer) => ({
						value: designer.id,
						label: designer.fullName,
					}))}
					error={errors.designerId?.message}
					register={register('designerId')}
				/>

				{error ? (
					<p className='text-xs uppercase tracking-[0.25em] text-red-500'>
						{error}
					</p>
				) : null}

				<div className='flex flex-col gap-2 pt-2'>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? 'Saving' : 'Save changes'}
					</Button>
					<Button
						type='button'
						variant='danger'
						disabled={isSubmitting}
						onClick={onDelete}
					>
						Delete object
					</Button>
				</div>
			</form>
		</aside>
	)
}

export default ObjectPropertiesPanel
