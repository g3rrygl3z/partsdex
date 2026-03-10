import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import partsData from '@/data/parts.json'
import categoriesData from '@/data/categories.json'
import { buildAliasList } from '@/utils/dataHelpers'
import type { Part, Category, Vertical } from '@/types'

const parts = partsData as Part[]
const categories = categoriesData as Category[]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const VERTICAL_LABELS: Record<Vertical, string> = {
    'plumbing': 'Plumbing',
    'hvac': 'HVAC',
    'boiler-heating': 'Boiler & Heating',
}

const BADGE_CLASS: Record<Vertical, string> = {
    'plumbing': 'badge-plumbing',
    'hvac': 'badge-hvac',
    'boiler-heating': 'badge-boiler',
}

export default function Glossary() {
    const [verticalFilter, setVerticalFilter] = useState<Vertical | 'all'>('all')
    const [letterFilter, setLetterFilter] = useState<string | null>(null)

    const allAliases = useMemo(() => buildAliasList(parts), [])

    const filtered = useMemo(() => {
        let list = allAliases
        if (verticalFilter !== 'all') {
            list = list.filter(e => e.vertical === verticalFilter)
        }
        if (letterFilter) {
            list = list.filter(e =>
                e.alias.toUpperCase().startsWith(letterFilter)
            )
        }
        return list
    }, [allAliases, verticalFilter, letterFilter])

    // Group by first letter for display
    const grouped = useMemo(() => {
        const map = new Map<string, typeof filtered>()
        for (const entry of filtered) {
            const letter = entry.alias[0]?.toUpperCase() ?? '#'
            if (!map.has(letter)) map.set(letter, [])
            map.get(letter)!.push(entry)
        }
        return map
    }, [filtered])

    const activeLetters = useMemo(
        () => new Set(filtered.map(e => e.alias[0]?.toUpperCase())),
        [filtered]
    )

    return (
        <div className="min-h-screen bg-bgGray pb-24">
            {/* Header */}
            <header className="bg-primary sticky top-0 z-10 shadow-md">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-white/70 hover:text-white text-sm transition-colors">
                        ← PartsDex
                    </Link>
                    <h1 className="text-white font-bold text-lg">Trade Term Glossary</h1>
                    <span className="text-white/70 text-sm">{filtered.length} terms</span>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
                {/* Vertical filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        id="glossary-filter-all"
                        onClick={() => setVerticalFilter('all')}
                        className={`px-4 py-2 rounded-badge text-sm font-semibold transition-colors min-h-[44px] ${verticalFilter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-white text-textMuted border border-gray-200 hover:border-primary'
                            }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            id={`glossary-filter-${cat.id}`}
                            onClick={() => setVerticalFilter(cat.id as Vertical)}
                            className={`px-4 py-2 rounded-badge text-sm font-semibold transition-colors min-h-[44px] ${verticalFilter === cat.id
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-textMuted border border-gray-200 hover:border-primary'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* A–Z bar */}
                <div className="flex flex-wrap gap-1">
                    <button
                        id="glossary-letter-all"
                        onClick={() => setLetterFilter(null)}
                        className={`w-9 h-9 rounded text-sm font-semibold transition-colors ${!letterFilter ? 'bg-primary text-white' : 'bg-white text-textMuted hover:bg-gray-100'
                            }`}
                    >
                        All
                    </button>
                    {ALPHABET.map(letter => (
                        <button
                            key={letter}
                            id={`glossary-letter-${letter}`}
                            onClick={() => setLetterFilter(letter)}
                            disabled={!activeLetters.has(letter)}
                            className={`w-9 h-9 rounded text-sm font-semibold transition-colors ${letterFilter === letter
                                    ? 'bg-primary text-white'
                                    : activeLetters.has(letter)
                                        ? 'bg-white text-textDark hover:bg-gray-100'
                                        : 'bg-white text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-textMuted">
                        <p className="text-xl mb-2">No terms found</p>
                        <p className="text-sm">Try a different filter or letter</p>
                    </div>
                ) : (
                    Array.from(grouped.entries()).map(([letter, entries]) => (
                        <section key={letter} id={`glossary-section-${letter}`}>
                            <h2 className="text-2xl font-bold text-primary mb-3 border-b border-gray-200 pb-1">
                                {letter}
                            </h2>
                            <ul className="space-y-2">
                                {entries.map((entry, i) => (
                                    <li key={`${entry.alias}-${i}`}>
                                        <Link
                                            to={`/parts/${entry.partId}`}
                                            id={`glossary-entry-${entry.alias.replace(/\s+/g, '-').toLowerCase()}`}
                                            className="flex items-center justify-between bg-white rounded-xl px-4 py-3
                                 border border-gray-100 hover:border-primary hover:shadow-sm
                                 transition-all duration-150 group"
                                        >
                                            <div>
                                                <span className="font-medium text-textDark group-hover:text-primary transition-colors">
                                                    {entry.alias}
                                                </span>
                                                <span className="text-textMuted text-sm ml-2">→ {entry.primaryName}</span>
                                            </div>
                                            <span className={BADGE_CLASS[entry.vertical]}>
                                                {VERTICAL_LABELS[entry.vertical]}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))
                )}
            </main>
        </div>
    )
}
