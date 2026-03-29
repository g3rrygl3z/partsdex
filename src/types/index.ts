// PartsDex — shared TypeScript types
// Michael owns this file; Gary imports from here for UI components.

export type Vertical = 'plumbing' | 'hvac' | 'boiler-heating'

export interface Part {
    id: string               // Unique slug, e.g. "compression-fitting-15mm"
    primaryName: string      // Canonical, most widely recognized name
    aliases: string[]        // All trade names, regional names, slang, manufacturer terms
    category: Vertical
    subCategory: string      // e.g. "fittings", "valves", "ductwork", "controls"
    overview: string         // Plain-English: what it is, what it does, typical applications
    diagramUrl: string       // Path to diagram asset, e.g. "/assets/diagrams/compression-fitting-15mm.svg"
    images?: string[]        // Optional collection of product images
    compatibleWith: string[] // Part IDs this connects to
    materials: string[]      // e.g. ["copper", "brass", "PVC", "stainless"]
    installationNotes: string
    tags: string[]           // Free-form search tags e.g. ["compression", "push-fit"]
    manufacturer?: string    // Optional manufacturer name, e.g. "NIBCO"
    modelNumber?: string     // Optional manufacturer-specific SKU/number
    applications?: string[]  // Optional specific use cases
    connectionType?: string  // Optional, e.g. "Push", "Compression", "Press"
}

export interface AliasEntry {
    alias: string
    partId: string           // Maps to Part.id
    context: string          // e.g. "UK trade term", "Manufacturer brand name"
    vertical: Vertical
}

export interface SubCategory {
    id: string
    label: string
}

export interface Category {
    id: Vertical
    label: string
    icon: string             // Lucide icon name
    subCategories: SubCategory[]
}

export interface SearchResult {
    item: Part
    score?: number
}

export type RelationshipType = 'COMMONLY_PAIRED' | 'SAFETY' | 'MAINTENANCE_KIT' | 'UPGRADE' | 'ACCESSORY'

export interface PartRelationship {
    parentPartId: string
    relatedPartId: string
    type: RelationshipType
    reason: string
}

export interface LinkedPart {
    part: Part
    type: RelationshipType
    reason: string
}

export interface RecommendationResult {
    linkedParts: LinkedPart[]
    proTip: string | null
    loading: boolean
    error: string | null
}
