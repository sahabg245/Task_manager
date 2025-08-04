import Modal from './components/Modal'
import Calculator from "./components/Calculator"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'



const router = createBrowserRouter(
  [
    {
      path:"/",
      element:<Modal/>
    },
    {
      path:"/calculator",
      element:<Calculator/>
    }

  ]
)



function App() {

  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
