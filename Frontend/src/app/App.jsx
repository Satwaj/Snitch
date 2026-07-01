import {routes} from "./app.routes"
import {RouterProvider} from "react-router"
import {useEffect} from "react"
import { useAuth } from "../features/auth/hook/useAuth"

const App = () => {
  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])


  return (
    <>
    <RouterProvider router={routes} />
    </>
  )
}

export default App
