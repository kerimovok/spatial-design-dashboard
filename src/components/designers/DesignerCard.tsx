import Button from '../ui/Button'
import type { Designer } from '../../types'

type DesignerCardProps = {
	designer: Designer
	onDelete?: (id: string) => void
}

const DesignerCard = ({ designer, onDelete }: DesignerCardProps) => {
	return (
		<article className='flex h-full flex-col justify-between gap-6 rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_18px_40px_rgba(11,15,19,0.06)] transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(11,15,19,0.12)]'>
			<div className='space-y-3'>
				<p className='text-xs uppercase tracking-[0.3em] text-black/40'>
					Designer
				</p>
				<h3 className='text-xl font-semibold text-black'>
					{designer.fullName}
				</h3>
				<div className='space-y-1 text-sm text-black/60'>
					<p>{designer.workingHours} hours/week</p>
					<p>{designer.attachedObjectsCount} active objects</p>
				</div>
			</div>
			{onDelete ? (
				<Button variant='ghost' onClick={() => onDelete(designer.id)}>
					Remove
				</Button>
			) : null}
		</article>
	)
}

export default DesignerCard
