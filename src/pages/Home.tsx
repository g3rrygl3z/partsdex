import SearchBar from '@/components/SearchBar'

export default function Home() {
    return (
        <div className="p-8 text-textDark min-h-screen bg-bgGray flex flex-col items-center pt-24">
            <h1 className="text-3xl font-bold text-primary mb-2">PartsDex</h1>
            <p className="text-textMuted mb-8 text-center max-w-sm">
                Plumbing, HVAC & Boiler Parts Identifier. Search by trade name, alias, or keyword.
            </p>

            {/* Search feature — Michael's Day 3 deliverable */}
            <div className="w-full">
                <SearchBar />
            </div>

            <div className="mt-12 text-sm text-gray-400 bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
                <strong className="block mb-2 text-gray-500">Gary's To-Do (Day 3 & 5):</strong>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Hero section design</li>
                    <li>3 Vertical cards (Plumbing, HVAC, Boiler)</li>
                    <li>Recent/Popular parts grid below</li>
                </ul>
            </div>
        </div>
    )
}
