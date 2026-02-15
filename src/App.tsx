import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DesignersPage from './pages/DesignersPage'
import EditorPage from './pages/EditorPage'

const App = () => {
	return (
		<Layout>
			<Routes>
				<Route
					path='/'
					element={<Navigate to='/designers' replace />}
				/>
				<Route path='/designers' element={<DesignersPage />} />
				<Route path='/editor' element={<EditorPage />} />
			</Routes>
		</Layout>
	)
}

export default App
