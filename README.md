# Retrieval App Frontend

Frontend ini dibuat untuk alur pencarian dan tanya jawab dokumentasi aplikasi berbasis:

- BM25 retrieval
- Semantic retrieval
- Hybrid retrieval
- RAG ke LLM (Ollama atau OpenAI)

## Jalankan Project

```bash
npm install
npm run dev
```

## Fitur Utama

- Dashboard pencarian dengan mode source:
  - Demo Lokal (langsung jalan tanpa backend)
  - Backend API (siap dihubungkan ke service Python)
- Input query + quick query chips
- Kontrol top-k hasil
- Upload PDF (untuk mode backend)
- Tampilkan hasil chunk (BAB/Pasal/Ayat) dengan skor
- Tampilkan hasil chunk (Dokumen/Bagian/Segmen) dengan skor
- Tampilkan jawaban LLM + referensi chunk

## Integrasi Backend

Frontend akan mencoba endpoint berikut secara fallback:

- Search: `/api/search`, `/search`, `/api/retrieve`
- RAG/LLM: `/api/ask`, `/ask`, `/api/rag`
- Upload: `/api/upload`, `/upload`, `/api/documents`

Pastikan backend mengembalikan struktur data JSON yang memuat hasil chunk pada salah satu field:

- `results`
- `data`
- `items`
- `context`

## Build Produksi

```bash
npm run build
npm run preview
```
