// Import library yang diperlukan
import express from "express"; // Framework untuk membuat server
import cors from "cors"; // Untuk handle izin akses antar domain (CORS)
import { PrismaClient } from "@prisma/client"; // ORM untuk berinteraksi dengan database
import { request } from "http"; // (TIDAK DIGUNAKAN, bisa dihapus)

// Inisialisasi aplikasi Express dan Prisma
const app = express();
const prisma = new PrismaClient();

// Middleware untuk parsing request body JSON dan mengizinkan CORS
app.use(express.json());
app.use(cors());

// --------------------------------------------
// ENDPOUNT: GET ALL NOTES (Mengambil semua catatan)
// --------------------------------------------
app.get("/api/notes", async (req, res) => {
  // Ambil semua data note dari database menggunakan Prisma
  const notes = await prisma.note.findMany();

  // Kirim respon dalam format JSON
  res.json(notes);
});

// --------------------------------------------
// ENDPOINT: CREATE NOTE (Membuat catatan baru)
// --------------------------------------------
app.post("/api/notes", async (req, res) => {
  // Ambil data dari body request
  const { title, content } = req.body;

  // Validasi: Pastikan title dan content ada
  if (!title || !content) {
    res.status(400).send("title and content fields required");
    return; // Hentikan eksekusi jika validasi gagal
  }

  try {
    // Simpan data ke database menggunakan Prisma
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note); // Kirim data note yang baru dibuat
  } catch (error) {
    res.status(500).send("Oops something went wrong"); // Handle error server
  }
});

// --------------------------------------------
// ENDPOINT: UPDATE NOTE (Memperbarui catatan)
// --------------------------------------------
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id); // Konversi id dari string ke number

  // Validasi input
  if (!title || !content) {
    res.status(400).send("title and content fields required");
    return;
  }

  if (!id || isNaN(id)) {
    // Pastikan id valid
    res.status(400).send("ID must be a valid number");
    return;
  }

  try {
    // Update data di database menggunakan Prisma
    const updatedNote = await prisma.note.update({
      where: { id }, // Cari note berdasarkan id
      data: { title, content }, // Data yang diupdate
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("oops, something went wrong");
  }
});

// --------------------------------------------
// ENDPOINT: DELETE NOTE (Menghapus catatan)
// --------------------------------------------
app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Validasi id
  if (!id || isNaN(id)) {
    res.status(400).send("ID must be valid integer");
    return;
  }

  try {
    // Hapus data dari database
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send(); // Respon sukses tanpa konten (204 No Content)
  } catch (error) {
    res.status(500).send("oops, something went wrong");
  }
});

// Jalankan server di port 5000
app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
