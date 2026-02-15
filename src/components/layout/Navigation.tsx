import { NavLink } from 'react-router-dom'

const linkBase =
	'text-xs uppercase tracking-[0.28em] transition-colors duration-200'

const linkClassName = ({ isActive }: { isActive: boolean }) =>
	`${linkBase} ${isActive ? 'text-black' : 'text-black/55 hover:text-black'}`

const Navigation = () => {
	return (
		<nav className='flex items-center gap-8'>
			<NavLink to='/designers' className={linkClassName}>
				Designers
			</NavLink>
			<NavLink to='/editor' className={linkClassName}>
				3D Editor
			</NavLink>
		</nav>
	)
}

export default Navigation
