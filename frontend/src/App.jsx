import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import { StoreProvider } from './StoreContext'
import Navbar from './Navbar/Navbar'
import Home from './Pages/Home'
import CreateJournal from './Pages/CreateJournal'
import EditJournal from './Pages/EditJournal'
import SearchJournal from './Pages/SearchJournal'
import ViewJournal from './Pages/ViewJournal'

export const BASE_URL = import.meta.env.VITE_BASE_URL

function App() {
    return (
      <StoreProvider>
        <Router>
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/create' element={<CreateJournal/>}></Route>
            <Route path='/edit' element={<EditJournal/>}></Route>
            <Route path='/search' element={<SearchJournal/>}></Route>
            <Route path='/view' element={<ViewJournal/>}></Route>
          </Routes>
        </Router>
      </StoreProvider>
    )
}

export default App
