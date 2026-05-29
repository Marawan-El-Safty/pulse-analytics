# Pulse — Analytics Dashboard

An analytics dashboard for an online store. It shows revenue, visitors, orders,
and conversion, with charts that I coded by hand instead of pulling in a chart
library — partly because I wanted full control over how they look and animate.

There's no backend; the data is generated locally so the whole thing runs and
deploys for free. Everything you can click actually works: the date filters
recompute the numbers, the table sorts and searches, and there's a light/dark
toggle.

**Live:** https://pulse-analytics-nine-silk.vercel.app

## Screenshots

![Overview](docs/overview-dark.png)
![Overview light](docs/overview-light.png)
![Customers](docs/customers-dark.png)

## What's in it

- Overview with KPI cards, revenue and visitor charts, and recent orders
- Analytics page with a 7 / 30 / 90-day filter that updates everything
- Customers and Orders tables you can sort and search
- Payments summary and an activity feed
- Settings page (profile, theme, notification toggles)
- Light and dark mode, responsive down to mobile

## Built with

Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. The charts (area, bar,
donut, sparklines) are plain SVG components in `src/components/dashboard`.

## Running it

```bash
npm install
npm run dev
```

That's it — no API keys or setup needed.
