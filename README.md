# Bon Air Media (BAM!) - Richmond VA Web Design

A stunning, modern website for Bon Air Media, a Richmond-based web design agency. Built with Next.js 16, featuring advanced animations, 3D effects, and a beautiful dark theme.

## Features

- **Modern Tech Stack**: Built with Next.js 16, React 18, TypeScript, and Tailwind CSS v4
- **Advanced Animations**: GSAP-powered scroll-triggered animations and text effects
- **3D Effects**: Three.js particle system with mouse-interactive elements
- **Responsive Design**: Mobile-first approach with beautiful layouts across all devices
- **Custom Water Tower Graphic**: SVG illustration representing Richmond's Bon Air neighborhood
- **Smooth Scrolling**: Seamless navigation between sections
- **Interactive Menu**: Full-screen hamburger menu with staggered animations
- **Form Components**: Styled contact form with focus animations
- **Dark Theme**: Elegant dark color scheme with vibrant accent colors

## Tech Stack

- **Framework**: Next.js 16.0.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (PostCSS)
- **Animations**: GSAP 3.12.2 with ScrollTrigger and TextPlugin
- **3D Graphics**: Three.js
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Bebas Neue, Outfit)

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The page auto-updates as you edit files.

### Build

Create an optimized production build:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Features & Sections

### Hero Section
- Animated text reveals with GSAP TextPlugin
- Interactive Three.js particle system
- Custom water tower SVG graphic with glow effects
- Twinkling stars background
- Floating geometric shapes
- Smooth scroll indicator

### Stats Bar
- Animated counter with scroll-triggered reveals
- Gradient background
- Key metrics display

### Services Section
- 6 service cards with hover effects
- Icon animations
- Staggered entrance animations
- Gradient corner effects

### About Section
- Feature highlights with icons
- Browser mockup visualization
- Animated entrance effects

### Testimonials Section
- 3D card hover effects
- Client testimonials with photos
- Star ratings with color variations

### Contact Section
- Animated form inputs
- Contact information cards
- Social media links
- Staggered entrance animations

## Customization

### Colors
Colors are defined in `app/globals.css` using Tailwind CSS v4's `@theme` directive.

### Animations
GSAP timelines and ScrollTrigger animations are configured in the `initAnimations()` function in `app/page.tsx`.

### Three.js Effects
Particle system configuration is in the `setupThreeJS()` function.

## Deployment

This Next.js app can be deployed to Vercel, Netlify, or any Node.js hosting platform.

## License

Copyright © 2025 Bon Air Media (BAM!). All rights reserved.

---

Made with ❤️ in Richmond, Virginia
