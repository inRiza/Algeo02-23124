# Tubes 2 IF2123 Aljabar Linier dan Geometri
> Tugas Besar 2 Kelompok 31 Skibiditify

# Penjelasan Program

# Anggota - Kelompok 31 Skibiditify
| NIM  | NAMA |
| ------------- | ------------- |
| 13523124 | Muhammad Raihaan Perdana  |
| 13523151 | Ardell Aghna Mahendra  |
| 13523164 | Muhammad Rizain Firdaus  |

# Bahasa & framework yang digunakan
- Typescript & Nextjs.
- Tailwind CSS

# Features

# Struktur Program
```bash
Algeo02-23124/
│
├── README.md
│
├── bin/
│
├── test/
│   ├── x (1).mid 
│   ├── x (2).mid 
│   ├── x (3).mid 
│   ├── x (4).mid 
│   ├── x (5).mid 
│   ├── x (6).mid 
│   ├── x (7).mid 
│   ├── x (8).mid 
│   ├── x (9).mid 
│   ├── x (10).mid 
│   ├── x (11).mid 
│   ├── x (12).mid 
│   ├── x (13).mid 
│   ├── x (14).mid 
│   ├── x (15).mid 
│   ├── x (16).mid 
│   ├── x (17).mid 
│   ├── x (18).mid 
│   ├── x (19).mid 
│   ├── x (20).mid 
│   ├── x (21).mid 
│   ├── x (22).mid 
│   ├── x (23).mid 
│   ├── x (24).mid 
│   ├── x (25).mid 
│   ├── x (26).mid 
│   ├── x (27).mid 
│   ├── x (28).mid 
│   ├── x (29).mid 
│   ├── x (30).mid 
│   ├── x (31).mid 
│   ├── x (32).mid 
│   ├── x (33).mid 
│   ├── x (34).mid 
│   ├── x (35).mid 
│   ├── x (36).mid 
│   ├── x (37).mid 
│   ├── x (38).mid 
│   ├── x (39).mid 
│   ├── x (40).mid 
│   ├── x (41).mid 
│   ├── x (42).mid 
│   ├── x (43).mid 
│   ├── x (44).mid 
│   ├── x (45).mid 
│   ├── x (46).mid 
│   ├── x (47).mid 
│   ├── x (48).mid 
│   ├── x (49).mid 
│   └── x (50).mid
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── audiou_routes.py
│   │   │   └── image_routes.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── audio_services.py
│   │   │   └── image_services.py
│   │   ├── utils/
│   │   │   ├── audio/
│   │   │   │   ├── dataset_scanner.py
│   │   │   │   ├── feature_extraction.py
│   │   │   │   ├── file_handler.py
│   │   │   │   ├── tempo_normalizer.py
│   │   │   │   └── window_processor.py
│   │   │   └── image/
│   │   │       ├── feature_extraction.py
│   │   │       ├── grayscale_resizer.py
│   │   │       └── pca_processor.py
│   │   ├── config.py
│   │   └── __init__.py
│   ├── .gitignore
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── .eslint.json
│   ├── .gitignore
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── app/
│   │   ├── album/
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── midiplayer.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── sidebar.tsx
│   │   ├── fonts/
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GestVF.woff
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── type.ts
│   │   └── music/
│   │       └── page.tsx
│   ├── global.css
│   ├── layout.tsx
│   └── page.tsx
│
└── doc/
    ├── Algeo02-23124.pdf
    └── README.md
                            -- Berisikan Data Uji

```

 
# Cara Menjalankan Program
1. Open github repository and copylink
   ```bash
   git clone https://github.com/inRiza/Algeo01-23133.git
   code .
   ```
2. This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server
```bash
cd frontend
```

Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
run server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Open another terminal for backend
```bash
cd backend
```

install requirements
```bash
pip install -r requirements.txt
```

run server
```bash
python run.py
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Links
Repository : https://github.com/inRiza/Algeo02-23124

Link Contributor
- Muhammad Raihaan Perdana : https://github.com/fliegenhaan
- Ardell Aghna Mahendra : https://github.com/ArdellAghna
- Muhammad Rizain Firdaus : https://github.com/inRiza
