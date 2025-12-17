# Taklifnoma Sayti - O'rnatish qo'llanmasi

Ushbu loyihani o'zingizning kompyuteringizda (Localhost) ishga tushirish uchun quyidagi ko'rsatmalarga amal qiling.

## Talablar

Kompyuteringizda quyidagi dasturlar o'rnatilgan bo'lishi kerak:
1.  **Node.js**: (v18 yoki yuqori versiyasi). [nodejs.org](https://nodejs.org/) saytidan yuklab oling.
2.  **PostgreSQL**: Ma'lumotlar bazasi.

## Ishga tushirish tartibi

1.  Loyihaning papkasiga kiring (Terminal orqali):
    ```bash
    cd Taklifnoma_sayti
    ```

2.  Kutubxonalarni o'rnating:
    ```bash
    npm install
    ```

3.  Atrof-muhit o'zgaruvchilarini sozlang (`.env`):
    Loyiha papkasida `.env` nomli fayl yarating va quyidagi qatorlarni qo'shing:
    ```env
    DATABASE_URL=postgres://username:password@localhost:5432/taklifnoma_db
    SESSION_SECRET=maxfiy_soz_yozing
    ```
    *Eslatma: `DATABASE_URL` ni o'zingizning PostgreSQL sozlamalaringizga moslang.*

4.  Loyihani ishga tushiring:
    ```bash
    npm run dev
    ```

5.  Brauzerni oching:
    Sayt odatda `http://localhost:5000` manzilida ishlaydi.

## Muammolar yechimi

-   **"npm" topilmadi**: Node.js o'rnatilmagan yoki noto'g'ri o'rnatilgan. Qayta o'rnatib ko'ring.
-   **Database error**: `.env` faylida `DATABASE_URL` noto'g'ri yoki PostgreSQL ishlamayapti.
