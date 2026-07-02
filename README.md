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

## UAT Deployment Notes

- Deploy the `uat` branch when Chris needs to review.
- Run `npm run build` before promoting to UAT.
- Review final image choices in `public/media` before production and swap in higher-resolution project photography when available.
- The contact form currently logs the payload to the browser console and shows a success message. No backend, Nexus, Make, or Supabase connection is active yet.
