import { GoogleGenAI } from '@google/genai'

// Initialize the API using the new official @google/genai library.
// We expect VITE_GEMINI_API_KEY to be available in the environment variables.
const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'MISSING_API_KEY',
})

const NANO_BANANA_SYSTEM_INSTRUCTION = `
You are Nano Banana 2, an advanced technical plumbing and HVAC visualization assistant. 
Your objective is to generate structural, material, and directional flow data for specific 
industrial parts to aid in our frontend 3D/Parallax visualization rendering.

Specifically focus your data output when asked about:
- Expansion Tanks
- Booster Pumps
- Heating Units

Provide the response as an exact JSON object containing:
- "flowDirection": (e.g., "in-out", "bidirectional", "radial")
- "criticalConnections": array of string descriptions
- "surfaceTexture": (e.g., "metallic-gloss", "matte-cast-iron")
- "visualizationNotes": a string with hints for how to color or light the object
`

export type VisualizationData = {
    flowDirection: string
    criticalConnections: string[]
    surfaceTexture: string
    visualizationNotes: string
}

/**
 * Fetches dynamic visualization structural data from the Gemini API via our Nano Banana 2 prompt.
 */
export async function fetchNanoBananaVisualizationData(partName: string): Promise<VisualizationData | null> {
    // Guard clause specifically targeting the user's requested components per the roadmap
    const allowedParts = ['expansion tank', 'booster pump', 'heating unit']
    const isAllowed = allowedParts.some(p => partName.toLowerCase().includes(p))

    if (!isAllowed) {
        return null // We only want the AI overhead for the complex visualization parts
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please provide internal visualization structure data for the following part: ${partName}`,
            config: {
                systemInstruction: NANO_BANANA_SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
            }
        })

        if (response.text) {
            const data = JSON.parse(response.text) as VisualizationData
            return data
        }

        return null
    } catch (error) {
        console.error("Nano Banana 2 (Gemini API) Error:", error)
        return null
    }
}
