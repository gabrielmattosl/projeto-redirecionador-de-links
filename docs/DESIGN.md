---
name: Link Utility & Management
colors:
  surface: '#faf8ff'
  surface-dim: '#d5d9ee'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e3e7fc'
  surface-container-highest: '#dde2f6'
  on-surface: '#161b2a'
  on-surface-variant: '#444653'
  inverse-surface: '#2b303f'
  inverse-on-surface: '#eef0ff'
  outline: '#757684'
  outline-variant: '#c5c5d5'
  surface-tint: '#3c55c0'
  primary: '#082c9a'
  on-primary: '#ffffff'
  primary-container: '#2c46b1'
  on-primary-container: '#b4c0ff'
  inverse-primary: '#b9c3ff'
  secondary: '#4558aa'
  on-secondary: '#ffffff'
  secondary-container: '#93a6fe'
  on-secondary-container: '#243889'
  tertiary: '#78002a'
  on-tertiary: '#ffffff'
  tertiary-container: '#9b1a3e'
  on-tertiary-container: '#ffadb7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001256'
  on-primary-fixed-variant: '#1f3ba7'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c3ff'
  on-secondary-fixed: '#001355'
  on-secondary-fixed-variant: '#2c4091'
  tertiary-fixed: '#ffd9dd'
  tertiary-fixed-dim: '#ffb2bc'
  on-tertiary-fixed: '#400012'
  on-tertiary-fixed-variant: '#8e0c35'
  background: '#faf8ff'
  on-background: '#161b2a'
  surface-variant: '#dde2f6'
typography:
  headline-lg:
    fontFamily: Open Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  body-sm:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body-sm-bold:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-xs:
    fontFamily: Open Sans
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers a professional, minimal, and utility-driven digital workspace engineered specifically for URL shortening, link organization, and analytics management. The core design philosophy centers on extreme functional clarity, instant scannability, and high-efficiency workflow execution.

- **Design Style:** Modern Minimalist Utility. Interfaces prioritize pure white surfaces layered over subtle neutral tinted backgrounds (`#F9F9FB` and `#E4E6EC`), crisp 1px structural contours, and intentional primary blue focal points.
- **Brand Personality:** Pragmatic, dependable, agile, and frictionless.
- **Target Audience:** Digital marketers, content creators, engineers, and product teams who require dependable tools to generate, track, copy, and organize links without visual noise.
- **Emotional Response:** Confidence, focus, and speed. Users should immediately perceive the interface as intuitive, tidy, and rock-solid.

## Colors

The color system is constructed with dedicated operational roles:

- **Primary (`#2C46B1` / `blue-base`):** The definitive brand color used for key calls-to-action, primary buttons, active input strokes, selected navigational indicators, and primary vector assets.
- **Primary Hover / Dark (`#2C4091` / `blue-dark`):** The interactive hover and press state for primary interactive elements, ensuring visible feedback while maintaining WCAG contrast ratios.
- **Danger / Feedback (`#B12C4D`):** Applied exclusively to critical alerts, input validation errors, destructive actions (e.g., delete link), and inline error states.
- **Grayscale Scale:**
  - `white` (`#FFFFFF`): Primary card surfaces, modal sheets, and button text on dark fills.
  - `gray-100` (`#F9F9FB`): Global application background and soft secondary button fills.
  - `gray-200` (`#E4E6EC`): Surface divisions, inactive borders, input outlines, and secondary container fills.
  - `gray-300` (`#CDCFD5`): Input placeholder text, disabled outlines, and structural divider lines.
  - `gray-400` (`#74798B`): Secondary text, icon default tints, and input labels.
  - `gray-500` (`#4D505C`): Subtle text headings, metadata indicators, and inactive tab labels.
  - `gray-600` (`#1F2025`): Primary body copy, strong headings, and high-emphasis data points.

## Typography

The design system relies on **Open Sans** across all typographic hierarchies, balancing legible humanist curves with rigid digital utility.

- **Text XL (`headline-lg` / 24px, Bold, 32px line-height):** Primary modal headers, section milestones, and page titles.
- **Text Lg (`headline-md` / 18px, Bold, 24px line-height):** Card headers, group titles, and primary statistic labels.
- **Text Md (`body-md` / 14px, SemiBold, 18px line-height):** Primary interactive copy (button text, active inputs, table link values).
- **Text Sm (`body-sm` / 12px, Regular & SemiBold, 16px line-height):** Secondary labels, metadata rows, timestamps, and input error text.
- **Text XS (`label-xs` / 10px, Regular, 14px line-height, Uppercase):** Input field category labels, tag headers, and overlines. Always styled with uppercase casing and positive letter spacing for optimal readability.

## Layout & Spacing

A disciplined 8-point base grid drives spacing across all interfaces, with 4px sub-grid tokens for micro-components like badges and icon buttons.

- **Layout Philosophy:** Fluid-bounded layout. The primary workspace spans up to a maximum width of `1200px` centered on canvas, adapting gracefully to viewport constraints.
- **Grid Architecture:**
  - **Desktop (1024px+):** 12-column grid, `margin`: `2rem` (32px), `gutter`: `1rem` (16px).
  - **Tablet (768px – 1023px):** 8-column grid, `margin`: `1.5rem` (24px), `gutter`: `1rem` (16px).
  - **Mobile (< 768px):** 4-column grid, `margin-mobile`: `1rem` (16px), `gutter-mobile`: `0.75rem` (12px).
- **Component Insets & Stack Spacing:**
  - `space-xs` (4px): Spacing between form input labels and field containers; gap between inline icons and adjacent text.
  - `space-sm` (8px): Padding inside icon buttons; horizontal separation between utility buttons.
  - `space-md` (12px): Vertical padding inside form inputs and button elements.
  - `space-lg` (16px): Horizontal padding inside form inputs, action buttons, and card inner gutters.
  - `space-xl` (24px): Stack distance between disparate fieldsets and discrete card modules.

## Elevation & Depth

This design system deliberately eschews heavy drop-shadows and skeuomorphic gradients in favor of **Tonal Layering** and **Low-Contrast Structural Outlines**.

- **Surface Levels:**
  - **Level 0 (Canvas):** Colored with `gray-100` (`#F9F9FB`) for primary app views, or `gray-200` (`#E4E6EC`) in content containers.
  - **Level 1 (Card & Content Blocks):** Solid `white` (`#FFFFFF`) with a 1px border colored with `gray-200` (`#E4E6EC`).
  - **Level 2 (Popovers & Modals):** Crisp `white` (`#FFFFFF`) background elevated strictly with an ambient, diffused shadow: `0 4px 16px rgba(31, 32, 37, 0.06)`.
- **States of Depth:**
  - **Hover:** Raised subtle shift to `gray-200` outlines rather than intense shadows.
  - **Focus:** No blurry glows; an authoritative 1.5px solid ring colored `blue-base` (`#2C46B1`).

## Shapes

The design system employs clean, subtle corner radiuses (Soft / `roundedness: 1`), projecting an engineered and disciplined feel.

- **Base Radius (0.25rem / 4px):** Form controls, text inputs, icon-only buttons, badge chips, and inline action buttons.
- **Medium Radius (0.5rem / 8px):** Link summary cards, notification banners, and popover menus.
- **Large Radius (0.75rem / 12px):** Global dashboard panels, modal dialogs, and primary utility sheets.
- **Pill (9999px):** Status badges and counter tags.

## Components

### Buttons
- **Primary Button:**
  - **Default:** Background `blue-base` (`#2C46B1`), text `white`, border none, radius 4px, font `Open Sans` 14px SemiBold, height 40px, padding 0 16px.
  - **Hover:** Background `blue-dark` (`#2C4091`).
  - **Disabled:** Background `blue-base` with 50% opacity (`rgba(44, 70, 177, 0.5)`), cursor not-allowed.
- **Secondary Button:**
  - **Default:** Background `gray-100` (`#F9F9FB`), text `gray-600` (`#1F2025`), border 1px solid `gray-200` (`#E4E6EC`), radius 4px.
  - **Hover:** Background `gray-200` (`#E4E6EC`).
  - **Disabled:** Background `white`, text `gray-300` (`#CDCFD5`), border 1px solid `gray-200`.

### Icon Buttons
- **Default:** Minimal 32x32px square element, transparent background, text/icon color `gray-400` (`#74798B`), radius 4px. Uses **Phosphor Icons** (e.g., `Copy`, `Trash`, `Download`, `LinkSimple`).
- **Hover:** Background `gray-200` (`#E4E6EC`), icon color `gray-600` (`#1F2025`).
- **Disabled:** Icon color `gray-300` (`#CDCFD5`), pointer-events none.

### Inputs & Form Fields
- **Container Structure:**
  - **Label:** Text XS (10px, Regular, Uppercase, letterSpacing: 0.05em), color `gray-400` (`#74798B`), positioned 4px above input.
  - **Field Input:** Height 40px, padding 0 12px, font `Open Sans` 14px, radius 4px, background `white`.
- **States:**
  - **Empty / Default:** Border 1px solid `gray-200` (`#E4E6EC`), placeholder text `gray-300` (`#CDCFD5`).
  - **Filled / Default:** Border 1px solid `gray-200` (`#E4E6EC`), text `gray-600` (`#1F2025`).
  - **Active / Focus:** Border 1.5px solid `blue-base` (`#2C46B1`), text `gray-600`.
  - **Error:** Border 1px solid `danger` (`#B12C4D`), text `gray-600`. Accompanied by Phosphor `WarningCircle` icon (12px) and error text (Text Sm, 12px, color `#B12C4D`) placed 4px beneath the field.

### Cards & Link Containers
- White background (`#FFFFFF`), 1px solid `gray-200` border, 8px border-radius, padding 16px.
- Displays shortened URL with `blue-base` text color and bold weight, coupled with destination URL in `gray-400` text. Actions (Copy, Download QR, Delete) align right using Icon Button variants.