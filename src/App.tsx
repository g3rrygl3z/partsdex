import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import PartDetail from '@/pages/PartDetail'
import Glossary from '@/pages/Glossary'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/:vertical" element={<Browse />} />
        <Route path="/parts/:id" element={<PartDetail />} />
        <Route path="/glossary" element={<Glossary />} />
      </Routes>
    </BrowserRouter>
  )
}
