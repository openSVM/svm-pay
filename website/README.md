# SVM-Pay Website

The official website for SVM-Pay - Cross-Chain Payment Infrastructure.

## Overview

A modern, responsive website built with:
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Vite** - Fast build tool and dev server

## Features

- 🚀 **Performance optimized** - Fast loading, smooth animations
- 📱 **Fully responsive** - Works on all devices and screen sizes
- ♿ **Accessible** - WCAG compliant design
- 🎨 **Modern design** - Clean, professional interface
- 📊 **SEO optimized** - Proper meta tags and structured data

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── Hero.tsx         # Landing page hero section
│   ├── Features.tsx     # Features showcase
│   ├── Stats.tsx        # Usage statistics
│   ├── TechStack.tsx    # Technical infrastructure
│   ├── Documentation.tsx # Developer resources
│   └── Footer.tsx       # Site footer
├── lib/                 # Utility functions
└── index.css           # Global styles and Tailwind config
```

## Development

The website is designed to showcase SVM-Pay's cross-chain payment capabilities with:

1. **Hero Section** - Clear value proposition and quick start code
2. **Statistics** - Real usage metrics and developer adoption
3. **Features** - Comprehensive feature showcase
4. **Tech Stack** - Supported networks, bridges, and tokens
5. **Documentation** - Code examples and developer resources
6. **Footer** - Links and contact information

## Deployment

The website is automatically deployed to Netlify when changes are pushed to the main branch.

- **Production URL**: [svm-pay.com](https://svm-pay.com)
- **Staging URL**: [svm-pay.netlify.app](https://svm-pay.netlify.app)

## Contributing

When making changes:

1. Test locally with `npm run dev`
2. Build and test with `npm run build && npm run preview`
3. Ensure responsive design works on all screen sizes
4. Verify accessibility with screen readers
5. Check performance with Lighthouse

## Performance

The website is optimized for:
- **Core Web Vitals** - LCP, FID, CLS scores
- **Bundle size** - Minimal JavaScript payload
- **Image optimization** - WebP format with fallbacks
- **Caching** - Proper cache headers for static assets
