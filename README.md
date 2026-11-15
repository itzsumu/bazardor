# 🛒 বাজার দর — BazarDor

**BazarDor** is a responsive Bengali market-price dashboard for checking the latest prices of everyday essentials. It presents price movements, product categories, product details and market-wise price information in one clean interface.

## ✨ Features

1. **Live product catalogue** — fetches product and category data from the Programming Hero BazarDor API.
2. **Price movement sections** — highlights products with rising and falling prices.
3. **Infinite price ticker** — displays product names, current prices and percentage changes.
4. **Product details** — summary cards for minimum, maximum and average price, plus market-wise prices when supplied by the API.
5. **Category browsing and sorting** — category pages with default, low-to-high and high-to-low numeric sorting.
6. **Authentication** — Better Auth email/password sign-up and sign-in, plus optional Google and GitHub OAuth.
7. **Protected pages** — product details and profile pages require a signed-in user.
8. **Profile update** — update the signed-in user's name using Better Auth.
9. **Responsive UI** — layouts adapt to mobile, tablet and desktop screens; skeletons and toast messages are included.
10. **Custom 404 page** — friendly fallback with a link to the home page.

## 🧰 Technologies

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS 4 (with custom responsive CSS)
- Better Auth
- Drizzle ORM + LibSQL / SQLite
- react-hot-toast
- Programming Hero BazarDor REST API

## 🚀 Run locally

### 1. Requirements

Install **Node.js 20.9 or newer** and npm.

### 2. Install packages

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and set a unique Better Auth secret (at least 32 characters):

```env
BETTER_AUTH_SECRET=your-long-random-secret-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=https://openapi.programming-hero.com/api/bazardor
```

The local SQLite database file (`local.db`) and its tables are created automatically when the auth API is first used. Keep `.env.local` private; do not commit it.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
npm run build
npm start
```

## 🔐 Authentication and social login

Email/password authentication works with the local SQLite database. To enable Google or GitHub, create OAuth applications with the providers and add these values to `.env.local`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Configure the OAuth callback URL for your app as `https://YOUR_DOMAIN/api/auth/callback/google` or `https://YOUR_DOMAIN/api/auth/callback/github`. Social buttons are included; provider credentials are optional for local email/password testing.

## 🌐 API endpoints used

Base URL: `https://openapi.programming-hero.com/api/bazardor`

- `GET /products`
- `GET /products?category=chal`
- `GET /products/:id`
- `GET /categories`
- `GET /categories/:slug`

If the primary API is unavailable, set `NEXT_PUBLIC_API_BASE_URL` to one of the alternative base URLs supplied in the assignment.

## ☁️ Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Add `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and the API base URL in Vercel Project Settings → Environment Variables.
4. Set `BETTER_AUTH_URL` to the deployed domain (for example, `https://your-project.vercel.app`).
5. **Important:** Vercel's serverless filesystem is not persistent. For production authentication, configure a persistent LibSQL/Turso database using `DATABASE_URL` and `DATABASE_AUTH_TOKEN`. The project reads both values from the environment. Do not rely on the local SQLite file for deployed accounts.
6. Redeploy after adding environment variables.

## 📁 Main folders

```text
app/                 App Router pages and auth API route
components/           Header, product cards, loaders, forms
lib/                  API helpers, Better Auth, database schema
public/               Hero and logo assets
```

## ℹ️ Price information

All displayed prices are indicative and may change depending on market, location and time. Product and market fields are normalized defensively because the API response may evolve. Market-wise rows are shown when the API returns market price data.
