import { useState, useRef, useCallback } from "react";
import { getAllParts } from "../utils/search";
import type { NormalizedPart } from "../utils/search";

// -- Mobile Debug Logging -----------------------------------------------------
const log = (msg: string) => {
  console.log(`[PhotoID Hook] ${msg}`);
  if (typeof window !== 'undefined') {
    (window as any)._photoIdLogs = (window as any)._photoIdLogs || [];
    (window as any)._photoIdLogs.unshift(`${new Date().toLocaleTimeString()}: ${msg}`);
    (window as any)._photoIdLogs = (window as any)._photoIdLogs.slice(0, 50);
    window.dispatchEvent(new CustomEvent('photo-id-log'));
  }
};

// -- Slim parts context for vision prompt -------------------------------------
function buildVisionSystemPrompt(parts: NormalizedPart[]) {
  const slimParts = parts.map((p) => ({
    id:             p.id,
    sku:            p.modelNumber,
    name:           p.name,
    aliases:        p.aliases?.slice(0, 5),
    category:       p.vertical,
    subCategory:    p.subcategory,
    manufacturer:   p.manufacturer,
    connectionType: p.connectionType,
    materials:      p.materials,
    overview:       p.description?.slice(0, 150),
    tags:           p.tags?.slice(0, 8),
  }));

  return `You are the visual identification engine for PartsDex, a field reference app for plumbing, HVAC, and boiler/heating technicians.

A field technician has taken a photo of a part they cannot identify. Your job is to analyze the image and match it to the parts database below.

PARTS DATABASE:
${JSON.stringify(slimParts, null, 0)}

IDENTIFICATION APPROACH:
- Look at the shape, color, material finish, connection ends, and any visible markings
- Carbon steel press fittings (BenchPress): silver/zinc-plated, have a distinctive crimped groove ring at each end
- Push-to-connect fittings: brass/silver, have a visible collet/grip ring collar at each end
- Expansion tanks: cylindrical steel vessels — blue/teal = potable water, grey = hydronic heating, burgundy/red = ASME commercial
- Relief valves: brass body, spring-loaded, usually have a lever or test handle
- Ball valves: brass or steel body with a lever handle perpendicular to the pipe

RULES:
1. Respond ONLY with valid JSON — no prose, no markdown fences outside the JSON.
2. Response format:
{
  "matches": [
    {
      "id": "exact-part-id-from-database",
      "confidence": 0.95,
      "reasoning": "one sentence explaining the visual match"
    }
  ],
  "visualDescription": "brief description of what you see in the image",
  "identificationNotes": "any caveats or things to look for to confirm the ID",
  "confident": true
}
3. Return 1–3 best matches ordered by confidence (0.0–1.0).
4. If the image is too blurry, too dark, or you genuinely cannot identify the part, set "confident": false and explain in "identificationNotes".
5. All "id" values must exactly match ids in the database.
6. Be honest about uncertainty — a wrong confident ID is worse than an uncertain one.`;
}

// -- Image helpers -------------------------------------------------------------

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:... prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(file: Blob, maxSize = 1024): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/jpeg", 0.88);
      }
    };
    img.src = url;
  });
}

export interface PhotoMatch {
  id: string;
  confidence: number;
  reasoning: string;
  part: NormalizedPart;
}

export interface PhotoIdentifyResult {
  status: "idle" | "processing" | "success" | "error";
  preview: string | null;
  matches: PhotoMatch[];
  visualDesc: string;
  idNotes: string;
  isConfident: boolean | null;
  error: string | null;
  identifyImage: (file: File | Blob) => Promise<void>;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCapture: (blob: Blob) => void;
  reset: () => void;
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

const normalizedParts = getAllParts();
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check key availability on load
if (!GEMINI_API_KEY) {
  log("Error: VITE_GEMINI_API_KEY is undefined in this build.");
} else {
  log(`Gemini Key found (starts with: ${GEMINI_API_KEY.slice(0, 8)}...)`);
}


export function usePhotoIdentify(): PhotoIdentifyResult {
  const [status,       setStatus]       = useState<"idle" | "processing" | "success" | "error">("idle");
  const [preview,      setPreview]      = useState<string | null>(null);
  const [matches,      setMatches]      = useState<PhotoMatch[]>([]);
  const [visualDesc,   setVisualDesc]   = useState("");
  const [idNotes,      setIdNotes]      = useState("");
  const [isConfident,  setIsConfident]  = useState<boolean | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  const systemPrompt = useRef(buildVisionSystemPrompt(normalizedParts));
  const abortRef     = useRef<AbortController | null>(null);

  const identifyImage = useCallback(async (file: File | Blob) => {
    if (!file) return;

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    log(`Identifying image: ${file instanceof File ? file.name : 'Blob'}`);
    setStatus("processing");
    setMatches([]);
    setVisualDesc("");
    setIdNotes("");
    setIsConfident(null);
    setError(null);

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured.");
      }

      const resized  = await resizeImage(file);
      log(`Resized to blob: ${resized.size} bytes`);
      const b64      = await fileToBase64(resized);
      log("Converted to Base64");
      const mimeType = "image/jpeg";

      log("Requesting Gemini identification via REST v1...");
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt.current },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: b64
                }
              },
              { text: "Please identify this plumbing/HVAC/heating part from the photo. You MUST return ONLY valid JSON, no markdown, no explanation." }
            ]
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `API error ${response.status}`;
        log(`API Error: ${errMsg}`);
        throw new Error(errMsg);
      }

      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      log(`Received response from Gemini: ${raw?.length || 0} chars`);
      if (!raw) throw new Error("No response from AI.");
      log(`Raw response: ${raw.slice(0, 500)}`);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      log(`Parsed ${(parsed.matches || []).length} raw matches from Gemini`);

      const hydratedMatches = (parsed.matches || [])
        .map((m: any) => {
          const found = normalizedParts.find((p) => p.id === m.id);
          if (!found) {
            log(`⚠️ Match ID "${m.id}" not found in parts database — dropping`);
            // Attempt fuzzy ID match (e.g. Gemini might return "compression_fitting" instead of "compression-fitting")
            const fuzzyMatch = normalizedParts.find(
              (p) => p.id.replace(/-/g, '').toLowerCase() === (m.id || '').replace(/[-_\s]/g, '').toLowerCase()
            );
            if (fuzzyMatch) {
              log(`  ✅ Fuzzy matched to "${fuzzyMatch.id}"`);
              return { ...m, id: fuzzyMatch.id, part: fuzzyMatch };
            }
          } else {
            log(`✅ Match: "${m.id}" → ${found.name} (conf: ${m.confidence})`);
          }
          return { ...m, part: found };
        })
        .filter((m: any) => m.part) as PhotoMatch[];

      setMatches(hydratedMatches);
      setVisualDesc(parsed.visualDescription || "");
      setIdNotes(parsed.identificationNotes  || "");
      setIsConfident(parsed.confident !== false);
      log(`Success! Found ${hydratedMatches.length} hydrated matches.`);
      setStatus("success");

    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Photo ID error:", err);
      setError(err.message || "Identification failed. Please try again.");
      setStatus("error");
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) identifyImage(file);
  }, [identifyImage]);

  const handleCapture = useCallback((blob: Blob) => {
    if (blob) identifyImage(blob);
  }, [identifyImage]);

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    if (preview) URL.revokeObjectURL(preview);
    setStatus("idle");
    setPreview(null);
    setMatches([]);
    setVisualDesc("");
    setIdNotes("");
    setIsConfident(null);
    setError(null);
  }, [preview]);

  return {
    status,
    preview,
    matches,
    visualDesc,
    idNotes,
    isConfident,
    error,
    identifyImage,
    handleFileInput,
    handleCapture,
    reset,
    isProcessing: status === "processing",
    isSuccess:    status === "success",
    isError:      status === "error",
    isIdle:       status === "idle",
  };
}
