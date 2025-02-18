
import { createRoot } from 'react-dom/client'
import './index.css'

import ReactDom from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Today from './pages/Today.jsx' 
import SelectedWorkout from './pages/SelectedWorkout.jsx'
import YearOverview from './pages/YearOverview.jsx'

const router = createBrowserRouter([

  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/today',
        element: <Today />
  },
  {
    path: '/selectedworkout',
    element: <SelectedWorkout />
  },
  {
    path: '/yearoverview',
    element: <YearOverview />
  }
]
}
])

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
