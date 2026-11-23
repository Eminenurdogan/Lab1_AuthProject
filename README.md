# Auth Project

Bilgisayar Mühendisliğinde Proje Yönetimi dersi Lab 1 çalışması.
Kullanıcı kayıt, giriş ve şifre sıfırlama modülü. Görevler Jira'daki Kanban panosundan takip ediliyor (AUTH-1 ... AUTH-7).

## Klasörler

- `frontend/` – React + Vite arayüzü
- `backend/` – Express API, veriler `backend/data/db.json` dosyasında tutuluyor

## Çalıştırma

Backend:

```
cd backend
npm install
npm run dev
```

API `http://localhost:5000` adresinde açılır.

Frontend (ayrı terminalde):

```
cd frontend
npm install
npm run dev
```

Arayüz `http://localhost:5173` adresinde açılır, `/api` istekleri backend'e yönlendirilir.

## API

| Metot | Yol | Açıklama |
|-------|-----|----------|
| POST | /api/auth/register | Yeni kullanıcı |
| POST | /api/auth/login | Giriş, JWT döner |
| POST | /api/auth/forgot-password | Sıfırlama kodu üretir |
| POST | /api/auth/reset-password | Kod ile yeni şifre belirleme |

Mail gönderimi olmadığı için sıfırlama kodu backend konsoluna yazdırılıyor.

## Çalışma kuralları

- `main` üzerinde doğrudan çalışılmıyor, her görev için `AUTH-x-kisa-aciklama` şeklinde branch açılıyor.
- Commit mesajları görev koduyla başlıyor: `AUTH-1 Kayıt formu eklendi`
- PR en az bir kişi onaylamadan merge edilmiyor.
