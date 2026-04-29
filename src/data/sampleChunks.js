export const SAMPLE_CHUNKS = [
  {
    chunk_id: 'chunk_1',
    bab: 'Dokumen Aplikasi',
    pasal: 'Bagian 1',
    ayat: '(A)',
    text: 'Arsitektur aplikasi memisahkan frontend React sebagai antarmuka dan backend service sebagai mesin retrieval serta pemrosesan jawaban LLM.'
  },
  {
    chunk_id: 'chunk_2',
    bab: 'Dokumen Aplikasi',
    pasal: 'Bagian 1',
    ayat: '(B)',
    text: 'Mode Demo Lokal menjalankan retrieval simulasi langsung di frontend sehingga aplikasi tetap bisa diuji ketika backend belum aktif.'
  },
  {
    chunk_id: 'chunk_3',
    bab: 'Dokumen Integrasi',
    pasal: 'Bagian 2',
    ayat: '(A)',
    text: 'Untuk mode Backend API, pengguna harus mengisi URL service lalu memilih mode retrieval agar query diproses oleh endpoint backend.'
  },
  {
    chunk_id: 'chunk_4',
    bab: 'Dokumen Integrasi',
    pasal: 'Bagian 2',
    ayat: '(B)',
    text: 'Frontend mencoba endpoint fallback secara otomatis untuk search, ask, dan upload agar kompatibel dengan variasi implementasi backend.'
  },
  {
    chunk_id: 'chunk_5',
    bab: 'Dokumen Upload',
    pasal: 'Bagian 3',
    ayat: '(A)',
    text: 'Fitur upload menerima berkas PDF dokumentasi dan mengirimkannya sebagai multipart form-data ke endpoint backend.'
  },
  {
    chunk_id: 'chunk_6',
    bab: 'Dokumen Retrieval',
    pasal: 'Bagian 4',
    ayat: '(A)',
    text: 'BM25 Retrieval menekankan kecocokan kata kunci sehingga efektif untuk query yang mengandung istilah persis dari dokumen.'
  },
  {
    chunk_id: 'chunk_7',
    bab: 'Dokumen Retrieval',
    pasal: 'Bagian 4',
    ayat: '(B)',
    text: 'Semantic Retrieval mengutamakan kemiripan makna sehingga tetap relevan saat istilah query tidak identik dengan teks dokumen.'
  },
  {
    chunk_id: 'chunk_8',
    bab: 'Dokumen Retrieval',
    pasal: 'Bagian 4',
    ayat: '(C)',
    text: 'Hybrid Retrieval menggabungkan sinyal BM25 dan semantic score sehingga hasil akhir lebih stabil untuk berbagai tipe pertanyaan.'
  },
  {
    chunk_id: 'chunk_9',
    bab: 'Dokumen LLM',
    pasal: 'Bagian 5',
    ayat: '(A)',
    text: 'Mode Tanya LLM dengan provider Ollama berjalan untuk skenario lokal dan cocok saat tim ingin pengujian tanpa ketergantungan layanan eksternal.'
  },
  {
    chunk_id: 'chunk_10',
    bab: 'Dokumen LLM',
    pasal: 'Bagian 5',
    ayat: '(B)',
    text: 'Mode Tanya LLM dengan provider OpenAI membutuhkan API key yang valid dan sebaiknya dikirim aman melalui backend, bukan disimpan permanen di browser.'
  }
]
