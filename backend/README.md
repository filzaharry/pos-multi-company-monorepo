# POS Backend Coding Flow

Dokumentasi ini menjelaskan alur kodingan di backend, mulai dari **Route**, **Handler (Controller)**, hingga **Model**.

---

## 🏗️ Struktur Proyek

Proyek ini menggunakan struktur standar Go dengan pemisahan tanggung jawab yang jelas dalam direktori `internal/`:

- **`internal/models/`**: Definisi struktur data (Struct) untuk database dan JSON (GORM models).
- **`internal/handlers/`**: Logika bisnis atau _controller_. Di sini tempat data diproses.
- **`internal/routes/`**: Definisi endpoint API dan menghubungkannya ke handler yang sesuai.
- **`pkg/database/`**: Konfigurasi koneksi database (GORM).

---

## 🌊 Flow Kodingan (Step-by-Step)

Secara umum, alur penambahan fitur baru adalah sebagai berikut:

### 1. Buat Model (`internal/models/`)

Tentukan struktur data yang akan disimpan di database.

- Gunakan tag `gorm` untuk pemetaan kolom database.
- Gunakan tag `json` untuk pemetaan output API.

**Contoh (`menu.go`):**

```go
type MasterMenu struct {
    ID             uint           `gorm:"primaryKey" json:"id"`
    Name           string         `json:"name"`
    PermissionSlug *string        `json:"permission_slug"`
    // ... field lainnya
}
```

### 2. Buat Handler (`internal/handlers/`)

Tulis logika bisnis di sini. Handler menerima konteks dari Fiber (`*fiber.Ctx`), melakukan query ke database, dan mengembalikan response JSON.

**Contoh (`menu_handler.go`):**

```go
func GetSidebarMenus(c *fiber.Ctx) error {
    // 1. Ambil data dari context (misal user id dari middleware)
    // 2. Query ke database menggunakan models
    var menus []models.MasterMenu
    database.DB.Find(&menus)

    // 3. Kembalikan response JSON
    return c.JSON(menus)
}
```

### 3. Daftarkan di Route (`internal/routes/`)

Hubungkan URL endpoint ke fungsi handler yang sudah dibuat.

**Contoh (`routes.go`):**

```go
func SetupRoutes(app *fiber.App) {
    api := app.Group("/api/v1")

    // Hubungkan endpoint /menus/sidebar ke handler GetSidebarMenus
    menus := api.Group("/menus")
    menus.Get("/sidebar", handlers.GetSidebarMenus)
}
```

---

## 🛠️ Tools Utama

1.  **[Fiber](https://gofiber.io/)**: Framework web yang digunakan (mirip Express.js di Node.js).
    - `c.JSON()`: Mengirim response JSON.
    - `c.BodyParser()`: Mengambil data dari request body.
    - `c.Params()`: Mengambil parameter URL (misal: `/:id`).
2.  **[GORM](https://gorm.io/)**: ORM untuk interaksi dengan database.
    - `database.DB.Find()`: Ambil semua data.
    - `database.DB.Create()`: Simpan data baru.
    - `database.DB.Save()`: Update data.

---

## 💡 Tips Cepat

- **Ubah Model?** Jangan lupa lakukan migrasi atau sesuaikan database.
- **Butuh Auth?** Gunakan middleware `middleware.AuthRequired` di route.
- **Error Handling?** Selalu cek error setelah query database dan kirim status code yang sesuai (misal: `c.Status(500).JSON(...)`).

## Image

-- http://127.0.0.1:8000/public/uploads/testimonials/1775719772-26ea2c8a-258d-4bea-974f-1f1bfd810ae2.jpg
