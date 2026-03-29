import { GoogleGenAI } from '@google/genai'
import rawRelationships from '../data/partRelationships.json'
import { getPartById, getPartsBySubcategory } from './search'
import type { NormalizedPart } from './search'
import type { PartRelationship, LinkedPart, RelationshipType } from '../types'

// ── Typed relationships from JSON ─────────────────────────────────────────────
const relationships: PartRelationship[] = rawRelationships as PartRelationship[]

// ── Gemini client (reuse existing env key) ────────────────────────────────────
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const PRO_TIP_SYSTEM_INSTRUCTION = `
You are a seasoned HVAC, plumbing, and boiler-heating field technician advisor.
A technician just scanned or viewed a part in the PartsDex field reference app.
Based on the part information and its known related parts, provide a single concise
"Pro Tip" — a practical, safety-focused, or efficiency-boosting piece of advice
that a journeyman technician would appreciate on-site.

Rules:
- Keep it to 2-3 sentences max.
- Be practical and specific (not generic advice).
- If there are safety items among the related parts, mention them.
- Write in a friendly, conversational tone — like advice from a senior tech.
- Do NOT use markdown formatting. Just plain text.
`

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get related parts for a given part ID.
 *
 * Sources (merged, deduplicated, priority order):
 * 1. Curated relationships from partRelationships.json (with specific types & reasons)
 * 2. Parts listed in the part's own `compatibleWith` array (if IDs resolve)
 * 3. Other parts in the same subcategory (as "related" fallback)
 */
export function getLinkedParts(partId: string): LinkedPart[] {
    const seen = new Set<string>()
    const result: LinkedPart[] = []
    seen.add(partId) // don't recommend yourself

    // 1. Curated relationships (highest priority — specific types and reasons)
    const curated = relationships.filter(r => r.parentPartId === partId)
    for (const r of curated) {
        const part = getPartById(r.relatedPartId)
        if (!part) continue
        seen.add(r.relatedPartId)
        result.push({
            part: part as any,
            type: r.type as RelationshipType,
            reason: r.reason,
        })
    }

    // 2. compatibleWith from parts.json (if IDs resolve to actual parts)
    const sourcePart = getPartById(partId)
    if (sourcePart && sourcePart.compatibleWith) {
        for (const compatId of sourcePart.compatibleWith) {
            if (seen.has(compatId)) continue
            const part = getPartById(compatId)
            if (!part) continue
            seen.add(compatId)
            const partName = (part as any).name || part.primaryName
            result.push({
                part: part as any,
                type: 'COMMONLY_PAIRED' as RelationshipType,
                reason: `Compatible part — ${partName} is commonly used together on the same installation`,
            })
        }
    }

    // 3. Fallback: if we still have no recommendations, find related parts
    //    from the same subcategory within the same vertical
    if (result.length === 0 && sourcePart) {
        const np = sourcePart as NormalizedPart
        const siblings = getPartsBySubcategory(np.vertical, np.subcategory)
            .filter(p => !seen.has(p.id))
            .slice(0, 4)

        for (const sib of siblings) {
            seen.add(sib.id)
            result.push({
                part: sib as any,
                type: 'COMMONLY_PAIRED' as RelationshipType,
                reason: `Related ${np.subcategory} part — often found in the same system or job`,
            })
        }
    }

    // Cap at 6 recommendations max to keep the UI clean
    return result.slice(0, 6)
}

/**
 * Generate an AI Pro Tip for a part using Gemini.
 * Returns null if the API key is missing or the call fails.
 */
export async function getProTip(
    partName: string,
    partDescription: string,
    linkedParts: LinkedPart[]
): Promise<string | null> {
    if (!ai) {
        console.warn('[Recommendations] No Gemini API key — skipping Pro Tip')
        return null
    }

    try {
        const linkedSummary = linkedParts
            .map(lp => `${(lp.part as any).name || lp.part.primaryName} (${lp.type}: ${lp.reason})`)
            .join('\n')

        const prompt = `
The technician is viewing: ${partName}
Description: ${partDescription}

Known related parts:
${linkedSummary || 'None found in database.'}

Based on your knowledge of HVAC/Plumbing/Heating, provide a practical "Pro Tip" for working with this part.
`

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: PRO_TIP_SYSTEM_INSTRUCTION,
            },
        })

        return response.text?.trim() || null
    } catch (error) {
        console.error('[Recommendations] Pro Tip generation failed:', error)
        return null
    }
}
