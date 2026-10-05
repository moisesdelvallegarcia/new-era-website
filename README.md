# New Era Construction Website

Public marketing website for New Era Construction, a concrete contractor serving the Greater Des Moines Metro Area in Iowa. The site is built as a modern React/Vite app with reusable components, centralized content data, responsive pages, and organized project media.

## Stack

- React + Vite
- React Router
- Tailwind CSS
- Mobile-first responsive layout

## Installation

```bash
npm install
```

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Structure

```text
src/components      Reusable UI sections and cards
src/data            Business info, services, reviews, and gallery data
src/pages           Route-level pages
public/images       Original placeholder SVGs kept for fallback use
public/media/logo   New Era logo assets
public/media/photos Project photography
public/media/videos Project video assets
```

## Languages

English lives at `/`, Spanish under `/es` (e.g. `/services` and `/es/services`). All page copy is in `src/i18n/en.js` and `src/i18n/es.js`; keep both files in sync when you change text.

## Contact form

The form posts to `api/lead.js` (a Vercel function), which sends each request to a Telegram chat. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_LEADS_CHAT_ID` in Vercel (see `.env.example`). If they are missing or Telegram fails, the form asks people to call. `npm run dev` does not run the function; test it on a Vercel preview.

## Housecall numbers

`src/data/housecallPublicData.json` is generated in `nova-expense-ai`. Its default output path is out of date, so pass this repo's path:

```bash
cd ../nova-expense-ai
WEBSITE_PUBLIC_DATA_PATH=../new-era-website/src/data/housecallPublicData.json npm run housecall:export:website
```

## Photos

New jobsite photos are pending. Slots are listed in `photoSlots` in `src/data/gallery.js`; drop the file in `public/media/photos/` and set its `src`.

## Domain

The public site is **neweraiowa.com** (GoDaddy; email runs on Google Workspace, so its MX/TXT records must not change). Canonical links, hreflang and `public/sitemap.xml` point there. Vercel preview URLs (`*.vercel.app`) send `X-Robots-Tag: noindex` from `vercel.json` so they never compete with it.

neconstructioniowa.com (the old Hibu site) is being transferred out of Hibu and expires 2026-11-18. When it arrives, add it in Vercel as a redirect to neweraiowa.com.
