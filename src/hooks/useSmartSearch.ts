import { useState, useEffect, useRef, useCallback } from "react";
import Fuse from "fuse.js";
import { getAllParts } from "../utils/search";
import type { NormalizedPart } from "../utils/search";

// -- Fuse.js config ------------------------------------------------------------
const normalizedParts = getAllParts();

const fuse = new Fuse(normalizedParts, {
  keys: [
    { name: "name",          weight: 0.35 },
    { name: "aliases",       weight: 0.30 },
    { name: "modelNumber",   weight: 0.20 },
    { name: "tags",          weight: 0.10 },
    { name: "description",   weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
});

// -- Claude system prompt ------------------------------------------------------
function buildSystemPrompt() {
  const slimParts = normalizedParts.map((p) => ({
    id:          p.id,
    sku:         p.modelNumber,
    name:        p.name,
    aliases:     p.aliases,
    category:    p.vertical,
    subCategory: p.subcategory,
    overview:    p.description?.slice(0, 200),
    applications:p.applications,
    tags:        p.tags,
    manufacturer:p.manufacturer,
    connectionType: p.connectionType,
    materials:   p.materials,
  }));

  return `You are the AI search engine for PartsDex, a field reference app for plumbing, HVAC, and boiler/heating technicians.

Your job: given a natural language query from a field technician, identify the most relevant parts from the database below and return them as a JSON array.

PARTS DATABASE:
${JSON.stringify(slimParts, null, 0)}

RULES:
1. Always respond with ONLY a valid JSON object — no prose, no markdown, no explanation outside the JSON.
2. Response format:
{
  "results": ["part-id-1", "part-id-2", "part-id-3"],
  "explanation": "one sentence explaining what you found and why",
  "confidence": "high" | "medium" | "low"
}
3. Return 1–6 most relevant part IDs. Never return more than 6.
4. "results" must be an array of id strings that exactly match the database.
5. If the query is too vague to return confident results, return an empty array and set confidence to "low".
6. Understand trade slang, misspellings, and partial descriptions.
7. Consider the context of the trade.`;
}

// -- Debounce helper ------------------------------------------------------------
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// -- Main hook -----------------------------------------------------------------
export function useSmartSearch() {
  const [query,        setQuery]        = useState("");
  const [results,      setResults]      = useState<NormalizedPart[]>([]);
  const [aiResults,    setAiResults]    = useState<NormalizedPart[]>([]);
  const [isAiLoading,  setIsAiLoading]  = useState(false);
  const [aiExplanation,setAiExplanation]= useState("");
  const [aiConfidence, setAiConfidence] = useState<string | null>(null);
  const [aiError,      setAiError]      = useState<string | null>(null);
  const [mode,         setMode]         = useState<"local" | "ai">("local");

  const debouncedQuery = useDebounce(query, 180);  
  const aiDebounced    = useDebounce(query, 900);  
  const abortRef       = useRef<AbortController | null>(null);
  const systemPrompt   = useRef(buildSystemPrompt());

  // -- Local Fuse.js search (instant) ----------------------------------------
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setMode("local");
      return;
    }
    const fuseResults = fuse.search(debouncedQuery).map((r) => r.item);
    setResults(fuseResults.slice(0, 8));
  }, [debouncedQuery]);

  // -- AI search (triggered when local results are weak or query is long) ----
  useEffect(() => {
    const q = aiDebounced.trim();

    const wordCount   = q.split(/\s+/).filter(Boolean).length;
    const weakResults = results.length < 2;
    const isNatural   = wordCount >= 2;

    if (!q || (!isNatural && !weakResults)) {
      setAiResults([]);
      setAiExplanation("");
      setAiConfidence(null);
      return;
    }

    if (!GEMINI_API_KEY) {
      setAiError("Gemini API key not configured.");
      setMode("local");
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const runAiSearch = async () => {
      setIsAiLoading(true);
      setAiError(null);
      setMode("ai");

      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt.current }]
            },
            contents: [{
              parts: [{ text: `Search query from a field technician: "${q}"\n\nReturn the matching part IDs as JSON.` }]
            }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `API error ${response.status}`);
        }

        const data = await response.json();
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!raw) throw new Error("No response from AI.");
        const clean = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        const matchedParts = (parsed.results || [])
          .map((id: string) => normalizedParts.find((p) => p.id === id))
          .filter(Boolean) as NormalizedPart[];

        setAiResults(matchedParts);
        setAiExplanation(parsed.explanation || "");
        setAiConfidence(parsed.confidence || "medium");
      } catch (err: any) {
        if (err.name === "AbortError") return; 
        console.error("Smart search error:", err);
        setAiError("AI search unavailable.");
        setMode("local");
      } finally {
        setIsAiLoading(false);
      }
    };

    runAiSearch();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [aiDebounced, results.length]);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setAiResults([]);
    setAiExplanation("");
    setAiConfidence(null);
    setAiError(null);
    setMode("local");
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const displayResults = mode === "ai" && aiResults.length > 0
    ? [
        ...aiResults,
        ...results.filter((r) => !aiResults.find((a) => a.id === r.id)),
      ].slice(0, 8)
    : results;

  return {
    query,
    setQuery,
    results: displayResults,
    isAiLoading,
    aiExplanation,
    aiConfidence,
    aiError,
    mode,
    clear,
    hasResults:  displayResults.length > 0,
    isEmpty:     query.trim().length > 0 && displayResults.length === 0 && !isAiLoading,
  };
}
