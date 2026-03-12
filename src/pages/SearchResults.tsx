import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import partsData from '@/data/parts.json'
import type { Part } from '@/types'

const allParts = partsData as Part[]

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const queryParam = searchParams.get('q') || ''

    const { query, setQuery, results, isSearching } = useSearch(allParts)

    // Sync URL ?q= into the search hook when the page loads or URL changes
    useEffect(() => {
        if (queryParam && queryParam !== query) {
            setQuery(queryParam)
        }
    }, [queryParam, query, setQuery])

    return (
        <div className="min-h-screen bg-bgGray p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">

                <header className="mb-8">
                    <Link to="/" className="text-primary text-sm font-semibold hover:underline mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-textDark mb-2">Search Results</h1>
                    <p className="text-textMuted">
                        Showing results for <span className="font-semibold text-textDark">"{queryParam}"</span>
                    </p>
                </header>

                {isSearching ? (
                    <div className="text-textMuted py-8">Searching database...</div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((part) => (
                            /* PartCard Stub — Michael's data binding, Gary's future styling */
                            <Link
                                key={part.id}
                                to={`/parts/${part.id}`}
                                className="part-card block p-4 flex flex-col h-full"
                            >
                                <div className="aspect-square bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-4 mb-4">
                                    <img
                                        src={part.diagramUrl}
                                        alt={part.primaryName}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48bWFya2VyIGlkPSJtIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjUiIHJlZlk9IjUiPjxjaXJjbGUgY3g9IjUiIGN5PSI1IiByPSI1IiBmaWxsPSIjY2NjIi8+PC9tYXJrZXI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJhcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
                                        }}
                                    />
                                </div>

                                <h3 className="text-part-name mb-1">{part.primaryName}</h3>
                                <div className="mb-2">
                                    <span className={`badge-${part.category}`}>
                                        {part.category.replace('-', ' ')}
                                    </span>
                                </div>
                                <p className="text-part-desc text-textMuted line-clamp-2 mt-auto">
                                    {part.overview}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm mt-8">
                        <h2 className="text-xl font-bold text-textDark mb-2">No parts found</h2>
                        <p className="text-textMuted">
                            We couldn't find any exact matches for "{queryParam}". Try checking spelling or using a broader term.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
