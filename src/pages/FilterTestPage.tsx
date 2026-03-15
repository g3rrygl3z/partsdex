import BrowseVertical from './BrowseVertical';

export default function FilterTestPage() {
  // This page simply renders the BrowseVertical filter UI for testing/demo purposes.
  // You can add more test harnesses or mock data as needed.
  return (
    <div className="p-8">
      <div style={{color: 'lime', background: 'black', padding: 8, fontWeight: 'bold'}}>DEBUG: FilterTestPage rendered</div>
      <h1 className="heading-xl mb-6">Filter UI Test Page</h1>
      <BrowseVertical />
    </div>
  );
}
