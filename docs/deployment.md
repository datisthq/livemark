---
title: Deployment
description: Deploy your Livemark site to production.
---

# Deployment

Build your site for production and deploy it anywhere.

## Building

```bash
livemark build
```

This outputs static files to `.livemark/build/`.

## Hosting Options

Livemark generates a standard static site that works with any hosting provider:

- **Vercel** — zero-config deployment
- **Netlify** — drag and drop or Git integration
- **GitHub Pages** — free hosting for public repos
- **Cloudflare Pages** — edge-deployed globally

## Environment Variables

You can use environment variables in your content by referencing them in custom components:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```
