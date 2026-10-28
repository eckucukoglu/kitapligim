# Proje Kuralları (Kitaplığım)

## Versiyon Yönetimi ve Semver Kuralı
- Kullanıcı sitenin kodunda, tasarımında veya yapısında her yeni bir değişiklik veya geliştirme yapılması istendiğinde versiyon numarasının **3. hanesini (patch sürümü) her seferinde 1 sayı artır**.
  - Örnek: `0.0.1` -> `0.0.2` -> `0.0.3` ...
- Versiyon numarası her değişiklikte senkronize olarak şu dosyalarda güncellenmelidir:
  1. `src/components/Header.tsx` (veya `index.html`) başlığındaki versiyon etiketi
  2. `package.json` dosyasındaki `"version": "X.Y.Z"` alanı
  3. `README.md` dosyasındaki versiyon bilgisi
- Değişiklikler bittiğinde Git commit'i ve sürüm etiketi (tag) yeni versiyonla ilişkilendirilir.

## Yetkilendirme Kuralı
- Veri ekleme, güncelleme ve silme işlemleri yalnızca yetkili kullanıcı e-postasına (`kitapligim@emre.mozmail.com`) açıktır.
- Ziyaretçiler / giriş yapmamış kullanıcılar kütüphaneyi ve notları salt-okunur olarak görüntüleyebilir.
