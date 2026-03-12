
import './App.css'
import ClimatiqScheduler from './components/ClimaticScheduler'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import YourInfo from './components/YourInfo'
import BookingConfirmationModal from './components/BookingConfirmationModal'
import AdminView from './components/AdminView'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ClimatiqScheduler/>}/>
      <Route path='/your-info' element={<YourInfo/>}/>
      <Route path='/success' element={<BookingConfirmationModal/>}/>
      <Route path="/admin" element={<AdminView />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
