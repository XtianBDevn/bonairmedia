# Nurtura — Avatar Customization: Spec & Status

**Status:** Proposal / Draft v2 · **Date:** 2026-10-09 · **Owner:** Christian Bryant
**Stack:** Expo SDK 52 · React Native · Expo Router · Convex backend · `react-native-svg` (already installed)
**Notion:** Nurtura → 🧠 Brainstorming & Mind Maps → Avatar Customization — Spec & Status
**Defaults in this doc are "proposed defaults — not yet approved decisions" unless marked otherwise.**

---

## 0. Implementation status (as of 2026-10-09)

**Two sources disagree on whether code exists — this must be confirmed on the Mac-side repo before any further implementation work.**

- **Coordinator briefing (this pass):** no avatar feature code written yet; implementation to be done in the Mac-side session on the local repo.
- **Hub page "Implementation update — 2026-10-09"** (added to the Notion hub by a *separate Claude Code session* at ~20:47Z, after this pass started): the feature was **implemented locally** — Convex `profiles`/`careRecipients` gained `avatarType`, `avatarPhotoId`, `avatarConfig` (existing `avatarEmoji` preserved); `profiles.updateAvatar` / `careRecipients.updateAvatar` enforce ownership + server-side Plus/Professional entitlement; `files.generateUploadUrl`; shared `Avatar` renderer + `AvatarPicker` (Emoji / Photo / Build tabs) used in onboarding, recipients add/edit/detail, own profile, dashboard, care summary; hand-built layered SVG builder covering **skin tone, hairstyle/color, glasses, facial hair, clothing, background only**. Static checks only: `tsc` 0 errors, `eslint` 0 errors, `jest` 12 suites / 47 tests. **Not** verified on a device/simulator/browser. That session also states no Higgsfield samples exist in the hub or repository.

If the hub entry is accurate, the remaining builder gap versus this spec is **face shape, eye color/shape, age → detail rules, patterns, hats, earrings, extras, presets**, plus device/live verification.

| Item | Status | Notes |
|---|---|---|
| Flow inspection (onboarding, recipients, more, settings, subscriptions) | Done (Codex) | Care recipients use emoji avatars via `components/EmojiPicker.tsx`; provider/family profiles show a generic person icon |
| Higgsfield connectivity | Verified (Codex) | Account balance read succeeded. This connection is for **design-time asset production only** |
| Notion brainstorming hub | Created (Codex) | `Nurtura → Brainstorming & Mind Maps`; nested correctly under the parent `Nurtura` page (verified 2026-10-09) |
| Higgsfield concept sheets | 3 generated (reported via coordinator) | "Higgsfield GPT Image 2.5" from the user's reference portrait grid; embedded in Section 1.2. Not previously saved to the hub or repo |
| Notion update with samples + spec | **Interrupted (Codex) → completed by this pass** | Hub text had no images/links/child pages saved; this child page adds them |
| Implementation (app + Convex) | **Conflicting reports — confirm in repo** | Coordinator: not started. Hub entry: implemented locally, static checks only |
| GrokBot team briefing | **Pending — not sent** | |
| Obsidian lessons capture | **Pending** | Hub entry mentions `wiki/workflow/nurtura-avatar-feature.md` in the project vault; unverified here |

### Decisions log (all *proposed*, none approved)
1. Photo uploads available to **everyone** (free included).
2. Custom avatar builder included in **active or trialing Plus and Professional** subscriptions (tiers are `free` / `plus` / `professional` — there is no tier literally named "premium").
3. Builder controls: skin tone, hairstyle + color, glasses, facial hair, clothing, background, **plus** face shape, eye color, and age (16 = no face lines; 65 = two laugh lines).
4. Instant live preview from reusable `react-native-svg` illustration parts; **Higgsfield establishes the visual direction / asset library, not per-user runtime generation.**
5. Ownership and premium entitlement enforced on the backend (Convex), not only in the UI.
6. One shared chooser component and one shared `Avatar` renderer reused across all screens and all three people types.

---

## 1. Overview & goals

### Problem
Nurtura is people-centric: a care recipient's circle (family, providers, care team) sees each other constantly in lists, schedules, messages, care logs and the care summary. Today care recipients are represented by emoji (`components/EmojiPicker.tsx`, used in `app/onboarding/index.tsx` and `app/(tabs)/recipients.tsx`) and provider/family profiles show a generic icon (`app/(tabs)/more.tsx`). Faces — real or illustrated — make the circle feel human and make people recognizable at small sizes.

### Goal
Every profile — **care recipients/patients**, **providers/care team**, and **family members** — gets a recognizable avatar through one of three paths, via one shared chooser and one shared renderer.

| Path | What it is | Who gets it (proposed) |
|---|---|---|
| **Upload your own photo** | Camera/library → square crop → stored privately in Convex file storage | **All tiers, free included** |
| **Pick a preset** | ~24 curated illustrated avatars in the flat modern style; existing emoji kept as a "Simple" row | **All tiers, free included** |
| **Build a custom avatar** | Parametric builder (face, skin, age, eyes, hair, clothing, extras, background) with live preview | **Active/trialing Plus or Professional** |

### Entitlement gating (proposed defaults)
- **Photo upload is never gated.** Locking identity basics in a caregiving app would read as a dark pattern.
- **Presets are free** so free users still get an on-brand illustrated option.
- **Builder = Plus + Professional.** Free users can open the builder and use the full live preview (soft paywall); only **Save** requires entitlement.
- **After downgrade/cancellation:** the saved custom avatar **keeps displaying** (never blank a face the care circle relies on); re-editing requires re-subscribing. Server enforces.
- Entitlement is checked in the Convex mutation using `convex/subscriptions.ts` — the UI check is a courtesy, not the gate.

### Non-goals (v1)
- No runtime AI image generation per user (Section 3).
- No animated avatars, no public sharing, no marketplace.
- No face recognition / biometric processing of uploaded photos.

### Success metrics
- ≥ 70% of active profiles have a non-default avatar within 30 days of launch.
- Builder completion rate (opened → saved) for entitled users; builder → paywall → subscribe conversion for free users.
- Live preview updates ≤ 16 ms per parameter change on a mid-range Android / iPhone 12-class device.
- Zero avatar-related privacy incidents (photo URLs are signed, short-lived, care-circle-scoped).

### 1.1 Style reference — "flat modern illustrated" (reproduce exactly)
Derived from the 8-avatar reference grid. These are the acceptance criteria for every illustration part.

- **Composition:** square 1:1 canvas. Bust portrait: head + neck + shoulders, centered. Head occupies ~45–55% of canvas height; chin ~60% down; shoulders cropped by the bottom edge spanning nearly full width. Front-facing, no 3/4 turn.
- **Background:** one solid saturated color filling the square. **No gradient, vignette, texture, pattern or shadow.** Reference palette: hot pink, electric blue, sunflower yellow, violet purple.
- **Line work:** single uniform-weight outline in dark navy (`#1F2240`), **≈ 2–2.5% of canvas width (20–24 units on a 1024 viewBox)**. Closed shapes, rounded joins and caps, **no tapering, no variable weight, no sketchiness.** Interior detail lines (nose hook, ear curve, hair strands, drawstrings, collar seams) use the same color at the same or ~80% weight.
- **Fills:** strictly flat, one tone per region. **No gradients, soft shading, cast shadows or highlights.** A second flat shape (inner mouth, inner ear, pattern motif) is the only "second tone".
- **Skin & face:** flat skin tone; **two flat circular blush spots** (radius ≈ 5% of canvas) on the cheeks; nose = one short curved line; ears = simple "C" with one inner curve; neck = plain trapezoid.
- **Eyes & brows:** two solid dark dots, small ovals with dot pupils, or closed happy arcs (∩). Brows are short thick arcs. Glasses share the outline weight; lenses transparent or flat light tint; sunglasses solid dark fill.
- **Mouth / expression:** cheerful — open "D"-shaped smile with a flat white teeth band and darker inner mouth, or a simple closed smile. **Never neutral, sad or angry.**
- **Hair:** chunky silhouettes, flat fill, a few interior strand lines; wide variety (short crop, curly volume, long straight, bob, pompadour, cap over hair).
- **Facial hair:** chunky flat silhouettes (full beard, short beard, goatee, stubble), same outline.
- **Clothing:** hoodies, crewnecks, collared tops, patterned shirts in bright colors contrasting both skin and background; simple repeating motifs (triangles, polka dots, dashes, big flowers, circles). Drawstrings/collars/necklaces drawn with the same line.
- **Proportions:** slightly oversized head (~1.3× realistic), short neck, rounded shoulders, small features clustered lower-middle of the face, generous forehead.
- **Age:** reference figures read 20s–30s with **no facial lines**. Age detail (Section 2) is added in the same line language, minimal.
- **Accessibility:** outline keeps ≥ 3:1 contrast against every fill and background it touches.

### 1.2 Higgsfield concept sheets (generated 2026-10-09 18:32 by Codex)
Three concept sheets generated with **Higgsfield GPT Image 2.5** using the user's reference portrait grid as the style input. They are *direction* artifacts for the asset library, not shipped assets.

> Note: these images could not be opened from the sandbox that wrote this document (the CDN host is blocked by the session's network policy), so they are embedded by URL without a visual description. Review them in Notion.

1. https://d8j0ntlcm91z4.cloudfront.net/user_3FzzrujK7E8xAuBfsSIMAiGe7m1/hf_20261009_183233_8ec11370-dce7-4f29-a8ca-08706df5cc43.png
2. https://d8j0ntlcm91z4.cloudfront.net/user_3FzzrujK7E8xAuBfsSIMAiGe7m1/hf_20261009_183233_54add164-bd16-488d-915e-b720c4d16cf8.png
3. https://d8j0ntlcm91z4.cloudfront.net/user_3FzzrujK7E8xAuBfsSIMAiGe7m1/hf_20261009_183233_33c5eba7-4e27-45c3-aa3c-80aa4084d984.png

---

## 2. Customization parameters

All options are rendered as `react-native-svg` parts (Section 3). "Tinted" = one path set + a `fill` prop, never one asset per color.

| Parameter | Options | Default | Notes |
|---|---|---|---|
| **Face shape** | round, oval, square, heart, long (5) | oval | Includes ears, nose, smile and blush positions |
| **Skin tone** | 10 tones S1–S10 (below) | S4 | Tinted; blush and soft-line colors derived per tone |
| **Eye color** | dark brown, brown, hazel, amber, green, blue, gray (7) | brown | Iris is a small tinted circle; collapses to a dark dot at ≤ 40 px |
| **Eye shape** | dot, oval, happy-closed (3) | dot | |
| **Age** | bracket picker: 13–19, 20–29, 30–39, 40–49, 50–64, 65–79, 80+ | 30–39 | Drives the age-detail layer (rules below); prefilled from DOB when known |
| **Hair style** | 16 styles + hijab/headwrap + **no hair** (18) | short crop | Some styles have a "back" part behind the body |
| **Hair color** | black, dark brown, brown, light brown, blonde, platinum, auburn, ginger, gray, white, pink, blue, purple, teal (14) | dark brown | Tinted |
| **Facial hair** | none, stubble, short beard, full beard, goatee, mustache, chin strap (7) | none | Follows hair color by default; override allowed |
| **Top** | hoodie, crewneck, t-shirt, collared shirt, cardigan, blouse, turtleneck, v-neck, **scrubs** (9) | crewneck | Scrubs exist specifically for providers |
| **Top color** | 12 palette colors | blue | Tinted |
| **Top pattern** | none, polka dots, triangles, dashes, flowers, stripes, hearts (7) | none | SVG `<Pattern>` clipped to the top |
| **Glasses** | none, round, rounded-rect, cat-eye, sunglasses (5) | none | |
| **Hat** | none, cap, backwards cap, beanie, bucket, headband (6) | none | Hat clips the top region of hair-front |
| **Earrings** | none, studs, hoops, drops (4) | none | |
| **Extras** | necklace, freckles, beauty mark, hearing aid (multi-select) | — | Hearing aid is an intentional inclusive option |
| **Background** | 8 bold solids (below) | blue | A single `<Rect>` fill |

### Skin tones (flat fills)
| ID | Fill | Blush | Soft line (age/detail lines) |
|---|---|---|---|
| S1 | `#FFE3D1` | `#F6AFB4` | `#C98F86` |
| S2 | `#FDD3B8` | `#F4A3A6` | `#C2846F` |
| S3 | `#F7C1A0` | `#EE9693` | `#B97660` |
| S4 | `#EBAA85` | `#E28782` | `#A86A52` |
| S5 | `#D9926B` | `#D27570` | `#9A5C44` |
| S6 | `#C27A55` | `#BE6660` | `#834B35` |
| S7 | `#A86343` | `#A85650` | `#6E3E2A` |
| S8 | `#8A4E34` | `#8F4842` | `#5A3222` |
| S9 | `#6B3A26` | `#7A3A36` | `#B07A62` |
| S10 | `#4A2818` | `#66302E` | `#A87358` |

Outline is always `#1F2240`. For S9–S10 the soft-line color is *lighter* than the skin so detail lines stay visible.

### Background palette
Pink `#FF5FA8` · Blue `#3D4FF0` · Yellow `#FFC63B` · Purple `#8A4CF4` · Coral `#FF6B5B` · Teal `#22C3B5` · Lime `#B8E04A` · Lavender `#B39BFF`

### Age → facial-detail rules
User's rule: **a 16-year-old has no lines on the face; a 65-year-old has two laugh lines.** Lines use the per-tone soft-line color at ~60% of outline weight; always flat, always minimal.

| Age bracket | Detail level | What is drawn |
|---|---|---|
| 13–19 | `none` | **No lines at all.** Slightly fuller blush, eyes 5% larger. |
| 20–29 | `none` | No lines. |
| 30–39 | `subtle` | One tiny tick at each mouth corner (≈ 1/4 of a laugh line). |
| 40–49 | `light` | Two short laugh lines (≈ 1/2 length) from nose corner toward mouth corner. |
| 50–64 | `laugh` | **Two full laugh lines** (nasolabial curves, nose to just past the mouth corners). |
| 65–79 | `laughCrow` | **Two full laugh lines** + crow's feet (2 short lines per outer eye corner; on by default, user may turn off). |
| 80+ | `laughCrowBrow` | As 65–79 plus one single horizontal forehead line. Nothing more — keep it dignified. |

- Age **suggests** gray/white hair colors (moves them to the front) at 50+ and surfaces "no hair" earlier, but **never auto-changes** a value the user already set.
- Age never changes face shape, expression or proportions.
- Under-13 profiles get the 13–19 look (no lines) — see Open Questions.

---

## 3. Architecture recommendation

### Recommendation: layered `react-native-svg` parts composited in one shared `<Avatar />` renderer
Each parameter maps to an independent SVG **part** (a small component exporting `<Path>`/`<G>` elements on a shared `viewBox="0 0 1024 1024"`). The avatar is a deterministic stack of parts inside **one** `<Svg>` element, rendered on device. This is the only runtime path in v1.

**Z-order (bottom → top):**
1. `Background` — `<Rect>` with the background color
2. `HairBack` — for long/voluminous styles (behind the body)
3. `Body` — neck + shoulders base, skin fill
4. `Top` — clothing silhouette (tinted) + `TopPattern` via `<Pattern>` + `<ClipPath>`
5. `Face` — face shape incl. ears, nose, smile, skin fill
6. `Blush` — two circles, per-tone blush color
7. `AgeDetail` — laugh lines / crow's feet / forehead line for the bracket (per face shape), soft-line stroke
8. `Eyes` + `Iris` + `Brows`
9. `FacialHair` (tinted)
10. `HairFront` (tinted) — clipped by `Hat` when a hat is present
11. `Glasses`
12. `Earrings`
13. `Extras` (necklace, hearing aid, freckles, beauty mark)

**Why SVG parts (not PNG layers):** color is a prop (`fill={skin.fill}`), so one hair shape serves all 14 hair colors and one face serves all 10 skin tones — the option set does **not** multiply asset count. Vectors are resolution-independent (16 px list row → 400 px builder preview from the same data), tiny (a few KB of path data per part, bundled as TS modules), and `react-native-svg` is already a dependency.

**Proposed file layout:**
```
components/avatar/
  Avatar.tsx                 // shared renderer: emoji | photo | preset | custom
  AvatarChooser.tsx          // shared sheet: Upload photo / Pick a preset / Build your own
  AvatarBuilder.tsx          // builder screen (live preview + category tabs)
  parts/
    index.ts                 // registry: id → component, z-order, tintable
    face/{round,oval,square,heart,long}.tsx
    age/{subtle,light,laugh,laughCrow,laughCrowBrow}.tsx   // one variant per face shape inside
    hair/front/*.tsx  hair/back/*.tsx  facialHair/*.tsx
    tops/*.tsx  patterns/*.tsx  glasses/*.tsx  hats/*.tsx  earrings/*.tsx  extras/*.tsx
  palette.ts                 // skin tones, hair colors, backgrounds, top colors
  presets.ts                 // 24 curated AvatarConfig objects
lib/avatar/
  types.ts                   // AvatarConfig, Avatar (shared with convex/ via a shared types file)
  ageRules.ts                // bracket → detail level
  random.ts                  // shuffle respecting explicit choices
```

**Renderer sketch:**
```tsx
// components/avatar/Avatar.tsx
import Svg, { Rect, G, ClipPath, Defs } from "react-native-svg";
import { Image } from "expo-image";
import { parts } from "./parts";
import { palette } from "./palette";
import { ageDetailFor } from "@/lib/avatar/ageRules";
import type { Avatar as AvatarValue, AvatarConfig } from "@/lib/avatar/types";

export function Avatar({ value, size, name }: { value: AvatarValue | undefined; size: number; name: string }) {
  if (!value || value.kind === "emoji") return <EmojiAvatar emoji={value?.emoji ?? "🙂"} size={size} name={name} />;
  if (value.kind === "photo")  return <PhotoAvatar storageId={value.photoStorageId} size={size} name={name} />; // signed URL via query
  const config = value.kind === "preset" ? presets[value.presetId] : value.config;
  return <IllustratedAvatar config={config} size={size} name={name} />;
}

export const IllustratedAvatar = React.memo(function IllustratedAvatar(
  { config: c, size, name }: { config: AvatarConfig; size: number; name: string }
) {
  const skin = palette.skin[c.skinTone];
  const hairColor = palette.hair[c.hairColor];
  const beardColor = palette.hair[c.facialHairColor ?? c.hairColor];
  const age = ageDetailFor(c.ageBracket);          // "none" | "subtle" | ... | "laughCrowBrow"
  const P = parts;                                 // registry of SVG part components

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" accessibilityLabel={name} accessibilityRole="image">
      <Defs><ClipPath id="hat"><P.HatClip hat={c.hat} /></ClipPath></Defs>
      <Rect width={1024} height={1024} rx={224} fill={palette.background[c.background]} />
      <P.HairBack  style={c.hairStyle} fill={hairColor} />
      <P.Body      fill={skin.fill} />
      <P.Top       top={c.top} fill={palette.top[c.topColor]} pattern={c.topPattern} />
      <P.Face      shape={c.faceShape} fill={skin.fill} />
      <P.Blush     shape={c.faceShape} fill={skin.blush} />
      {age !== "none" && <P.AgeDetail shape={c.faceShape} level={age} stroke={skin.softLine} />}
      <P.Eyes      shape={c.eyeShape} />
      <P.Iris      shape={c.eyeShape} fill={palette.eye[c.eyeColor]} />
      <P.Brows     shape={c.faceShape} fill={beardColor} />
      <P.FacialHair style={c.facialHair} fill={beardColor} />
      <G clipPath={c.hat !== "none" ? "url(#hat)" : undefined}>
        <P.HairFront style={c.hairStyle} fill={hairColor} />
      </G>
      <P.Hat       hat={c.hat} />
      <P.Glasses   style={c.glasses} />
      <P.Earrings  style={c.earrings} />
      {c.extras.map((e) => <P.Extra key={e} id={e} />)}
    </Svg>
  );
});
```
Every part is a pure component of `(variant, fill/stroke)` → SVG elements; outline stroke is a shared constant (`#1F2240`, width 22, `strokeLinejoin="round"`, `strokeLinecap="round"`). `IllustratedAvatar` is memoized on `config` so list rows never re-render unnecessarily; for very long lists (care summary, messages) an optional `react-native-view-shot` → PNG cache keyed by config hash can be added later if profiling shows a need.

**Where the shared renderer is used:** `app/(tabs)/index.tsx` (home), `app/(tabs)/recipients.tsx`, `app/care-summary.tsx`, `app/(tabs)/more.tsx` (own profile), onboarding (`app/onboarding/index.tsx`), care-team/message rows. **Where the shared chooser is used:** onboarding "add a photo or avatar" step, recipient edit, provider/family profile settings.

### Why this beats generating an AI image per user at runtime

| | Layered SVG compositing (recommended) | Runtime AI generation per user |
|---|---|---|
| Latency | Instant (≤ 16 ms per change, true live preview) | 5–30 s per render; no live preview |
| Cost | Zero per render, forever | Per-image fee × every edit × every user; grows with success |
| Determinism | Same config → identical pixels on every device | Different every time; "regenerate" roulette |
| Style consistency | Guaranteed — all parts curated once | Drifts per prompt/model version |
| Offline | Works offline (hospitals, basements, rural care) | Requires network |
| Editability | Change one parameter later in one tap | Must regenerate; may lose what the user liked |
| Privacy | No user data leaves the device for rendering | Prompts/photos go to a third party; health-app context |
| Age rule enforcement | Exact (the 65+ part *is* two laugh lines) | Probabilistic; can't guarantee "no lines" at 16 |
| Infra | None beyond the app bundle | **New credentials, server-side proxy, quota, billing, rate limiting, retention policy** |
| Accessibility/QA | Each part reviewed once | Every output un-reviewed |

### Higgsfield's correct role: establish the direction and generate the library, not the avatars
Use Higgsfield **at design time, in batch** to establish the visual direction (the three concept sheets) and to generate the raster part library in the reference style (Section 4). Outputs are curated, vectorized, and shipped as static `react-native-svg` parts. Higgsfield is a content-production tool here, not a runtime dependency.

> **Important:** the Higgsfield account connection that Codex verified (balance read) is a **design-time** connection used from a developer machine. Per-user AI generation in production would be a separate project requiring additional credentials, a server-side proxy (never ship the API key in the app), quota/billing, abuse controls, and a data-retention agreement. It must not be confused with, or built on top of, the existing account connection.

### Optional stretch goal — "AI remix" from photo (Phase 3, entitled users only)
Higgsfield (orchestrated through Ivy) takes the user's **uploaded photo** and produces a stylized flat-modern portrait, ideally pre-filling an `AvatarConfig` (skin tone, hair, glasses) the user then edits in the builder — so the final avatar is still a deterministic `custom` config.

**Privacy implications — resolve before building:**
- The photo **leaves the device** and is processed by a third party. Nurtura may hold health information; patient photos are sensitive even when not PHI.
- Requires **explicit, per-use consent** with plain-language disclosure (processor, retention, deletion); a separate toggle from general photo upload; **never on by default**.
- Only the profile's **owner** (or a legally authorized caregiver for recipients who cannot consent) may trigger it; care-team members may not remix a patient's photo.
- Vendor terms must guarantee no training on submitted images and prompt deletion; add to the privacy policy and processing inventory.
- Minors excluded entirely in v1.
- Marked **Phase 3**, gated behind legal/privacy review and the separate infrastructure noted above.

---

## 4. Higgsfield generation pipeline (design-time asset library)

### 4.1 Goal
Produce a registered raster part library in the reference style, then vectorize it into `react-native-svg` parts. Batch, curated, one-time (plus occasional pack expansions).

### 4.2 Registration template ("mannequin")
Every generation is conditioned on the same guide image so parts align on the 1024 viewBox:
- Head ellipse centered at (512, 440), ~460 wide × 500 tall (one mannequin per face shape).
- Eye line y = 430; mouth center y = 560; chin y = 690.
- Neck trapezoid y = 690 → 790, 160 wide at top.
- Shoulder line y = 820 spanning x = 60 → 964; torso cropped at the bottom edge.
- Ear centers at x = 290 and 734, y = 470.

The mannequin is a light-gray line drawing with the target part's region highlighted. It is supplied as the structural reference for every part prompt; prompts instruct the model to draw **only** the requested part on a chroma background.

### 4.3 Base style prompt (prepend to every prompt)
```
STYLE: flat modern vector illustration, friendly cheerful bust portrait, front-facing, centered.
Thick uniform dark navy outline (#1F2240) of equal weight on every shape, rounded line ends,
closed shapes. Strictly flat fills: no gradients, no shading, no shadows, no highlights,
no texture, no noise. Simplified geometric features: dot eyes, tiny curved nose line,
wide D-shaped smile, two flat circular cheek blush spots. Slightly oversized head, short neck,
rounded shoulders cropped at the bottom edge. Clean, crisp, sticker-like, 2D only.
Square 1:1, 1024x1024. Consistent framing with the supplied mannequin reference.
NEGATIVE: gradient, shading, shadow, 3D, realistic, photo, painterly, sketchy lines, variable
line weight, texture, noise, text, watermark, background objects, extra limbs, multiple people,
profile view, tilted head, sad expression.
```

### 4.4 Per-layer prompt templates (variables in `{}`)
Each = base style prompt + the lines below. `{chroma}` = `#00FF00`. Tintable parts are generated **two-tone** (white fill, black outline) so vectorization yields clean paths whose fill becomes a prop.

- **Face (two-tone):** `Draw ONLY the head and neck of a {face_shape} face: {face_shape} head silhouette, ears, tiny nose line, wide happy smile with flat white teeth, no eyes, no eyebrows, no hair, no blush. Pure white (#FFFFFF) fill, pure black (#000000) outline, solid {chroma} background. Align to the mannequin: eye line at y=430, chin at y=690.`
- **Age detail (line-only):** `Draw ONLY facial detail lines for a {age_detail} face on an invisible {face_shape} head: {age_detail_description}. Pure white lines on a solid {chroma} background, same line weight as the outline, minimal and tasteful, nothing else.`
- **Hair front (two-tone):** `Draw ONLY the hair in a {hair_style} style sitting on the mannequin head, chunky flat silhouette with 3–5 interior strand lines. Pure white fill, pure black outline, solid {chroma} background. No face, no head outline.`
- **Hair back (two-tone):** `Draw ONLY the portion of {hair_style} hair that falls behind the shoulders and neck. Pure white fill, black outline, {chroma} background.`
- **Facial hair (two-tone):** `Draw ONLY a {facial_hair} on the mannequin jaw and lip, chunky flat silhouette. Pure white fill, black outline, {chroma} background.`
- **Top (two-tone):** `Draw ONLY a {clothing} on the mannequin shoulders and torso, cropped by the bottom edge, with {clothing_detail}. Pure white fill, black outline, {chroma} background. No neck, no head.`
- **Pattern tile (final color):** `Draw ONLY a single seamless tile of a repeating {pattern} motif in {pattern_color}, flat, no outline, on a {chroma} background, 256x256.`
- **Accessory (final color):** `Draw ONLY {accessory} on the mannequin head, {accessory_detail}, flat fills, dark navy outline, {chroma} background.`
- **Preset (full avatar, final color):** `A {age_detail} {hair_color} {hair_style} person with {skin_tone_name} skin, {face_shape} face, {eye_color} eyes, wearing a {clothing_color} {clothing} with {pattern}, {accessory}, on a solid {background} background.`

### 4.5 Consistency strategy
1. **Style anchor:** attach the 8-avatar reference grid (and the best of the three concept sheets) as the style reference on every run; attach the mannequin as the structural reference.
2. **Fixed seed per family:** one seed per category (all hair shares one seed, all tops another) so simplification level matches; vary only the prompt variable.
3. **Lock the look first:** generate ~10 full preset avatars, pick the 3 closest to the reference, and reuse them as additional style references for every part batch.
4. **Pin the model version** (GPT Image 2.5 as used for the concept sheets) for the whole batch; re-running one asset later uses the same model + seed.
5. **Batch by category, not by avatar,** so drift is caught category-wide.

### 4.6 Export, post-processing & vectorization
- Raw export: **PNG, 1024 × 1024, RGB on chroma**; name `{category}/{id}__{seed}.png`.
- Post-process (one-off script): chroma-key → alpha; two-tone parts thresholded to pure black/white/transparent; remove specks < 20 px²; reject if the bounding box leaves the part's allowed mannequin region.
- **Vectorize:** trace to SVG (Illustrator Image Trace / Figma vector trace for curated quality, or `potrace` for a first pass); simplify to ≤ 60 path nodes per part; set fill to `currentColor` placeholder and stroke to the outline constant.
- **Convert to RN parts:** `@svgr/cli` with `--native` into `components/avatar/parts/**`, then hand-wrap each in the part interface (`fill`/`stroke` props, variant switch). Register in `parts/index.ts` with z-order and tintable flag.
- Write `manifest.json` (id, category, z-order, tintable, source seed, approver).

### 4.7 QA / curation checklist (every part)
- [ ] Outline weight within ±15% of the reference (measure at 3 points).
- [ ] No gradients/shading (only the allowed flat colors + alpha).
- [ ] Two-tone parts are strictly black / white / transparent before tracing.
- [ ] Registers on the mannequin: ears, eye line, chin, shoulder line within ±8 units.
- [ ] Composites cleanly with every face shape and the 3 lightest + 3 darkest skin tones.
- [ ] Age parts: 13–29 brackets render **no** lines; 50–64 renders exactly two laugh lines; 65+ renders two laugh lines + crow's feet.
- [ ] Traced SVG renders identically on iOS and Android via `react-native-svg` at 24 px, 48 px and 320 px.
- [ ] Reviewed for cultural/inclusivity coverage (hair textures, head coverings, hearing aid) by at least two people.
- [ ] Logged in manifest with approver.

### 4.8 Asset matrix (Phase 1 core → Phase 2 full)

| Category | Shapes (Phase 1 → 2) | Color handling | Parts |
|---|---|---|---|
| Face (incl. ears, nose, smile) | 5 | fill prop (skin) | 5 |
| Blush | 5 (per face) | fill prop | 5 |
| Age detail | 4 levels × 5 faces | stroke prop (soft line) | 20 |
| Eyes | 3 | fixed | 3 |
| Iris | 3 | fill prop | 3 |
| Brows | 3 | fill prop | 3 |
| Body/neck | 1 | fill prop (skin) | 1 |
| Hair front | 8 → 18 | fill prop | 18 |
| Hair back | 4 → 8 | fill prop | 8 |
| Facial hair | 4 → 6 | fill prop | 6 |
| Tops | 5 → 9 | fill prop | 9 |
| Patterns | 3 → 6 | fixed | 6 |
| Glasses | 2 → 4 | fixed | 4 |
| Hats | 0 → 5 | fixed | 5 |
| Earrings | 0 → 3 | fixed | 3 |
| Extras | 0 → 4 | fixed | 4 |
| Presets (configs, not art) | 24 | — | 0 extra |
| **Total** | | | **~103 parts** (Phase 1 ≈ 55) |

Without color-as-prop the same option set would be ~1,900 pre-rendered images. Expect a 30–50% rejection rate from generation, so plan ~3× raw generations per approved part (~300–350 generations).

### 4.9 Ten paste-ready Higgsfield prompts
(Each is the **base style prompt** + the lines below; attach the mannequin + reference grid.)

1. **Face — oval, two-tone**
   `Draw ONLY the head and neck of an oval face: smooth oval head silhouette, simple C-shaped ears, tiny curved nose line, wide happy D-shaped smile with a flat white teeth band, no eyes, no eyebrows, no hair, no blush. Pure white #FFFFFF fill, pure black #000000 outline of uniform thick weight, solid #00FF00 background. Align to the mannequin: eye line y=430, chin y=690.`
2. **Face — square, two-tone**
   `Draw ONLY the head and neck of a square face: broad jaw with softly rounded corners, flat-ish chin, C-shaped ears, tiny nose line, wide happy smile, no eyes, no hair, no blush. Pure white fill, pure black uniform outline, solid #00FF00 background. Align to the mannequin.`
3. **Age detail — 65+ (two laugh lines + crow's feet)**
   `Draw ONLY facial detail lines for a 65-year-old on an invisible oval head: exactly two gentle curved laugh lines from each side of the nose down past the mouth corners, and two short crow's-feet lines at the outer corner of each eye. Pure white lines of uniform weight on a solid #00FF00 background. Minimal, kind, tasteful; no other marks, no face outline.`
4. **Age detail — 50–64 (two laugh lines only)**
   `Draw ONLY two gentle curved laugh lines from each side of the nose to just past the mouth corners on an invisible oval head. Pure white lines, uniform weight, solid #00FF00 background. Nothing else — no crow's feet, no forehead lines.`
5. **Hair front — curly voluminous, two-tone**
   `Draw ONLY voluminous curly hair sitting on the mannequin head: big rounded cloud-like silhouette with 4–6 simple spiral strand lines inside, hairline just above the eye line. Pure white fill, pure black uniform outline, solid #00FF00 background. No face, no head outline, no body.`
6. **Hair back — long straight, two-tone**
   `Draw ONLY the back portion of long straight hair that falls behind the neck and over the shoulders, ending in a soft rounded edge near the bottom of the canvas. Pure white fill, pure black outline, solid #00FF00 background. No face, no front hair.`
7. **Facial hair — full beard, two-tone**
   `Draw ONLY a full chunky beard with a connected mustache on the mannequin jaw, rounded bottom edge, two or three short interior lines, mouth area left open. Pure white fill, pure black uniform outline, solid #00FF00 background.`
8. **Top — hoodie, two-tone**
   `Draw ONLY a hoodie on the mannequin shoulders and torso, cropped by the bottom edge: rounded hood collar around the neck, two drawstrings with small aglets, simple kangaroo pocket line. Pure white fill, pure black uniform outline, solid #00FF00 background. No neck, no head.`
9. **Top — scrubs (provider), two-tone**
   `Draw ONLY a medical scrubs top on the mannequin shoulders and torso, cropped by the bottom edge: V-neck collar, short set-in sleeves, one small chest pocket. Pure white fill, pure black uniform outline, solid #00FF00 background. No neck, no head.`
10. **Preset — full avatar (style-lock reference)**
    `A cheerful person with medium-deep brown skin, round face, dark brown short cropped curly hair, round glasses with thin dark frames, small gold hoop earrings, wearing a mustard-yellow crewneck with a white polka-dot pattern, two pink cheek blush spots, wide D-shaped smile, on a solid electric blue #3D4FF0 background. Bust portrait cropped at the shoulders.`

---

## 5. Data model

Identical for all three people types: family members (`profiles`, see `convex/profiles.ts`), care recipients (`careRecipients`, see `convex/careRecipients.ts`), and providers/care team. One shared validator, one shared renderer. **Existing emoji avatars are preserved** as `kind: "emoji"`.

> **Reconcile with what may already exist:** the hub's implementation update describes flat columns (`avatarType`, `avatarPhotoId`, `avatarConfig`, legacy `avatarEmoji`) rather than the single discriminated-union `avatar` field below. Both are workable; if the flat columns are already in `convex/schema.ts`, keep them and treat the union below as the **client-side view type** (`types/avatar.ts`) that the renderer consumes. Do not run a migration just to match this document.

### TypeScript (shared between app and Convex)
```ts
// lib/avatar/types.ts  (imported by both app/ and convex/)
export type FaceShape   = "round" | "oval" | "square" | "heart" | "long";
export type EyeColor    = "darkBrown" | "brown" | "hazel" | "amber" | "green" | "blue" | "gray";
export type EyeShape    = "dot" | "oval" | "happy";
export type AgeBracket  = "13-19" | "20-29" | "30-39" | "40-49" | "50-64" | "65-79" | "80+";
export type AgeDetail   = "none" | "subtle" | "light" | "laugh" | "laughCrow" | "laughCrowBrow";
export type HairStyle   = "none" | "shortCrop" | "buzz" | "sidePart" | "quiff" | "curlyShort" | "curlyVolume" | "afro"
                        | "longStraight" | "longWavy" | "bob" | "pixie" | "braids" | "locs" | "bun" | "ponytail"
                        | "slickedBack" | "hijab" | "headwrap";
export type HairColor   = "black" | "darkBrown" | "brown" | "lightBrown" | "blonde" | "platinum" | "auburn" | "ginger"
                        | "gray" | "white" | "pink" | "blue" | "purple" | "teal";
export type FacialHair  = "none" | "stubble" | "shortBeard" | "fullBeard" | "goatee" | "mustache" | "chinStrap";
export type Top         = "hoodie" | "crewneck" | "tee" | "collared" | "cardigan" | "blouse" | "turtleneck" | "vneck" | "scrubs";
export type TopColor    = "red" | "coral" | "orange" | "mustard" | "lime" | "green" | "teal" | "blue" | "navy" | "purple" | "pink" | "white";
export type TopPattern  = "none" | "polkaDots" | "triangles" | "dashes" | "flowers" | "stripes" | "hearts";
export type Glasses     = "none" | "round" | "roundedRect" | "catEye" | "sunglasses";
export type Hat         = "none" | "cap" | "backwardsCap" | "beanie" | "bucket" | "headband";
export type Earrings    = "none" | "studs" | "hoops" | "drops";
export type Extra       = "necklace" | "freckles" | "beautyMark" | "hearingAid";
export type Background  = "pink" | "blue" | "yellow" | "purple" | "coral" | "teal" | "lime" | "lavender";

export interface AvatarConfig {
  version: 1;
  faceShape: FaceShape;
  skinTone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  eyeColor: EyeColor;
  eyeShape: EyeShape;
  ageBracket: AgeBracket;
  hairStyle: HairStyle;
  hairColor: HairColor;
  facialHair: FacialHair;
  facialHairColor?: HairColor;      // undefined → follows hairColor
  top: Top;
  topColor: TopColor;
  topPattern: TopPattern;
  glasses: Glasses;
  hat: Hat;
  earrings: Earrings;
  extras: Extra[];
  background: Background;
}

export type Avatar =
  | { kind: "emoji";  emoji: string;                 updatedAt: number }   // existing emoji avatars, preserved
  | { kind: "photo";  photoStorageId: string;        updatedAt: number }   // Convex _storage id; never a raw URL
  | { kind: "preset"; presetId: string;              updatedAt: number }   // e.g. "preset-07" → AvatarConfig in presets.ts
  | { kind: "custom"; config: AvatarConfig;          updatedAt: number };  // entitled users only

// lib/avatar/ageRules.ts
export const ageDetailFor = (b: AgeBracket): AgeDetail =>
  ({ "13-19": "none", "20-29": "none", "30-39": "subtle", "40-49": "light",
     "50-64": "laugh", "65-79": "laughCrow", "80+": "laughCrowBrow" } as const)[b];
```

### Convex schema (`convex/schema.ts`)
```ts
// convex/avatarValidators.ts
import { v } from "convex/values";

const lit = <T extends string>(xs: readonly T[]) => v.union(...xs.map((x) => v.literal(x)) as any);

export const avatarConfigValidator = v.object({
  version: v.literal(1),
  faceShape: lit(["round", "oval", "square", "heart", "long"]),
  skinTone: v.number(),                       // 1..10, range-checked in the mutation
  eyeColor: v.string(),
  eyeShape: v.string(),
  ageBracket: lit(["13-19", "20-29", "30-39", "40-49", "50-64", "65-79", "80+"]),
  hairStyle: v.string(),                      // "none" is valid
  hairColor: v.string(),
  facialHair: v.string(),
  facialHairColor: v.optional(v.string()),
  top: v.string(),
  topColor: v.string(),
  topPattern: v.string(),
  glasses: v.string(),
  hat: v.string(),
  earrings: v.string(),
  extras: v.array(v.string()),
  background: v.string(),
});

export const avatarValidator = v.union(
  v.object({ kind: v.literal("emoji"),  emoji: v.string(),                 updatedAt: v.number() }),
  v.object({ kind: v.literal("photo"),  photoStorageId: v.id("_storage"),  updatedAt: v.number() }),
  v.object({ kind: v.literal("preset"), presetId: v.string(),              updatedAt: v.number() }),
  v.object({ kind: v.literal("custom"), config: avatarConfigValidator,     updatedAt: v.number() }),
);

// convex/schema.ts (excerpt) — add the same optional field to each people table:
//   profiles:        { ..., avatar: v.optional(avatarValidator) }   // family members + providers
//   careRecipients:  { ..., emoji: v.optional(v.string()) /* legacy */, avatar: v.optional(avatarValidator) }
// Migration: for careRecipients with `emoji` and no `avatar`, the renderer treats `emoji` as
// { kind: "emoji" } at read time; a one-off migration backfills `avatar` and the `emoji` column is dropped later.
```

### Convex mutation + entitlement (`convex/avatars.ts`)
```ts
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { avatarValidator } from "./avatarValidators";
import { getActiveSubscription } from "./subscriptions";   // existing: free | plus | professional

export const setAvatar = mutation({
  args: {
    target: v.union(
      v.object({ type: v.literal("profile"),       id: v.id("profiles") }),
      v.object({ type: v.literal("careRecipient"), id: v.id("careRecipients") }),
    ),
    avatar: avatarValidator,
  },
  handler: async (ctx, { target, avatar }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED" });

    // Ownership: own profile, or a care recipient the caller is primary caregiver for (see Open Questions).
    await assertCanEditAvatar(ctx, identity, target);

    // Entitlement is enforced HERE, not only in the UI.
    if (avatar.kind === "custom") {
      const sub = await getActiveSubscription(ctx, identity);
      const entitled = !!sub && ["active", "trialing"].includes(sub.status) && ["plus", "professional"].includes(sub.plan);
      if (!entitled) throw new ConvexError({ code: "PREMIUM_REQUIRED" });
      if (avatar.config.skinTone < 1 || avatar.config.skinTone > 10) throw new ConvexError({ code: "INVALID_CONFIG" });
    }

    // Photos: must be an upload made by this identity through generateUploadUrl, ≤ 2 MB, image/*.
    if (avatar.kind === "photo") await assertOwnsUpload(ctx, identity, avatar.photoStorageId);

    const table = target.type === "profile" ? "profiles" : "careRecipients";
    const prev = await ctx.db.get(target.id);
    await ctx.db.patch(target.id, { avatar: { ...avatar, updatedAt: Date.now() } });
    if (prev?.avatar?.kind === "photo" && (avatar.kind !== "photo" || avatar.photoStorageId !== prev.avatar.photoStorageId)) {
      await ctx.storage.delete(prev.avatar.photoStorageId);   // replace/delete old photo
    }
  },
});

export const generateAvatarUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED" });
    return await ctx.storage.generateUploadUrl();
  },
});

// Photo URLs are never stored; they are minted per read and only for care-circle members.
export const getAvatarPhotoUrl = query({
  args: { storageId: v.id("_storage"), target: v.object({ type: v.string(), id: v.string() }) },
  handler: async (ctx, { storageId, target }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    if (!(await isInCareCircle(ctx, identity, target))) return null;
    return await ctx.storage.getUrl(storageId);   // short-lived signed URL
  },
});
```

### Photo handling rules
- Client: `expo-image-picker` (camera or library, `allowsEditing` square crop) → `expo-image-manipulator` resize to 512 × 512 JPEG q0.85, which also **strips EXIF/location** → upload via `generateAvatarUploadUrl`. Max 2 MB. HEIC handled by the manipulator.
- Only the `_storage` id is stored on the profile. URLs minted per read, care-circle-scoped, short-lived; rendered with `expo-image` (disk cache keyed by storage id).
- Replacing a photo deletes the previous object; deleting a profile deletes its photo.

---

## 6. UX flow

### Entry points (shared `AvatarChooser`)
- Care-recipient onboarding (`app/onboarding/index.tsx`): the current emoji step becomes "Add a photo or avatar" (skippable; emoji still available).
- Care-recipient edit (`app/(tabs)/recipients.tsx`) — replaces the current `EmojiPicker` usage.
- Own profile (`app/(tabs)/more.tsx`) — replaces the generic person icon for family members and providers.
- Ivy deep link: "Want to give Mom's profile a face?" → chooser.

### Screen 1 — Avatar chooser (bottom sheet)
Current avatar large at top. Three cards:
- **Upload a photo** — Camera / Photo Library → square crop → Use photo. (Everyone.)
- **Pick a preset** — 4 × 6 grid of illustrated presets; tap to apply instantly. (Everyone.) Existing emoji remain as a "Simple" row at the bottom (reuses `components/EmojiPicker.tsx`).
- **Build your own** — opens the builder. Shows a small "Plus" pill for non-entitled users; **the card is never disabled**.

### Screen 2 — Avatar builder (`app/avatar-builder.tsx`, Expo Router modal)
- **Live preview** fills the top ~40% (the same `IllustratedAvatar` at 320 px), updates on every tap, with **Shuffle** and **Undo**.
- **Category tabs** (horizontal, scrollable): **Face · Eyes · Skin · Age · Hair · Clothes · Extras · Background**.
  - *Face:* 5 face-shape chips.
  - *Eyes:* eye shape (3), eye color (7 swatches), brows (3).
  - *Skin:* 10 tone swatches in one row, labeled "Skin tone 7 of 10" for screen readers.
  - *Age:* segmented bracket picker (7). Caption explains the effect: "Adds two gentle laugh lines" at 50–64, "Adds laugh lines and crow's feet" at 65+; "Crow's feet" toggle appears at 65+. Prefilled from DOB when known.
  - *Hair:* style grid (incl. None, hijab, headwrap) + color swatches; facial-hair row with "match hair color" toggle.
  - *Clothes:* top grid, color swatches, pattern row. "Scrubs" pinned first for provider profiles.
  - *Extras:* glasses, hats, earrings, necklace, freckles, beauty mark, hearing aid.
  - *Background:* 8 swatches.
- **Shuffle:** randomizes everything except skin tone, age and hair style once the user has set them ("respect explicit choices").
- **Save** (primary) / **Cancel**.

### Soft paywall (ethical, non-dark-pattern)
- Non-entitled users get the **full builder with full live preview**. Nothing blurred, grayed or teased.
- On **Save**, a sheet shows *their* avatar, "Custom avatars are part of Nurtura Plus", one clear price line, **Start free trial / Subscribe**, and an equally prominent **"Keep a free preset instead"** that saves the nearest preset (or their photo) with no friction. No timers, no fake scarcity, no pre-checked boxes, max one paywall impression per builder session.
- The builder config is **kept locally** so if they subscribe later their avatar is waiting.
- Server `PREMIUM_REQUIRED` maps to the same sheet, never a raw error.

### Permissions & roles (proposed)
- Family members and providers edit their own avatar.
- Care-recipient avatars: editable by the recipient (if they have an account) and the **primary caregiver**; other care-team members view only.

### Accessibility
- Every chip/swatch has `accessibilityLabel` + `accessibilityState`; preview announces "Avatar updated: curly hair, teal" via `AccessibilityInfo.announceForAccessibility`.
- Font scaling respected; swatches ≥ 44 pt; color options carry names (never color-only).
- Reduce Motion: no preview animation.
- Rendered avatars carry `accessibilityLabel` = the person's name (never a description of the face).

### States
- Offline: builder fully works; save queues and retries; photo upload shows "Will upload when online."
- Errors: upload too large / unsupported → inline message; `PREMIUM_REQUIRED` → paywall sheet; `FORBIDDEN` → "You can't change this person's avatar."

---

## 7. Phasing

### Phase 1 — Foundation
- Shared `Avatar` renderer handling `emoji | photo | preset | custom`, wired into home, recipients, care summary, more, onboarding, message/care-team rows.
- Shared `AvatarChooser`; **photo upload** (crop, EXIF strip, Convex storage, signed read); **24 presets**; emoji preserved.
- Builder with **core parts**: face shape, skin tone, age (full rules), eye shape/color, 8 hair styles + colors, 4 facial-hair options, 5 tops + colors, 3 patterns, 2 glasses, 8 backgrounds.
- `avatar` field on `profiles` and `careRecipients`; `setAvatar` with server-side ownership + entitlement; emoji backfill migration.
- Higgsfield batch for the Phase 1 part set (~55 parts) → vectorize → `parts/**` + manifest.
- Soft paywall; analytics (`avatar_chooser_opened`, `avatar_builder_saved`, `avatar_paywall_shown`, `avatar_paywall_converted`).

### Phase 2 — Full parameter set
- Remaining hair styles (hijab/headwrap, locs, braids), hair-back parts, all facial hair, all tops incl. scrubs, all patterns, hats, earrings, extras (hearing aid, necklace, freckles, beauty mark), crow's-feet toggle.
- Ivy suggestion: "Give Dad's profile a face?" with one-tap prefill (age from DOB, scrubs for providers).
- Optional PNG snapshot cache for very long lists if profiling shows a need.

### Phase 3 — AI remix from photo (after privacy/legal review + separate infra)
- Consent flow, vendor DPA, retention policy, minors excluded, server-side proxy with its own credentials.
- Higgsfield image-to-image in the flat style → `AvatarConfig` prefill → user edits in builder → saved as `custom` so the result stays deterministic and editable.

---

## 8. Open questions

1. **Entitled tiers:** builder in Plus **and** Professional (proposed), or Professional only?
2. **Who can change a care recipient's avatar** — recipient + primary caregiver only (proposed), or any care-team member?
3. **Downgrade behavior:** keep showing the saved custom avatar read-only (proposed) vs. revert to a preset?
4. **Where do providers live in the schema** — on `profiles` with a role, or a separate table? The `avatar` field is added wherever provider records live.
5. **Child profiles (under 13):** allowed as care recipients? If so, no bracket below 13–19 is needed, but AI remix must be excluded and photo rules may need guardian consent.
6. **Photo moderation:** any review/report path needed given care circles are private and small? (Proposed: none in v1 beyond "Report" on provider profiles.)
7. **Higgsfield plan & licensing:** confirm commercial-use rights for generated assets and which model supports reference-image conditioning; budget ~300–350 generations.
8. **Hat vs. hair:** acceptable that hats clip some hair styles, or restrict hats to compatible styles?
9. **Preset diversity sign-off:** who approves inclusivity coverage of the 24 presets (skin tones, hair textures, head coverings, ages, assistive devices)?
10. **Age from DOB:** prefill the age bracket from the profile's date of birth when known (proposed yes, user can override)?
