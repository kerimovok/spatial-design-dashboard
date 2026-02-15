import type { ButtonHTMLAttributes } from 'react'

const baseStyles =
	'inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2 text-xs uppercase tracking-[0.24em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40'

const variants = {
	primary:
		'border-black bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.2)]',
	ghost: 'border-black/20 bg-white/60 text-black hover:-translate-y-0.5 hover:border-black/40',
	danger: 'border-red-500/40 bg-red-500/10 text-red-700 hover:-translate-y-0.5 hover:border-red-500/60',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: keyof typeof variants
}

const Button = ({
	variant = 'primary',
	className = '',
	...props
}: ButtonProps) => {
	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${className}`}
			{...props}
		/>
	)
}

export default Button
