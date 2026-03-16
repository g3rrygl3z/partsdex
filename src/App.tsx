import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import BrowseVertical from './pages/BrowseVertical';
import PartDetail from './pages/PartDetail';
import Glossary from './pages/Glossary';
import SearchResults from './pages/SearchResults';
import IdentifyPage from './pages/IdentifyPage';
import FilterTestPage from './pages/FilterTestPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="browse/:verticalId" element={<BrowseVertical />} />
        <Route path="part/:partId" element={<PartDetail />} />
        <Route path="identify" element={<IdentifyPage />} />
        <Route path="glossary" element={<Glossary />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="filter-test" element={<FilterTestPage />} />
        <Route path="filter-test/:verticalId" element={<FilterTestPage />} />
      </Route>
    </Routes>
  );
}
