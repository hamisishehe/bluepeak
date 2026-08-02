---
name: FXPRO INVEST
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  numeric-data:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  sidebar-width: 280px
---

## Brand & Style
The design system is engineered to evoke institutional trust and professional rigor. It targets high-net-worth investors and active traders who require clarity and security. The visual direction follows a **Modern Corporate** aesthetic: clean lines, generous whitespace, and a sophisticated layering system.

The UI should feel "weighty" and stable, avoiding flighty trends in favor of a timeless, high-end digital banking atmosphere. Every interaction must reinforce a sense of security and precision, ensuring that complex financial data is presented with absolute legibility.

## Colors
The palette is anchored by **Deep Navy (#0F172A)** to communicate institutional authority, paired with **Royal Blue (#2563EB)** for a modern fintech feel. 

- **Primary & Secondary:** Use Deep Navy for primary navigation, headings, and high-emphasis buttons. Use Royal Blue for interaction states, primary calls to action, and active indicators.
- **Semantic Accents:** Success (Emerald) should be used for positive growth and profit indicators. Warning (Amber) is reserved for pending transactions or verification alerts. Error (Rose) denotes risk or failed operations.
- **Backgrounds:** Utilize a layered approach. The base application background is Soft Slate (#F8FAFC), while interactive surfaces and cards use pure white (#FFFFFF) to create a clear "paper" metaphor.

## Typography
This design system employs a dual-font strategy to balance character with utility. 
- **Plus Jakarta Sans** is used for headlines to provide a modern, slightly rounded, and approachable professional look.
- **Inter** is used for all body text and UI labels due to its exceptional legibility at small sizes.

**Financial Data:** For all currency values, percentages, and wallet addresses, always enable `tabular-nums` (tnum) via CSS font-feature-settings. This ensures that columns of numbers align perfectly in tables and metric cards, allowing users to scan and compare data accurately.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid** model. The main content is contained within a 1280px max-width container, centered on the screen, while the background remains fluid.

- **Grid:** Use a 12-column grid for desktop.
- **Sidebar:** A persistent 280px sidebar on the left handles primary navigation. On tablet and mobile, this transitions to a bottom navigation bar or a hidden drawer.
- **Rhythm:** An 8px base scaling unit is used for all padding and margins. Use 24px (3x) for card padding and 32px (4x) for section spacing.
- **Mobile Reflow:** For small screens, transition 3-column metric cards into a vertically stacked list to maintain readability of financial figures.

## Elevation & Depth
Elevation in this design system is conveyed through **Tonal Layers** and **Ambient Shadows**. 

1. **Level 0 (Background):** Soft Slate (#F8FAFC). No shadow.
2. **Level 1 (Cards/Sidebar):** White surface. Subtle, highly diffused shadow: `0px 4px 12px rgba(15, 23, 42, 0.04)`.
3. **Level 2 (Dropdowns/Modals):** White surface. More pronounced shadow to indicate focus: `0px 12px 32px rgba(15, 23, 42, 0.08)`.

Avoid heavy dark shadows. The goal is "lift," not "weight." Borders should be used sparingly, primarily as low-contrast separators (#E2E8F0) between table rows or list items.

## Shapes
The design system uses **Rounded (8px-12px)** geometry to soften the professional aesthetic, making it feel modern rather than dated.

- **Default (8px):** Used for buttons, input fields, and small UI elements.
- **Large (12px):** Used for primary containers, metric cards, and modal windows.
- **Pill (Full):** Reserved exclusively for status badges (e.g., "Confirmed," "Pending") and profile avatars to distinguish them from interactive buttons.

## Components

### Metric Cards
Containers for total balance and profit/loss.
- **Background:** White with Level 1 shadow.
- **Top Right:** Subtle sparkline chart or percentage badge (Emerald for positive, Rose for negative).
- **Typography:** Large headline for the value, muted body-sm for the label.

### Transaction Tables
- **Header:** Label-md typography, light slate background.
- **Rows:** Alternating subtle hover state (#F8FAFC). 
- **Status Badges:** Pill-shaped, low-opacity background with high-contrast text of the same hue (e.g., light emerald background with dark emerald text).

### Step-by-Step Forms
- **Progress Indicator:** Horizontal bar at the top with Royal Blue active states.
- **Inputs:** 8px rounded corners, 1px border (#CBD5E1). On focus: 1px Royal Blue border with a soft blue glow.

### Wallet Address Cards
- **Style:** Monospaced-look (using Inter with specific spacing) for the address. 
- **Feature:** Include a "Copy" button with a success-state feedback icon. Background should be a light gray (#F1F5F9) to denote a "read-only" code block.

### Navigation Sidebar
- **Background:** Deep Navy (#0F172A).
- **Active State:** Royal Blue vertical stripe on the left edge with a subtle white opacity background for the menu item.
- **Icons:** Minimalist line icons (2px stroke) for clarity.