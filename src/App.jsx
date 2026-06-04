import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GuestMenu from './pages/guest/GuestMenu'
import BarView from './pages/bar/BarView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/guest/:stolBroj" element={<GuestMenu />} />
        <Route path="/bar" element={<BarView />} />
        <Route path="/" element={<BarView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App