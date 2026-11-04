# Pizzeria 450° — Restaurant Ordering System

QR menu + live kitchen screen + cashier, built with **React, Vite, Tailwind CSS and Supabase** (Postgres, Auth, Realtime).

- `/` — customer menu: dine-in (table number) or takeaway
- `/kitchen` — live orders in three lanes: new, preparing, ready (staff login)
- `/cash` — open bills grouped by table, takeaway orders, settle payment (staff login)

Prices are calculated inside the database (`submit_order`), never trusted from the browser.
Row Level Security lets customers only read the menu and submit orders.
Paid orders are kept (`paid_at`) so sales history is not lost.

---

## التشغيل لأول مرة

### 1) قاعدة البيانات (مرة وحدة)
بـ Supabase ← SQL Editor ← New query:
1. انسخي محتوى `supabase/setup-450.sql` واضغطي **Run**
2. انسخي محتوى `supabase/seed-450-menu.sql` واضغطي **Run**
   (هاد بيمسح منيو وطلبات البارون القديمة وبيحط منيو 450)

### 2) حساب الموظفين
Supabase ← Authentication ← Users ← **Add user** ← إيميل وكلمة سر.
هاد الحساب الوحيد للمطبخ والكاش.

### 3) التشغيل
```bash
npm install
npm run dev
```
- المنيو: http://localhost:5173
- المطبخ: http://localhost:5173/kitchen
- الكاش: http://localhost:5173/cash

## تعديل المنيو
Supabase ← Table Editor:
- `categories`: الأقسام (name عربي، name_en إنجليزي، sort_order الترتيب، is_compact للمشروبات)
- `products`: الأصناف والأسعار. `is_available = false` بيخفي الصنف من المنيو.

## ملفات مهمة
- `.env`: رابط Supabase والمفتاح العام (publishable). ممنوع تحطي هون `service_role` أبداً.
- `src/config.js`: اسم المطعم، التواصل، عدد الطاولات.
