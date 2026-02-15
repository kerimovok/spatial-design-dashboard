import { z } from 'zod'

export const designerSchema = z.object({
	fullName: z.string().trim().min(1, 'Name is required'),
	workingHours: z.coerce
		.number()
		.refine((value) => Number.isFinite(value), {
			message: 'Working hours must be a number',
		})
		.min(0, 'Working hours must be between 0 and 168')
		.max(168, 'Working hours must be between 0 and 168'),
})

export type DesignerFormValues = z.infer<typeof designerSchema>
