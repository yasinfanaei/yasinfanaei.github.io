# راهنمای نهایی مدیریت سایت Academic Pro از Pages CMS

این نسخه برای مدیریت روزمره بدون کدنویسی طراحی شده است. مسیر معمول کار:

**Pages CMS → ویرایش → Save → GitHub commit → GitHub Pages deploy → سایت به‌روز**

## ۱) محتواهای انگلیسی و فارسی

دو گروه مستقل داری:

- **English**
- **فارسی**

در هر گروه این بخش‌ها قابل مدیریت‌اند:

- Profile & Contact / مشخصات و ارتباط
- Education / تحصیلات
- Research / پژوهش
- Publications / انتشارات
- Projects / طرح‌ها و پروژه‌ها
- Experience & Service / سوابق و فعالیت‌ها
- Awards / جوایز
- Skills & Certificates / مهارت‌ها و گواهی‌ها
- News & Updates / تازه‌ها
- Site Settings / تنظیمات سایت

برای داده‌های واقعی مانند سال مقاله، وضعیت انتشار، دانشگاه و دوره تحصیلی، نسخه فارسی و انگلیسی را هماهنگ نگه دار.

## ۲) Design & Branding — ظاهر و تنظیمات اصلی

این بخش مشترک بین هر دو زبان است و برای تغییرات ظاهری معمول نیاز به CSS نداری.

### فایل‌ها و برندینگ

- عکس پروفایل
- CV PDF
- CV Word
- لوگوی Header
- Favicon
- Social preview image

عکس و CV را از این بخش عوض کن تا هر دو زبان همزمان به‌روزرسانی شوند.

### رنگ‌ها

دو پالت مستقل داری:

- Light colors
- Dark colors

می‌توانی رنگ پس‌زمینه، سطح کارت‌ها، متن، متن ثانویه، خطوط، Accent و Soft background را تغییر بدهی.

### Theme

Default theme:

- System
- Light
- Dark

اگر **Show theme switch** روشن باشد، بازدیدکننده نیز می‌تواند Theme را عوض کند. انتخاب او در مرورگر ذخیره می‌شود.

### Typography

- فونت انگلیسی
- فونت فارسی
- اندازه پایه متن
- line-height هر زبان
- مقیاس عنوان بزرگ Hero

فونت پیش‌فرض فعلی: Times New Roman برای انگلیسی و B Nazanin با fallback برای فارسی.

### Layout

از داشبورد می‌توانی عرض سایت، فاصله سکشن‌ها، فاصله Hero، اندازه و سمت عکس، radius عکس/کارت/دکمه و فاصله منو را تنظیم کنی.

### Site controls

می‌توانی روشن/خاموش کنی:

- Sticky header
- Shadows
- EN/فارسی switch
- Theme switch
- Global Search
- Footer
- Academic profile links on homepage
- Name next to logo

### Homepage sections

Hero، About، Research، Education و News را می‌توانی نمایش/مخفی و reorder کنی.

## ۳) جستجوی سراسری

اگر **Show search** روشن باشد، لینک Search در Header نمایش داده می‌شود. جستجو روی محتوای همان زبان انجام می‌شود و Profile، Research، Publications، Projects، Experience، Awards و News را پوشش می‌دهد.

این جستجو سرویس خارجی یا هزینه ماهانه ندارد.

## ۴) Publications حرفه‌ای

در Publications می‌توانی موارد زیر را وارد کنی:

- Title
- Official English title فقط در صورت تأیید
- Authors
- Year
- Type
- Status
- Venue
- DOI
- URL
- Volume / Issue / Pages
- Abstract
- Keywords
- Publication PDF
- Data URL
- Code URL
- Replication URL
- Featured

صفحه Publications به‌صورت خودکار فیلتر متن، نوع، وضعیت و سال می‌سازد و برای داده‌های موجود Citation / BibTeX / RIS ارائه می‌کند.

**هیچ metadata ناقص را حدس نزن.** اگر DOI یا شماره صفحات را نداری، خالی بگذار.

## ۵) News & Updates / تازه‌ها

برای خبر مقاله، ارائه کنفرانس، پروژه جدید یا فعالیت دانشگاهی از News استفاده کن.

هر خبر:

- Title
- Date
- Summary
- Link اختیاری
- Featured
- Published

فقط موارد Published روی سایت نمایش داده می‌شوند. اگر News در Homepage sections فعال باشد، موارد منتخب/جدید در صفحه اصلی هم ظاهر می‌شوند.

## ۶) Media

سه منبع فایل داری:

- Images → تصاویر
- Documents → CV و اسناد عمومی
- Publication files → PDFها یا فایل‌های مرتبط با انتشارات

Upload کردن فایل به‌تنهایی آن را روی سایت نمایش نمی‌دهد؛ باید فیلد مربوطه در Profile، Design یا Publication به آن فایل اشاره کند.

## ۷) Site Settings هر زبان

در English → Site Settings و فارسی → تنظیمات سایت می‌توانی این موارد را کنترل کنی:

- Navigation order/visibility/labels
- SEO title و description هر صفحه
- Keywords
- Footer
- Announcement
- عنوان‌های رابط و صفحات

## ۸) SEO و نمایه‌سازی

در Design & Branding → SEO:

- Site URL را فقط در صورت تغییر دامنه عوض کن.
- Structured data را معمولاً روشن نگه دار.
- Indexing را معمولاً روشن نگه دار.

اگر Indexing را خاموش کنی، سایت meta robots را روی `noindex,nofollow` می‌گذارد. این گزینه برای حالت موقت/آزمایشی است، نه استفاده روزمره.

## ۹) Analytics

Analytics پیش‌فرض خاموش است.

اگر واقعاً Google Analytics می‌خواهی:

- Enabled = On
- Provider = google_analytics
- Measurement ID = یک شناسه معتبر `G-...`

اگر Tracking نمی‌خواهی، خاموش بگذار.

## ۱۰) Validation خودکار

در Pages CMS بخش **Actions** یک Action با عنوان **Validate site** وجود دارد. بعد از تغییرات بزرگ آن را اجرا کن.

همچنین GitHub Actions روی push/PR بررسی‌های اصلی را خودکار اجرا می‌کند.

اگر Validation fail شد، قبل از ادامه تغییرات علت را بررسی کن.

## ۱۱) انتشار تغییرات

1. فیلدها را در Pages CMS تغییر بده.
2. Save را بزن.
3. Pages CMS یک Git commit می‌سازد.
4. GitHub Pages سایت را دوباره deploy می‌کند.
5. کمی صبر کن و سایت را Refresh کن.
6. اگر نسخه قدیمی دیدی `Ctrl + Shift + R` بزن.

## ۱۲) چه چیزهایی هنوز نیاز به کدنویسی دارد؟

تغییرات تعریف‌شده در Dashboard بدون کد هستند. فقط ایجاد **نوع قابلیت کاملاً جدید** مثل فروشگاه، login، پایگاه داده، سیستم نظر، component کاملاً جدید یا backend نیاز به توسعه جداگانه دارد.

برای سایت دانشگاهی معمول، این نسخه عمداً از وابستگی‌های غیرضروری دور نگه داشته شده تا کم‌هزینه، سریع و پایدار بماند.
