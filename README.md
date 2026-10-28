# Kitaplığım 📚 (v0.0.2)

Kişisel kütüphane, kitap notları/alıntıları ve okuma hedefleri takip uygulaması.

Yalın, edebi ve göz yormayan bir arayüze sahiptir.

## ✨ Özellikler

- **Kişisel Kütüphane Yönetimi**:
  - Okunan, şu an okunan, okunacak ve yarım bırakılan kitapları kategorilendirme.
  - Sayfa takibi ve anlık okuma ilerleme çubuğu.
  - 1-5 yıldız kişisel puanlama ve genel inceleme/değerlendirme notu.
  - ISBN ile otomatik kitap bilgisi getirme (Open Library & Google Books entegrasyonu).
  - Anlık arama, kategoriye göre filtreleme ve sıralama.
- **Kitap Notları & Alıntılar**:
  - Kitaplarda altı çizilen önemli noktaları sayfa numarası, alıntı ve kişisel yorumlarla kaydetme.
  - Etiketleme ve tek tıkla alıntı kopyalama.
- **Okuma Hedefleri (Reading Challenge)**:
  - Yıllık hedef kitap ve hedef sayfa sayısı belirleme.
  - İlerleme yüzdesi, kalan kitap sayısı ve ay başına düşen hedef analizi.
- **Detaylı İstatistikler**:
  - Toplam okunan kitap, sayfa sayısı, kategori dağılımı ve ortalama kitap kalınlığı.
  - JSON formatında tüm kütüphaneyi ve notları yedekleme (Export).
- **Güvenlik & Yetkilendirme**:
  - Ziyaretçiler ve giriş yapmamış kullanıcılar için **Salt-Okunur (Read-Only)** mod.
  - Veri değişikliği (kitap ekleme, düzenleme, silme, not ekleme, hedef belirleme) **yalnızca yetkili e-posta** (`kitapligim@emre.mozmail.com`) ile yapılabilir.
  - Firestore Security Rules ile bulut seviyesinde tam koruma.
- **Tasarım**:
  - Kâğıt/kitap sıcaklığında edebi palet, Fraunces serif ve DM Sans yazı tipleri.
  - Açık ve koyu (Gece / Kâğıt) tema desteği.
  - Mobil, tablet ve masaüstü tam uyumluluk.

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend / Database**: Firebase Cloud Firestore & Firebase Authentication
- **Hosting**: Firebase Hosting (`benimkitapligim.web.app`)

## 🚀 Kurulum ve Yerel Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim derlemesi oluşturun
npm run build
```

## 🔒 Güvenlik Kuralları (Firestore Security Rules)

Firestore kuralları `firestore.rules` dosyasında tanımlıdır:
- `read`: Herkes kütüphaneyi ve alıntıları okuyabilir (`allow read: if true;`).
- `create`, `update`, `delete`: Yalnızca `kitapligim@emre.mozmail.com` adresine açıktır ve şema doğrulaması yapılır.

## 📦 Sürüm Yönetimi

- Güncel sürüm: `0.0.2`
- Semver kurallarına göre `index.html`/`Header.tsx`, `package.json` ve `README.md` dosyalarında sürüm senkronize tutulur.
