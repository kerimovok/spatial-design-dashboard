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

export const objectSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Name is required')
		.max(100, 'Name is too long'),
	color: z
		.string()
		.regex(
			/^#[0-9A-F]{6}$/i,
			'Color must be a valid hex code (e.g., #FF5733)',
		),
	size: z
		.enum(['small', 'normal', 'large'])
		.refine((val) => ['small', 'normal', 'large'].includes(val), {
			message: 'Size must be small, normal, or large',
		}),
	designerId: z.string().min(1, 'Designer is required'),
})

export type ObjectFormValues = z.infer<typeof objectSchema>
