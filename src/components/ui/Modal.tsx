import { type PropsWithChildren, useEffect } from 'react'

type ModalProps = PropsWithChildren<{
	isOpen: boolean
	onClose: () => void
	title?: string
}>

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
	useEffect(() => {
		if (!isOpen) {
			return
		}

		const handleKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		window.addEventListener('keydown', handleKey)
		return () => window.removeEventListener('keydown', handleKey)
	}, [isOpen, onClose])

	if (!isOpen) {
		return null
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-10'>
			<div className='w-full max-w-xl rounded-[32px] border border-black/15 bg-white px-8 py-10 shadow-[0_30px_80px_rgba(11,15,19,0.2)]'>
				<div className='flex items-start justify-between gap-6'>
					<div className='space-y-2'>
						<p className='text-xs uppercase tracking-[0.3em] text-black/40'>
							Studio Form
						</p>
						{title ? (
							<h3 className='text-xl font-semibold text-black'>
								{title}
							</h3>
						) : null}
					</div>
					<button
						type='button'
						className='text-xs uppercase tracking-[0.2em] text-black/50 transition hover:text-black'
						onClick={onClose}
					>
						Close
					</button>
				</div>
				<div className='mt-8'>{children}</div>
			</div>
		</div>
	)
}

export default Modal
