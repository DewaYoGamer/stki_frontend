export const SEARCH_OPTIONS = [
  { value: 'bm25', label: 'BM25 Retrieval' },
  { value: 'semantic', label: 'Semantic Retrieval' },
  { value: 'hybrid', label: 'Hybrid Retrieval' },
  { value: 'llm-ollama', label: 'Tanya LLM (Ollama)' },
  { value: 'llm-openai', label: 'Tanya LLM (OpenAI)' },
]

export function scoreToPercent(item) {
  const raw = Number(item?.final_score ?? item?.score ?? 0)
  if (!Number.isFinite(raw) || raw <= 0) return 0
  if (raw <= 1) return Math.min(100, Math.round(raw * 100))
  return Math.round((1 - 1 / (1 + raw)) * 100)
}

export function formatModeLabel(mode) {
  const found = SEARCH_OPTIONS.find((item) => item.value === mode)
  return found ? found.label : mode
}
