# Board Master - Visual Design System

**Version**: 1.0.0
**Last Updated**: January 10, 2026
**Status**: Official Design Source of Truth

---

## 🎨 Color Palette

All colors are derived from the canonical color reference image and organized into scales from 50 (lightest) to 900 (darkest).

### Primary Colors

#### Navy Blue
Main brand color for primary actions, headers, and interactive elements.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 50    | `#E8EBF0` | `--color-navy-50` | Subtle backgrounds |
| 100   | `#C1CADE` | `--color-navy-100` | Light backgrounds, hover states |
| 200   | `#9AA9CC` | `--color-navy-200` | Disabled states |
| 300   | `#7388BA` | `--color-navy-300` | Borders, dividers |
| 400   | `#4C67A8` | `--color-navy-400` | Secondary text |
| 500   | `#254696` | `--color-navy-500` | **Default** - Primary buttons, links |
| 600   | `#1E3878` | `--color-navy-600` | Active/pressed states |
| 700   | `#172A5A` | `--color-navy-700` | Dark text |
| 800   | `#101C3C` | `--color-navy-800` | Headings |
| 900   | `#090E1E` | `--color-navy-900` | Maximum contrast |

#### Bold Peach
Warm accent for encouragement, rewards, and positive reinforcement.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 50    | `#FEF5EE` | `--color-peach-50` | Light backgrounds |
| 100   | `#FDE4D4` | `--color-peach-100` | Subtle highlights |
| 200   | `#FBD3BA` | `--color-peach-200` | Hover backgrounds |
| 300   | `#F9C2A0` | `--color-peach-300` | Borders |
| 400   | `#F7B186` | `--color-peach-400` | Secondary elements |
| 500   | `#F5A06C` | `--color-peach-500` | **Default** - Accent buttons, highlights |
| 600   | `#C48056` | `--color-peach-600` | Active states |
| 700   | `#936041` | `--color-peach-700` | Dark accents |
| 800   | `#62402B` | `--color-peach-800` | Text on light backgrounds |
| 900   | `#312016` | `--color-peach-900` | Maximum contrast |

#### Jungle Mist
Calming neutral for backgrounds and supporting elements.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 50    | `#EEF3F4` | `--color-mist-50` | Page backgrounds |
| 100   | `#D4E2E4` | `--color-mist-100` | Card backgrounds |
| 200   | `#BAD1D4` | `--color-mist-200` | Disabled backgrounds |
| 300   | `#A0C0C4` | `--color-mist-300` | Borders |
| 400   | `#86AFB4` | `--color-mist-400` | Secondary borders |
| 500   | `#6C9EA4` | `--color-mist-500` | **Default** - Subtle accents |
| 600   | `#567E83` | `--color-mist-600` | Active states |
| 700   | `#415F62` | `--color-mist-700` | Dark borders |
| 800   | `#2B3F42` | `--color-mist-800` | Text on light backgrounds |
| 900   | `#162021` | `--color-mist-900` | Maximum contrast |

### Accent (Semantic) Colors

#### Success
For positive feedback, completed tasks, and achievements.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 100   | `#E8F5D9` | `--color-success-100` | Light backgrounds |
| 200   | `#C6E8A7` | `--color-success-200` | Hover states |
| 300   | `#9DD35F` | `--color-success-300` | **Default** - Success messages |
| 400   | `#6B9E2E` | `--color-success-400` | Active states, icons |

#### Info
For informational messages and neutral notifications.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 100   | `#D4E4F7` | `--color-info-100` | Light backgrounds |
| 200   | `#8DB9ED` | `--color-info-200` | Hover states |
| 300   | `#4A90E2` | `--color-info-300` | **Default** - Info messages |
| 400   | `#2563B8` | `--color-info-400` | Active states, icons |

#### Warning
For alerts, pending actions, and caution states.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 100   | `#FFF4D6` | `--color-warning-100` | Light backgrounds |
| 200   | `#FFE699` | `--color-warning-200` | Hover states |
| 300   | `#FFD43B` | `--color-warning-300` | **Default** - Warning messages |
| 400   | `#A68828` | `--color-warning-400` | Active states, icons |

#### Error
For errors, rejections, and critical alerts.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 100   | `#FDE6E6` | `--color-error-100` | Light backgrounds |
| 200   | `#FABBBB` | `--color-error-200` | Hover states |
| 300   | `#F67676` | `--color-error-300` | **Default** - Error messages |
| 400   | `#A03636` | `--color-error-400` | Active states, icons |

### Neutral Colors

#### Shades & Content
Greys for text hierarchy, backgrounds, and UI structure.

| Scale | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| 50    | `#FAFAFA` | `--color-grey-50` | Light font - Subtle backgrounds |
| 100   | `#F5F5F5` | `--color-grey-100` | Page backgrounds |
| 200   | `#E5E5E5` | `--color-grey-200` | Disabled backgrounds |
| 300   | `#D4D4D4` | `--color-grey-300` | **Default** - Borders, dividers |
| 400   | `#A3A3A3` | `--color-grey-400` | Secondary text |
| 500   | `#737373` | `--color-grey-500` | Body text |
| 600   | `#525252` | `--color-grey-600` | Primary text |
| 700   | `#404040` | `--color-grey-700` | Dark text |
| 800   | `#262626` | `--color-grey-800` | Headings |
| 900   | `#171717` | `--color-grey-900` | Dark font - Maximum contrast |

---

## 📏 Layout & Spacing

### 8px Grid System

All spacing follows an 8px base unit for consistency and alignment.

#### Spacing Scale

| Token | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| 0     | 0px   | `--space-0` | No spacing |
| 0.5   | 2px   | `--space-0.5` | Tight spacing (borders) |
| 1     | 4px   | `--space-1` | Minimal spacing |
| 2     | 8px   | `--space-2` | Base unit |
| 3     | 12px  | `--space-3` | Small spacing |
| 4     | 16px  | `--space-4` | Standard spacing |
| 5     | 20px  | `--space-5` | Medium spacing |
| 6     | 24px  | `--space-6` | Large spacing |
| 8     | 32px  | `--space-8` | Extra large spacing |
| 10    | 40px  | `--space-10` | Section spacing |
| 12    | 48px  | `--space-12` | Component spacing |
| 16    | 64px  | `--space-16` | Layout spacing |
| 20    | 80px  | `--space-20` | Large layout spacing |
| 24    | 96px  | `--space-24` | Extra large layout spacing |
| 32    | 128px | `--space-32` | Page section spacing |
| 40    | 160px | `--space-40` | Hero spacing |
| 48    | 192px | `--space-48` | Major section spacing |
| 56    | 224px | `--space-56` | Large hero spacing |
| 64    | 256px | `--space-64` | Maximum spacing |

### Spacing Rhythm

#### Tight Rhythm
**Usage**: Dense layouts, compact cards, inline elements
**Spacing**: 2px, 4px, 8px
**Examples**: Button padding, list items, form fields

#### Normal Rhythm (Default)
**Usage**: Standard UI components, general layouts
**Spacing**: 8px, 16px, 24px, 32px
**Examples**: Card padding, section spacing, component gaps

#### Relaxed Rhythm
**Usage**: Marketing pages, hero sections, breathing room
**Spacing**: 32px, 48px, 64px, 96px+
**Examples**: Page sections, hero layouts, landing pages

---

## 🔤 Typography

### Font Families

**Display & Headings**: [Slackey](https://fonts.google.com/specimen/Slackey) (Google Fonts)
- Playful, friendly, child-appropriate
- Use for: App title, main headings, feature titles

**Body Text**: [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
- Clean, readable, modern
- Use for: All body text, buttons, labels, UI elements

### Type Scale

Based on Material Design with child-friendly adjustments (minimum 16px body).

| Level | Font | Size | Line Height | Weight | CSS Variable | Usage |
|-------|------|------|-------------|--------|--------------|-------|
| **Display** | Slackey | 48px | 56px (1.17) | 400 | `--font-display` | App logo, hero titles |
| **H1** | Slackey | 36px | 44px (1.22) | 400 | `--font-h1` | Page titles |
| **H2** | Slackey | 28px | 36px (1.29) | 400 | `--font-h2` | Section headings |
| **H3** | Poppins | 24px | 32px (1.33) | 600 | `--font-h3` | Subsection headings |
| **H4** | Poppins | 20px | 28px (1.4) | 600 | `--font-h4` | Card titles |
| **H5** | Poppins | 18px | 24px (1.33) | 600 | `--font-h5` | Small headings |
| **H6** | Poppins | 16px | 24px (1.5) | 600 | `--font-h6` | Tiny headings |
| **Body** | Poppins | 16px | 24px (1.5) | 400 | `--font-body` | Default text |
| **Body Medium** | Poppins | 16px | 24px (1.5) | 500 | `--font-body-medium` | Emphasized text |
| **Small** | Poppins | 14px | 20px (1.43) | 400 | `--font-small` | Secondary text |
| **Caption** | Poppins | 12px | 16px (1.33) | 400 | `--font-caption` | Metadata, hints |

### Typography Tokens

```css
/* Font Families */
--font-family-display: 'Slackey', cursive;
--font-family-body: 'Poppins', sans-serif;

/* Font Sizes */
--font-size-display: 48px;
--font-size-h1: 36px;
--font-size-h2: 28px;
--font-size-h3: 24px;
--font-size-h4: 20px;
--font-size-h5: 18px;
--font-size-h6: 16px;
--font-size-body: 16px;
--font-size-small: 14px;
--font-size-caption: 12px;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

/* Font Weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
```

---

## 🔲 UI Shape & Depth

### Border Radius

Friendly, safe, child-appropriate shapes with no aggressive sharp edges.

| Style | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| **Sharp** | 4px | `--radius-sharp` | Minimal rounding, data tables |
| **Rounded** | 8px | `--radius-sm` | Standard UI elements |
| **Medium** | 12px | `--radius-md` | Cards, buttons (default) |
| **Large** | 16px | `--radius-lg` | Large cards, modals |
| **Pill** | 9999px | `--radius-pill` | Pills, badges, fully rounded |

**Philosophy**: Prefer `--radius-md` (12px) and `--radius-lg` (16px) for a friendly, approachable feel. Avoid sharp corners on interactive elements.

### Shadows

Subtle depth without heavy material shadows. Child-safe, not intimidating.

| Level | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| **None** | `none` | `--shadow-none` | Flat elements |
| **Subtle** | `0 1px 2px rgba(0,0,0,0.05)` | `--shadow-sm` | Slight elevation |
| **Standard** | `0 2px 4px rgba(0,0,0,0.08)` | `--shadow-md` | Cards, dropdowns |
| **Prominent** | `0 4px 8px rgba(0,0,0,0.12)` | `--shadow-lg` | Modals, popovers |

**Philosophy**: Keep shadows light and friendly. Avoid dark, heavy shadows that feel corporate or intimidating.

---

## 🎯 Design Principles

### Child-Appropriate Design

1. **Large Touch Targets**: Minimum 44px × 44px (iOS) / 48px × 48px (Android)
2. **High Contrast**: WCAG AAA compliance for text (7:1 ratio)
3. **Readable Fonts**: Minimum 16px body text
4. **Friendly Shapes**: Rounded corners (12px+), no sharp edges
5. **Clear Hierarchy**: Obvious visual distinction between levels
6. **Positive Colors**: Warm peach for encouragement, avoid harsh reds

### Grid & Alignment

- **8px Grid**: All spacing and sizing in multiples of 8
- **Vertical Rhythm**: Consistent line-height and spacing
- **Optical Alignment**: Adjust for visual weight, not just math
- **White Space**: Generous spacing for clarity (relaxed rhythm)

### Color Usage Guidelines

**Primary Navy Blue**:
- Primary actions (buttons, links)
- Navigation elements
- Active states

**Bold Peach**:
- Encouragement and rewards
- Completed tasks
- Positive reinforcement
- Accent highlights

**Jungle Mist**:
- Backgrounds (cards, sections)
- Dividers and borders
- Disabled states

**Semantic Colors**:
- Success (green): Completed, approved, achieved
- Info (blue): Informational, neutral notifications
- Warning (yellow): Pending, review needed, caution
- Error (red): Failed, rejected, critical alerts

**Neutrals**:
- Grey-900 to Grey-700: Headings and primary text
- Grey-600 to Grey-400: Body text and secondary text
- Grey-300 to Grey-100: Borders, backgrounds, disabled states
- Grey-50: Subtle page backgrounds

---

## 🚫 Do NOT

1. **Introduce New Colors**: Use only the defined palette
2. **Guess Brand Personality**: Follow this guide exactly
3. **Optimize for Dark Mode**: Future phase, not MVP
4. **Over-Style Components**: Keep it simple and functional
5. **Use Heavy Shadows**: Light and friendly only
6. **Use Sharp Corners**: Minimum 8px radius on interactive elements
7. **Break the 8px Grid**: All spacing must align
8. **Use Small Body Text**: Minimum 16px for readability

---

## 📝 Notes & Future Considerations

### Phase 1 (Current)
- Light mode only
- Desktop and tablet focus
- Simplified color palette

### Future Phases (Not MVP)
- Dark mode support
- Mobile-specific optimizations
- Extended color variations
- Animation tokens
- Accessibility enhancements

---

**This document is the single source of truth for all visual design decisions.**
**Do not deviate without explicit approval.**
