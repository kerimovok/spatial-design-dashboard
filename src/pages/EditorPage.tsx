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
			<div className='rounded-3xl border border-dashed border-black/15 bg-white/70 px-8 py-16 text-center text-sm text-black/50 shadow-[0_18px_60px_rgba(11,15,19,0.06)]'>
				The 3D canvas and inspector will live here.
			</div>
		</section>
	)
}

export default EditorPage
