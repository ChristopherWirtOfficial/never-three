import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NeverThree from './app/App'
import { AppBootstrap } from './providers/AppBootstrap'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Missing #root')

createRoot(rootElement).render(
	<StrictMode>
		<AppBootstrap>
			<NeverThree />
		</AppBootstrap>
	</StrictMode>
)
