import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver, useForm } from 'react-hook-form'
import Button from '../ui/Button'
import Input from '../ui/Input'
import type { DesignerInput } from '../../types'
import { designerSchema, type DesignerFormValues } from '../../utils/validation'

type AddDesignerFormProps = {
	isSubmitting: boolean
	error?: string | null
	onSubmit: (values: DesignerInput) => Promise<boolean>
}

const AddDesignerForm = ({
	isSubmitting,
	error,
	onSubmit,
}: AddDesignerFormProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<DesignerFormValues>({
		resolver: zodResolver(designerSchema) as Resolver<DesignerFormValues>,
		defaultValues: {
			fullName: '',
			workingHours: 40,
		},
	})

	const submitHandler = handleSubmit(async (values: DesignerFormValues) => {
		const success = await onSubmit(values)
		if (success) {
			reset()
		}
	})

	return (
		<form className='space-y-6' onSubmit={submitHandler}>
			<div className='grid gap-6 md:grid-cols-2'>
				<Input
					label='Full name'
					placeholder='Jane Doe'
					error={errors.fullName?.message}
					register={register('fullName')}
				/>
				<Input
					label='Weekly hours'
					type='number'
					min={0}
					max={168}
					hint='0 - 168'
					error={errors.workingHours?.message}
					register={register('workingHours', { valueAsNumber: true })}
				/>
			</div>
			{error ? (
				<p className='text-xs uppercase tracking-[0.25em] text-red-500'>
					{error}
				</p>
			) : null}
			<div className='flex items-center justify-end gap-3'>
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? 'Saving' : 'Save designer'}
				</Button>
			</div>
		</form>
	)
}

export default AddDesignerForm
