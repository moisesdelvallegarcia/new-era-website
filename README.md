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

Requests are emailed through [Web3Forms](https://web3forms.com). Set `VITE_WEB3FORMS_KEY` in Vercel (and in `.env` locally, see `.env.example`). Without the key the form asks people to call instead.

## Housecall numbers

`src/data/housecallPublicData.json` is generated in `nova-expense-ai`. Its default output path is out of date, so pass this repo's path:

```bash
cd ../nova-expense-ai
WEBSITE_PUBLIC_DATA_PATH=../new-era-website/src/data/housecallPublicData.json npm run housecall:export:website
```

## Photos

New jobsite photos are pending. Slots are listed in `photoSlots` in `src/data/gallery.js`; drop the file in `public/media/photos/` and set its `src`.

## Before launch

The site is not indexed yet: the domain (neconstructioniowa.com) is being transferred from Hibu. At launch, remove the `noindex` meta in `index.html`, the `X-Robots-Tag` header in `vercel.json`, and the `Disallow` in `public/robots.txt`, then add the domain in Vercel.
