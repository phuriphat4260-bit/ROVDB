---
name: Nexus Valor
colors:
  surface: '#0f141b'
  surface-dim: '#0f141b'
  surface-bright: '#353941'
  surface-container-lowest: '#090e15'
  surface-container-low: '#171c23'
  surface-container: '#1b2027'
  surface-container-high: '#252a32'
  surface-container-highest: '#30353d'
  on-surface: '#dee2ed'
  on-surface-variant: '#d0c5b1'
  inverse-surface: '#dee2ed'
  inverse-on-surface: '#2c3138'
  outline: '#99907d'
  outline-variant: '#4d4636'
  surface-tint: '#e9c257'
  primary: '#fff2db'
  on-primary: '#3d2e00'
  primary-container: '#fbd366'
  on-primary-container: '#745a00'
  inverse-primary: '#755b00'
  secondary: '#bbc7dd'
  on-secondary: '#253142'
  secondary-container: '#3b475a'
  on-secondary-container: '#a9b6cc'
  tertiary: '#fff1f0'
  on-tertiary: '#680011'
  tertiary-container: '#ffcbc9'
  on-tertiary-container: '#ba132b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf90'
  primary-fixed-dim: '#e9c257'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#d7e3fa'
  secondary-fixed-dim: '#bbc7dd'
  on-secondary-fixed: '#101c2c'
  on-secondary-fixed-variant: '#3b475a'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001c'
  background: '#0f141b'
  on-background: '#dee2ed'
  surface-variant: '#30353d'
  neon-blue: '#00F2FF'
  assassin-purple: '#A061FF'
  tank-cyan: '#22D3EE'
  warrior-red: '#FF4D4D'
  mage-indigo: '#6366F1'
  support-green: '#10B981'
  obsidian-dark: '#0B0E14'
typography:
  display-hero:
    fontFamily: Bebas Neue
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  stats-value:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is crafted for a high-octane, premium gaming experience. It targets competitive RoV players and enthusiasts who demand a fast, immersive, and data-rich interface. The brand personality is epic and authoritative, mirroring the intensity of the arena.

The visual style is a fusion of **Modern Corporate** and **Glassmorphism**, tempered with high-energy gaming aesthetics. It utilizes deep, obsidian-layered backgrounds to create an infinite sense of space, while hero cards and data modules employ frosted-glass textures to maintain a light, futuristic feel. Visual interest is driven by sharp geometric lines, glowing neon accents, and high-contrast color shifts that signify different hero roles and rarities.

## Colors

The palette is anchored in a "Deep Obsidian" base to ensure maximum legibility for vibrant data overlays. **Gold (#FBD366)** serves as the primary action color and signifies legendary status, used for primary buttons, rank icons, and rare hero tiers.

A secondary navy-slate is used for structural glass layers. Role-specific colors are used functionally to categorize the hero roster:
- **Assassin:** Purple hues to denote mystery and lethality.
- **Tank:** Cyan/Blue for stability and defensive strength.
- **Marksman:** Gold (Primary) for high-value precision.
- **Warrior:** Crimson/Red for aggression.
- **Mage:** Indigo for mystical energy.

Glow effects (box-shadows with high spread and low opacity) should match the hue of the element to simulate a neon "energy leak" on the dark background.

## Typography

This design system uses a triple-threat font strategy to balance impact with utility.
- **Bebas Neue** is the "Voice of the Arena," used for hero names, titles, and major headings. It is always set in uppercase to maintain a commanding presence.
- **Plus Jakarta Sans** provides a soft, approachable contrast for lore text, descriptions, and UI navigation, ensuring high readability during long sessions.
- **JetBrains Mono** is utilized for technical data, including hero stats (HP, Attack Speed), build numbers, and cooldown timers, evoking a "hacker/analyst" aesthetic.

Letter spacing should be increased slightly on all headers to reinforce the premium, cinematic feel of the database.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The philosophy focuses on "Data Densification"—allowing users to see complex stats at a glance without feeling cluttered.

Spacing follows an 8px base unit. Margins are generous (48px) on desktop to provide a cinematic framing for hero splash art, but tighten to 16px on mobile to maximize horizontal real estate for stats tables. 

Content should be organized into "Modules" (cards), which use dynamic padding based on the importance of the information. High-intensity sections like "Ability Descriptions" should use a `stack-md` rhythm to keep text legible.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Backdrop Blurs**.
1.  **Level 0 (Floor):** Deepest background (#11161D) with a subtle radial gradient of the hero's role color (e.g., a faint purple glow in the bottom corner for Assassins).
2.  **Level 1 (Surface):** Semi-transparent glass containers (Background: `rgba(30, 42, 59, 0.6)`, Backdrop-filter: `blur(12px)`).
3.  **Level 2 (Active/Hover):** Enhanced glass with a 1px solid border in the role-specific accent color.
4.  **Level 3 (Pop-ups/Modals):** High-opacity obsidian cards with a "bloom" shadow effect using the primary Gold color to draw immediate attention.

Avoid traditional black drop-shadows; instead, use colored "Outer Glows" (box-shadow: 0 0 15px rgba(accent_color, 0.3)) to emphasize active elements.

## Shapes

The shape language is **Soft (0.25rem - 0.75rem)** but incorporates **Sharp geometric accents**. While containers are slightly rounded to feel modern and accessible, they should often feature 45-degree "clipped corners" or diagonal line motifs in the borders to evoke a tactical, military-tech interface.

Buttons and active chips should use the `rounded-lg` (0.5rem) setting for a tactile, "pressable" feel, while the large Hero Splash cards use `rounded-xl` (0.75rem) to soften the large imagery.

## Components

### Buttons
- **Primary:** Solid Gold (#FBD366) with Black text. On hover, add a 10px outer gold glow.
- **Secondary:** Ghost style with a 1px Gold border.
- **Role Toggle:** Sharp-edged chips that change to the role's specific color when selected (e.g., Purple for Assassin).

### Cards (Hero/Build)
- Cards must use the Glassmorphism style defined in the Elevation section.
- Hero cards feature a vertical gradient overlay so the name (Bebas Neue) is always legible over the splash art.
- Use 1px borders with 20% opacity to define card edges without creating heavy visual weight.

### Input Fields
- Dark, inset backgrounds with a JetBrains Mono typeface.
- The focus state should trigger a "scanning" animation: a horizontal glow line that moves from left to right once.

### Stats Progress Bars
- Use role-specific colors for the fill.
- The bar background should be a dark gray with 40% opacity.
- Add a "pulse" animation to the end of the bar to indicate "Energy."

### Skill Icons
- Square with a subtle 2px radius. 
- When on cooldown, icons should desaturate and show a semi-transparent circular overlay representing the remaining time.