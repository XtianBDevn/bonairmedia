# Bon Air Media — Brand & Style Handoff

Design tokens extracted from the **bonairmedia** Next.js project (`app/globals.css`, `app/page.tsx`, `app/layout.tsx`). Everything below is taken directly from the repository — nothing is invented. Where a token is not present in the repo, it is marked **(not in repo)**.

> Stack note: the project uses **Tailwind CSS v4**, which is configured inline with an `@theme` block in `app/globals.css` — there is **no `tailwind.config.js/ts` file** in the repo. All custom tokens live in that CSS file plus inline styles in `app/page.tsx`.

---

## 1. Logo & brand image assets

All files are in the `logos/` subfolder of this handoff package.

| File | Source path in repo | Size | What it is |
|------|---------------------|------|------------|
| `logo-bw.webp` | `public/logo-bw.webp` | 526 KB | **The logo actually wired into the live site** — used in the navbar, slide-out menu, and footer (rendered inside a rounded square with a stone border). Black & white bee mark. Use this as the primary app icon / nav logo. |
| `logo-color.webp` | `public/logo-color.webp` | 1.56 MB | Full-color master logo. Not referenced in `page.tsx`, but the highest-fidelity color version. |
| `logo-media-color.webp` | `public/logo-media-color.webp` | 1.58 MB | "Media" sub-brand color logo (Bon Air **Media**). |
| `logo-labs-color.webp` | `public/logo-labs-color.webp` | 1.38 MB | "Labs" sub-brand color logo (Bon Air **Labs**). |
| `bee-cta.webp` | `public/bee-cta.webp` | 848 KB | The bee mascot artwork used in the CTA section (shown in a rounded square with an amber/pink glow, "EST. 2021" badge). |
| `bertrim.webp` | `public/bertrim.webp` | 1.73 MB | "Bertrim" — the astronaut mascot floating in the hero background (object-contain, ~25% opacity, amber drop-shadow). |
| `favicon.ico` | `app/favicon.ico` | 26 KB | Site favicon. |
| `christian_anime.jpg` | `christian_anime.jpg` (repo root) | 135 KB | Stylized (anime) founder portrait of Christian. Personal/founder photo, not a logo. |
| `christian_simpsons.jpg` | `christian_simpsons.jpg` (repo root) | 112 KB | Stylized (Simpsons) founder portrait of Christian. Personal/founder photo, not a logo. |

**Not copied (Next.js/Vercel boilerplate SVGs, not brand assets):** `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `public/globe.svg`, `public/file.svg`. Mention only; they are framework starter icons.

> The brand mark is a **bee**; mascots are the bee and "Bertrim" the astronaut. Tagline/identity in copy: "BAM!" (Bon Air Media), "EST. 2021", "Richmond, Virginia / RVA".

### Adding the logo to an iOS asset catalog
1. In Xcode, open `Assets.xcassets` → right-click → **New Image Set**, name it e.g. `LogoBW`.
2. WebP is supported by iOS 14+ natively, but asset catalogs prefer PNG/PDF/SVG. Convert the `.webp` to PNG (or a vector PDF) first, e.g. `cwebp`/`sips` or an export tool:
   `sips -s format png logo-bw.webp --out LogoBW.png` (macOS) — then drop the PNG into the image set (supply @1x/@2x/@3x, or use a single vector PDF with "Preserve Vector Data").
3. Reference it with `Image("LogoBW")`.
4. For the **app icon**, use the color bee mark (`logo-color.webp` / `bee-cta.webp`) exported to a 1024×1024 PNG and assign it to the **AppIcon** set.

---

## 2. Color palette

### 2a. Neutrals — the "Stone" scale (defined as `@theme` tokens in globals.css)
These are the backbone of the UI. `stone-950` is the page background; `stone-50` is body text.

| Token | Hex | Usage in the site |
|-------|-----|-------------------|
| stone-950 | `#0c0a09` | **Page background** (`body`), darkest surfaces, footer |
| stone-900 | `#1c1917` | Card/panel base, scrollbar track, elevated surfaces |
| stone-800 | `#292524` | Form input backgrounds, placeholder bars |
| stone-700 | `#44403c` | Borders (logo frame, cards, dividers) |
| stone-600 | `#57534e` | Secondary button borders, muted icons |
| stone-500 | `#78716c` | Muted text, footer-bar inactive labels |
| stone-400 | `#a8a29e` | Body/secondary paragraph text, "MEDIA" logo subtext |
| stone-300 | `#d6d3d1` | Nav links, form labels, light body text |
| stone-200 | `#e7e5e4` | Light text (rare) |
| stone-100 | `#f5f5f4` | Headings on dark, logo "BON"/"R" text |
| stone-50  | `#fafaf9` | **Default body text color**, brightest text |

### 2b. Brand accent colors (from gradients, blobs, and UI accents in globals.css + page.tsx)

| Role | Hex | Tailwind name | Usage |
|------|-----|---------------|-------|
| **Primary accent (amber/honey)** | `#f59e0b` | amber-500 | The signature brand color — hamburger bars, logo frame hover, nav link hover, CTA button start, section labels, glass-card borders/glow, stars |
| Amber deep | `#d97706` | amber-600 | Pulse-glow shadow (`rgba(217,119,6,…)`), stats-bar gradient start |
| Orange | `#f97316` | orange-500 | Primary button gradient (mid stop) |
| Red | `#ef4444` | red-500 | Text gradient, primary button end, scrollbar thumb end |
| Rose | `#f43f5e` | rose-500 | Background blob (blob-5) |
| Pink | `#ec4899` | pink-500 | Secondary accent, text gradient, bee glow, CTA shadows |
| Pink deep | `#db2777` | pink-600 | Stats-bar gradient (mid) |
| Violet | `#8b5cf6` | violet-500 | Text gradient end, logo "AI" gradient end |
| Purple | `#a855f7` | purple-500 | Background blob, accent set |
| Purple deep | `#9333ea` | purple-600 | Stats-bar gradient end |
| Cyan | `#06b6d4` | cyan-500 | Logo "AI" gradient start, accent set, AI/ML tech |
| Blue | `#3b82f6` | blue-500 | Logo "AI" gradient mid, background blob |
| Emerald | `#10b981` | emerald-500 | Background blob (blob-4) |
| Lime | `#84cc16` | lime-500 | Background blob (blob-4) |
| Green | `#22c55e` | green-500 | "green" accent set (icons, success states) |

> The accent set the design cycles through per-card is: **amber, pink, cyan, purple, green** (see `ACCENT_COLORS` in `page.tsx`). Amber is dominant/primary.

### 2c. Signature gradients (exact values from globals.css / page.tsx)

- **Headline text gradient** (`.text-gradient`, animated, 135°):
  `#f59e0b 0% → #ef4444 25% → #ec4899 50% → #8b5cf6 75% → #f59e0b 100%` (amber → red → pink → violet → amber, 5s loop)
- **Logo "AI" gradient** (135°): `#06b6d4 → #3b82f6 → #8b5cf6` (cyan → blue → violet) with cyan drop-shadow glow
- **Primary button** (to right): `#f59e0b → #f97316 → #ef4444` (amber → orange → red), dark (`stone-900`) text
- **Form submit button** (to right): amber-500 → pink-500 → purple-500 (`#f59e0b → #ec4899 → #a855f7`), white text
- **Stats bar** (to right): amber-600 → pink-600 → purple-600 (`#d97706 → #db2777 → #9333ea`)
- **Background "color blobs"** (radial, blurred 120px) pair examples: `#f59e0b→#ef4444`, `#8b5cf6→#ec4899`, `#06b6d4→#3b82f6`, `#10b981→#84cc16`, `#f43f5e→#a855f7`

### 2d. Suggested SwiftUI `Color` extension
Drop-in, using the exact hexes above. Includes a hex initializer.

```swift
import SwiftUI

extension Color {
    init(hex: String) {
        let s = Scanner(string: hex.hasPrefix("#") ? String(hex.dropFirst()) : hex)
        var rgb: UInt64 = 0
        s.scanHexInt64(&rgb)
        self.init(
            .sRGB,
            red:   Double((rgb >> 16) & 0xFF) / 255,
            green: Double((rgb >> 8)  & 0xFF) / 255,
            blue:  Double(rgb & 0xFF)         / 255,
            opacity: 1
        )
    }
}

extension Color {
    // MARK: Neutrals (Stone scale)
    static let bamStone950 = Color(hex: "#0c0a09")   // app background
    static let bamStone900 = Color(hex: "#1c1917")   // cards / surfaces
    static let bamStone800 = Color(hex: "#292524")   // inputs
    static let bamStone700 = Color(hex: "#44403c")   // borders
    static let bamStone600 = Color(hex: "#57534e")
    static let bamStone500 = Color(hex: "#78716c")   // muted text
    static let bamStone400 = Color(hex: "#a8a29e")   // secondary text
    static let bamStone300 = Color(hex: "#d6d3d1")
    static let bamStone100 = Color(hex: "#f5f5f4")   // headings
    static let bamStone50  = Color(hex: "#fafaf9")   // body text

    // MARK: Brand accents
    static let bamAmber      = Color(hex: "#f59e0b") // PRIMARY brand
    static let bamAmberDeep  = Color(hex: "#d97706")
    static let bamOrange     = Color(hex: "#f97316")
    static let bamRed        = Color(hex: "#ef4444")
    static let bamRose       = Color(hex: "#f43f5e")
    static let bamPink       = Color(hex: "#ec4899")
    static let bamViolet     = Color(hex: "#8b5cf6")
    static let bamPurple     = Color(hex: "#a855f7")
    static let bamCyan       = Color(hex: "#06b6d4")
    static let bamBlue       = Color(hex: "#3b82f6")
    static let bamEmerald    = Color(hex: "#10b981")
    static let bamLime       = Color(hex: "#84cc16")
    static let bamGreen      = Color(hex: "#22c55e")
}

// Signature headline gradient
extension LinearGradient {
    static let bamHeadline = LinearGradient(
        colors: [.bamAmber, .bamRed, .bamPink, .bamViolet, .bamAmber],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    // Primary CTA button
    static let bamPrimaryButton = LinearGradient(
        colors: [.bamAmber, .bamOrange, .bamRed],
        startPoint: .leading, endPoint: .trailing
    )
    // Logo "AI" accent
    static let bamAiAccent = LinearGradient(
        colors: [.bamCyan, .bamBlue, .bamViolet],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
}
```

---

## 3. Typography

All fonts are loaded from **Google Fonts** via an `@import` at the top of `globals.css` (no local `@font-face`, no bundled font files in the repo):

```
Bebas Neue, Outfit (300–700), Orbitron (400–900), Rajdhani (300–700)
```

| Family | Weights used | Role | Where |
|--------|--------------|------|-------|
| **Outfit** | 300,400,500,600,700 | **Default body / paragraph font** | `body { font-family: 'Outfit' }` |
| **Orbitron** | 400–900 (700/900 common) | **Display / headings / logo wordmark** | All `<h1>/<h2>` headings, stat numbers, logo "BON AIR", buttons |
| **Rajdhani** | 300–700 (600/700 common) | **UI labels / eyebrows / nav** | Uppercase section labels, nav links, form labels, footer, "MEDIA" subtext (letter-spacing 0.35em) |
| **Bebas Neue** | default | Imported + `.bebas` helper class defined, but **not referenced in `page.tsx`** — available display face, currently unused |

Typographic conventions seen:
- Headings: Orbitron, bold/900, large (`text-4xl`→`text-8xl`), tight leading, often with the `.text-gradient` fill.
- Eyebrow labels: Rajdhani, uppercase, `tracking-widest`, amber-500, small.
- The logo wordmark: `BON ` (Orbitron 700, stone-50) + `AI` (Orbitron 900, cyan→blue→violet gradient) + `R` (Orbitron 700, stone-50), with `MEDIA` beneath in Rajdhani 300, `letter-spacing: 0.35em`, stone-400.

### iOS font notes
- All four are on Google Fonts and free. **Not bundled in the repo** — download the `.ttf`s from Google Fonts, add to the app bundle, and register via `UIAppFonts` in Info.plist.
- Mapping suggestion: Orbitron → display/titles, Outfit → body, Rajdhani → captions/labels/buttons. Example: `.font(.custom("Orbitron-Bold", size: 34))`.
- Closest system fallbacks if you don't bundle fonts: Orbitron ≈ a wide rounded display (no exact SF match — bundling recommended); Outfit ≈ SF Pro / `.system(.body)`; Rajdhani ≈ a condensed face (`.system(.caption).width(.condensed)` is only approximate).

---

## 4. Spacing, radius & effects conventions

**Spacing** (standard Tailwind scale; `1` = 0.25rem = 4px):
- Page content max width: `max-w-7xl` = **80rem (1280px)**, centered, horizontal padding `px-6` (1.5rem/24px). Other section widths defined: 7xl/6xl/5xl/4xl/3xl/2xl.
- Section vertical rhythm: `py-24` (6rem/96px) typical; hero `min-h-screen`; larger sections `py-28`/`py-32`.
- Card padding: `p-8` (2rem) for glass cards; forms `p-8`→`p-12`.
- Mobile footer bar reserves `padding-bottom: 4.5rem` on body (≤768px).

**Border radius** (what's actually used):
| Element | Radius |
|---------|--------|
| Glass cards | `1.25rem` (20px) — defined in `.glass-card` |
| Buttons, logo frame, icon tiles | `rounded-xl` = 0.75rem (12px) |
| Larger panels / bee frame | `rounded-2xl` (1rem) / `rounded-3xl` (1.5rem) |
| Form inputs | `rounded-lg` = 0.5rem (8px) |
| Pills, badges, avatars, blobs | `rounded-full` / 50% |

**Signature effects:**
- **Glassmorphism card** (`.glass-card`): background `linear-gradient(135deg, rgba(28,25,23,0.6), rgba(12,10,9,0.8))`, `backdrop-filter: blur(20px)`, border `1px solid rgba(245,158,11,0.1)`, radius 20px. Hover: lift `translateY(-8px)`, border → `rgba(245,158,11,0.3)`, shadow `0 20px 60px rgba(245,158,11,0.1)`, plus a top light-line sweep.
- **Amber glow / pulse** (`pulse-glow`): `box-shadow 0 0 20px → 40px rgba(217,119,6,0.3 → 0.6)`.
- **Bee CTA glow**: `drop-shadow(0 0 40px rgba(245,158,11,0.4)) drop-shadow(0 0 80px rgba(236,72,153,0.2))` (amber + pink halo), intensifies on hover.
- **Bertrim/hero glow**: amber drop-shadow `0 0 60px rgba(245,158,11,0.3)`.
- **Grain overlay**: fixed full-screen SVG fractal-noise at `opacity: 0.03` (subtle film grain over everything).
- **Color blobs**: large circles, `filter: blur(120px)`, opacity 0.3–0.4, two-color 135° gradients — the ambient "aurora" background behind dark overlays.
- **Section backgrounds**: a dark `stone-950` overlay at 60–95% opacity sits over the blobs so content stays legible; headings pop via the amber→violet text gradient.
- **Scrollbar**: 8px, track `#1c1917`, thumb `linear-gradient(180deg,#f59e0b,#ef4444)`.
- Motion: GSAP (ScrollTrigger/TextPlugin) typewriter + reveal animations; Three.js particle field (350 pts, palette amber/pink/cyan/violet/green) in the hero. These are web-specific; on iOS translate to SwiftUI transitions/`.shadow`/`.blur` as needed.

**Overall aesthetic:** dark, near-black "stone" canvas; warm **amber/honey** as the hero accent; vivid multi-stop amber→red→pink→violet→cyan gradients for emphasis; glassmorphism cards with amber-tinted borders and glows; a playful bee + astronaut mascot system; futuristic geometric type (Orbitron) over clean body text (Outfit).

---

## 5. Tokens NOT present in the repo (so you don't go looking)
- **No `tailwind.config.*`** file (Tailwind v4 inline `@theme`).
- **No light-mode / light theme** — the design is dark-only; no light background tokens defined.
- **No bundled font files** — fonts come from Google Fonts CDN at runtime.
- **No defined semantic tokens** (e.g. "primary", "danger") — colors are referenced directly by Tailwind class / hex. The amber-500 → treat as "primary" is an inference from usage, not a named token.
- **No spacing/radius design-token variables** beyond the glass-card radius; spacing uses raw Tailwind utility classes.
- `Bebas Neue` is imported but effectively unused in the main page.
