import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.tsx'
import Convo from './pages/Convo.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"

const fonts = {
  body: 'Mona Sans, system-ui, sans-serif',
  heading: 'Mona Sans, system-ui, sans-serif',
}
const theme = extendTheme({
  fonts,
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "convos/:convoId",
    element: <Convo />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
