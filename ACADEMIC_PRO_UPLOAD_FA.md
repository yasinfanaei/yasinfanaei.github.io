# راهنمای آپلود Academic Pro

## روش پیشنهادی

1. فایل `academic-website-academic-pro-upgrade.zip` را Extract کن.
2. **محتویات داخل پوشه استخراج‌شده** را در root repository `yasinfanaei.github.io` آپلود کن؛ خود ZIP یا یک پوشه والد اضافه را آپلود نکن.
3. اجازه بده فایل‌های هم‌نام overwrite شوند.
4. Commit message پیشنهادی:
   `Upgrade site to Academic Pro`
5. Commit directly to `main`.
6. صبر کن GitHub Pages deploy شود و سپس سایت را با `Ctrl+Shift+R` بررسی کن.
7. Pages CMS را Refresh کن. باید News، Theme/Search/SEO controls، media sources و Action جدید `Validate site` را ببینی.

## فایل مهم `.pages.yml`

این فایل داخل ZIP وجود دارد. اگر سیستم عامل هنگام انتخاب فایل‌های مخفی آن را آپلود نکرد، از Pages CMS → Configuration محتوای `.pages.yml` نسخه جدید را جایگزین و Save کن.

## پاکسازی اختیاری بعد از اطمینان از نسخه جدید

این موارد قدیمی ممکن است در GitHub باقی مانده باشند اما نسخه Academic Pro از آن‌ها استفاده نمی‌کند:

- پوشه قدیمی `academic-website/`
- فایل قدیمی `pages.yml` بدون نقطه در ابتدای نام
- فایل قدیمی `style.css` در root (CSS فعال داخل `assets/style.css` است)
- `assets/uploads/profile.jpeg`
- `assets/uploads/Yasin_Fanaei_Shahroudi_CV.pdf`
- `assets/uploads/Yasin_Fanaei_Shahroudi_CV.docx`

فقط پس از تأیید اینکه سایت و Pages CMS نسخه جدید درست کار می‌کنند آن‌ها را حذف کن.
