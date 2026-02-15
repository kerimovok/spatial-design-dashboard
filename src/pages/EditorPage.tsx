import Scene3D from '../components/editor/Scene3D'

const EditorPage = () => {
	return (
		<section className='space-y-6'>
			<div className='space-y-2'>
				<p className='text-xs uppercase tracking-[0.3em] text-black/50'>
					Spatial Editor
				</p>
				<h2 className='text-2xl font-semibold text-black'>
					3D Workspace
				</h2>
				<p className='max-w-2xl text-sm text-black/60'>
					Place objects, assign designers, and tune properties in a
					live 3D scene.
				</p>
			</div>
			<div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
				<Scene3D />
				<aside className='rounded-[32px] border border-black/10 bg-white/70 p-6 text-sm text-black/50 shadow-[0_24px_70px_rgba(11,15,19,0.08)]'>
					Select an object to see its properties.
				</aside>
			</div>
		</section>
	)
}

export default EditorPage
