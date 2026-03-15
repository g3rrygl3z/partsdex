import { useParams } from 'react-router-dom';
import BrowseVertical from './BrowseVertical';

export default function FilterTestPage() {
  // This page simply renders the BrowseVertical filter UI for testing/demo purposes.
  // You can add more test harnesses or mock data as needed.
  return (
    <div className="p-8">
      <h1 className="heading-xl mb-6">Component Library</h1>
      <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5">
        <BrowseVerticalTestWrapper />
      </div>
    </div>
  );
}

function BrowseVerticalTestWrapper() {
  const { verticalId } = useParams();
  // If no verticalId in URL, we show plumbing components by default
  if (!verticalId) {
    return (
      <div className="opacity-90">
        <BrowseVertical />
      </div>
    );
  }
  return <BrowseVertical />;
}
