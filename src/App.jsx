import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GuestMenu from './pages/guest/GuestMenu'
import BarView from './pages/bar/BarView'
import QRCodes from './pages/admin/QRCodes'
import Home from './pages/Home'
import ScanQR from './pages/ScanQR'
import Takeaway from './pages/Takeaway'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guest/:stolBroj" element={<GuestMenu />} />
        <Route path="/bar" element={<BarView />} />
        <Route path="/qr" element={<QRCodes />} />
        <Route path="/order/scan" element={<ScanQR />} />
        <Route path="/order/takeaway" element={<Takeaway />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App