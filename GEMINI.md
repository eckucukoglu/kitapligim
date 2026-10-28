# Proje Kuralları (Kitaplığım)

## Versiyon Yönetimi ve Semver Kuralı
- Kullanıcı sitenin kodunda, tasarımında veya yapısında her yeni bir değişiklik veya geliştirme yapılması istendiğinde versiyon numarasının **3. hanesini (patch sürümü) her seferinde 1 sayı artır**.
  - Örnek: `0.0.1` -> `0.0.2` -> `0.0.3` ...
- Versiyon numarası her değişiklikte senkronize olarak şu dosyalarda güncellenmelidir:
  1. `src/components/Header.tsx` (veya `index.html`) başlığındaki versiyon etiketi
  2. `src/App.tsx` altbilgisindeki versiyon etiketi
  3. `package.json` dosyasındaki `"version": "X.Y.Z"` alanı
  4. `README.md` dosyasındaki versiyon bilgisi
- Değişiklikler bittiğinde:
  1. `npm run build` çalıştırılır.
  2. Git commit'i oluşturulur ve sürüm etiketi (`vX.Y.Z`) atanarak GitHub'a pushlanır.
  3. Uygulama Firebase Hosting'e canlıya alınır (`npx -y firebase-tools deploy --only hosting`).

## Yetkilendirme ve Gizlilik Kuralı
- Veri ekleme, güncelleme ve silme işlemleri yalnızca yetkili kullanıcı e-postasına (`kitapligim@emre.mozmail.com`) açıktır.
- Ziyaretçiler / giriş yapmamış kullanıcılar kütüphaneyi ve notları salt-okunur olarak görüntüleyebilir.
- Yetkili e-posta adresi sitenin hiçbir yerinde (başlık, form, metin, altbilgi) açıkça gösterilmez. Giriş maile gönderilen bağlantı (Email Link) veya şifre ile yapılır.
