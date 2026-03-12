import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import partsData from '@/data/parts.json'
import type { Part } from '@/types'

const allParts = partsData as Part[]

/**
 * SearchBar — global search input with 200ms debounce Fuse.js fuzzy matching.
 * Includes a dropdown for immediate results, per PRD.
 */
export default function SearchBar() {
    const { query, setQuery, results, isSearching } = useSearch(allParts)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Close dropdown if clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleClear = () => {
        setQuery('')
        setIsOpen(false)
    }

    const handleResultClick = () => {
        setIsOpen(false)
        setQuery('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim().length > 0) {
            setIsOpen(false)
            navigate(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-50">
            <div className="relative flex items-center">
                <div className="absolute left-3 text-textMuted select-none pointer-events-none">
                    <Search size={20} />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by name, alias, or part number..."
                    className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-10
                     text-textDark placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     shadow-sm transition-all duration-200"
                />

                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 text-gray-400 hover:text-textDark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center p-0"
                        aria-label="Clear search"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
                    {isSearching ? (
                        <div className="p-4 text-center text-textMuted text-sm">Searching...</div>
                    ) : results.length > 0 ? (
                        <ul className="py-2">
                            {results.map((part) => (
                                <li key={part.id}>
                                    <Link
                                        to={`/parts/${part.id}`}
                                        onClick={handleResultClick}
                                        className="flex items-center px-4 py-3 hover:bg-bgGray transition-colors group border-b border-gray-50 last:border-0"
                                    >
                                        {/* Thumbnail placeholder or real image */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded overflow-hidden mr-4">
                                            <img
                                                src={part.diagramUrl}
                                                alt={part.primaryName}
                                                className="w-full h-full object-contain p-1 opacity-90 group-hover:opacity-100 transition-opacity"
                                                onError={(e) => {
                                                    // Fallback if image doesn't exist yet
                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9ImFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBkeT0iLjNlbSI+UGFydDwvdGV4dD48L3N2Zz4='
                                                }}
                                            />
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-part-name text-textDark truncate group-hover:text-primary transition-colors">
                                                {part.primaryName}
                                            </h4>
                                            <p className="text-part-desc text-textMuted truncate">
                                                {part.aliases.length > 0 ? `aka: ${part.aliases.slice(0, 2).join(', ')}${part.aliases.length > 2 ? '...' : ''}` : part.subCategory}
                                            </p>
                                        </div>

                                        <div className="ml-2 flex-shrink-0">
                                            <span className={`badge-${part.category} whitespace-nowrap`}>
                                                {part.category.replace('-', ' ')}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-textMuted">
                            <p className="font-semibold mb-1 text-textDark">No results found for "{query}"</p>
                            <p className="text-sm">Try searching by a different name, alias, or keyword.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
