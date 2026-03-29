import { describe, it, expect } from 'vitest'
import { getLinkedParts } from '../recommendationService'

describe('recommendationService', () => {
    describe('getLinkedParts', () => {
        it('returns linked parts for compression-fitting', () => {
            const results = getLinkedParts('compression-fitting')
            expect(results.length).toBeGreaterThan(0)

            // Should include copper-elbow as a commonly paired part
            const elbowLink = results.find(r => r.part.id === 'copper-elbow')
            expect(elbowLink).toBeDefined()
            expect(elbowLink!.type).toBe('COMMONLY_PAIRED')
            expect(elbowLink!.reason).toBeTruthy()
        })

        it('returns linked parts for expansion-vessel', () => {
            const results = getLinkedParts('expansion-vessel')
            expect(results.length).toBeGreaterThan(0)

            // Should include pressure-relief-valve as a safety part
            const prvLink = results.find(r => r.part.id === 'pressure-relief-valve')
            expect(prvLink).toBeDefined()
            expect(prvLink!.type).toBe('SAFETY')
        })

        it('returns empty array for nonexistent part ID', () => {
            const results = getLinkedParts('nonexistent-part-xyz')
            expect(results).toEqual([])
        })

        it('returns empty array for empty string', () => {
            const results = getLinkedParts('')
            expect(results).toEqual([])
        })

        it('hydrates linked parts with full part data', () => {
            const results = getLinkedParts('txv')
            expect(results.length).toBeGreaterThan(0)

            // Each result should have a hydrated part object
            for (const lp of results) {
                expect(lp.part).toBeDefined()
                expect(lp.part.id).toBeTruthy()
                expect(lp.type).toBeTruthy()
                expect(lp.reason).toBeTruthy()
            }
        })

        it('includes maintenance kit relationships for txv', () => {
            const results = getLinkedParts('txv')
            const maintenanceLinks = results.filter(r => r.type === 'MAINTENANCE_KIT')
            expect(maintenanceLinks.length).toBeGreaterThan(0)
        })
    })
})
