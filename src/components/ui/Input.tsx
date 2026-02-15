import type { InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	error?: string
	hint?: string
	register?: UseFormRegisterReturn
}

const Input = ({ label, error, hint, register, ...props }: InputProps) => {
	return (
		<label className='flex w-full flex-col gap-2 text-xs uppercase tracking-[0.2em] text-black/60'>
			<span>{label}</span>
			<input
				className='w-full rounded-2xl border border-black/15 bg-white/70 px-4 py-3 text-sm tracking-normal text-black shadow-[0_12px_24px_rgba(11,15,19,0.05)] transition focus:border-black/40 focus:outline-none'
				{...register}
				{...props}
			/>
			{hint ? (
				<span className='text-[11px] uppercase tracking-[0.2em] text-black/35'>
					{hint}
				</span>
			) : null}
			{error ? (
				<span className='text-[11px] uppercase tracking-[0.2em] text-red-500'>
					{error}
				</span>
			) : null}
		</label>
	)
}

export default Input
