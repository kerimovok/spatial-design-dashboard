import Button from '../ui/Button'
import type { Designer } from '../../types'

type DesignerSelectorProps = {
	designers: Designer[]
	onSelect: (designerId: string) => void
	onCancel: () => void
}

const DesignerSelector = ({
	designers,
	onSelect,
	onCancel,
}: DesignerSelectorProps) => {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-10'>
			<div className='w-full max-w-md rounded-[32px] border border-black/15 bg-white px-8 py-10 shadow-[0_30px_80px_rgba(11,15,19,0.2)]'>
				<div className='space-y-2 mb-6'>
					<p className='text-xs uppercase tracking-[0.3em] text-black/40'>
						Place Object
					</p>
					<h3 className='text-xl font-semibold text-black'>
						Select Designer
					</h3>
				</div>

				<div className='space-y-2 max-h-64 overflow-y-auto'>
					{designers.map((designer) => (
						<button
							key={designer.id}
							type='button'
							className='w-full rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-left text-sm text-black transition hover:border-black/30 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40'
							onClick={() => onSelect(designer.id)}
						>
							<p className='font-medium'>{designer.fullName}</p>
							<p className='text-xs text-black/50'>
								{designer.workingHours}h/week
							</p>
						</button>
					))}
				</div>

				<div className='mt-6 flex gap-3'>
					<Button
						type='button'
						variant='ghost'
						className='flex-1'
						onClick={onCancel}
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	)
}

export default DesignerSelector
