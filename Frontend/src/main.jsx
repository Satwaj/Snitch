
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import './app/App.css'
import { store } from "./app/app.store"
import { Provider } from "react-redux"

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
