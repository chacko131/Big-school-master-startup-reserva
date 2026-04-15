```markdown
# Design System Strategy: The Architectural Concierge

## 1. Overview & Creative North Star
This design system is built upon the "Architectural Concierge" North Star. It marries the brutalist efficiency and high-contrast precision of Uber’s visual language with the soulful, grounded warmth of high-end Latin hospitality. 

We are moving away from "SaaS-as-a-service" templates. Instead, we are building a digital environment that feels like a physical boutique hotel: quiet, intentional, and impeccably organized. We break the traditional grid through **intentional asymmetry**—using expansive whitespace to force the eye toward high-density data regions—and **tonal layering**, where depth is communicated through shade rather than structure.

---

## 2. Colors & Surface Philosophy
The palette is dominated by a monochrome foundation, punctuated by "Latin Accents" that denote hierarchy and status without overwhelming the premium aesthetic.

### The Palette
*   **Primary (The Foundation):** `#000000` (Solid Black). Used for primary CTAs and heavy-weight typography to anchor the layout.
*   **Secondary (The Forest):** `#436653` (Deep Forest Green). Used for growth-related status and organic highlights.
*   **Tertiary (The Earth):** Terracotta tones (using the `tertiary` and `on_tertiary_container` tokens). Used for "Human" elements, alerts, or high-touch interactive points.
*   **Surface:** `#f9f9f9` (Surface). A warm-white base that prevents the "clinical" feel of pure `#FFFFFF`.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define major sections. Structural boundaries must be created through background shifts. 
*   Use `surface_container_low` for the main canvas.
*   Use `surface_container_lowest` (Pure White) for cards and interactive containers.
The contrast between these two tokens is sufficient to define a boundary without the visual "noise" of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine-paper sheets. 
*   **Level 0 (Background):** `surface`
*   **Level 1 (Sections):** `surface_container_low`
*   **Level 2 (Active Cards):** `surface_container_lowest`
*   **Level 3 (Floating Elements):** Glassmorphism (Surface color at 80% opacity with a 16px backdrop-blur).

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance high-fashion editorial looks with functional utility.

*   **Display & Headlines (Manrope):** Use these for the "Brand Voice." The geometric nature of Manrope at `display-lg` (3.5rem) should feel like a magazine header. Don't be afraid to let a headline dominate 40% of a hero section.
*   **Body & Labels (Inter):** The "Workhorse." Inter provides the utilitarian clarity required for complex SaaS operations. 
*   **Hierarchy Note:** Maintain high contrast. If a `headline-md` is used, the supporting `body-md` should be at least two steps down in visual weight to ensure the layout "breathes."

---

## 4. Elevation & Depth
In this system, depth is a whisper, not a shout.

*   **The Layering Principle:** Avoid shadows for static components. Instead, place a `surface_container_highest` element inside a `surface_container` to indicate a "pressed" or "nested" area (e.g., a search bar inside a header).
*   **Ambient Shadows:** For floating modals or dropdowns, use the "Ambient" approach. 
    *   *Value:* `0px 20px 40px rgba(26, 28, 28, 0.06)`. 
    *   The shadow must be tinted with the `on_surface` color, making it feel like a natural light occlusion rather than a gray smudge.
*   **The Ghost Border Fallback:** If accessibility requires a border, use `outline_variant` at 15% opacity. This creates a "Ghost Border" that disappears into the background upon casual glance but provides a guide for the eye when focused.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (Black) with `on_primary` (White) text. Use `md` (0.75rem) rounding. No gradients.
*   **Secondary:** `surface_container_highest` background with `on_surface` text.
*   **Tertiary/Ghost:** Transparent background with `primary` text. Upon hover, transition to a subtle `surface_variant` background.

### Data Tables (The "Hospitality Ledger")
*   **Rule:** Forbid vertical and horizontal divider lines.
*   **Implementation:** Use `surface_container_low` for the header row. Use `body-sm` for data. Highlight rows on hover using `surface_container_high`. Separate sections using 32px of vertical whitespace.

### Status Badges
*   **Success:** `secondary_container` background with `on_secondary_container` text.
*   **Warning/Error:** `tertiary_container` (Terracotta) background with `on_tertiary_container` text.
*   **Style:** Pill-shaped (`full` roundedness), `label-sm` typography, and 12px horizontal padding.

### Input Fields
*   **State:** Default state is a `surface_container_highest` fill with no border.
*   **Focus:** Transition to a 1px `primary` (Black) border. 
*   **Label:** Use `label-md` placed 8px above the input field, never inside.

### Elegant Calendar Views
*   Instead of a boxed grid, use a clean `surface` background. Dates are arranged in a `title-sm` scale. 
*   "Selected" dates use a `primary` (Black) circle. 
*   "Available" dates use a subtle `secondary` (Forest Green) dot underneath the numeral.

---

## 6. Do's and Don'ts

### Do
*   **Embrace the Void:** Use more whitespace than you think you need. A premium experience feels unhurried.
*   **Asymmetric Balance:** Place a large `display-lg` headline on the left and a dense `body-sm` data point on the far right.
*   **Color Discipline:** Only use the Terracotta or Green accents for functional communication (Success, Error, Notification). Everything else stays Monochrome.

### Don't
*   **Don't use 100% Black for body text:** Use `on_surface` (a very dark grey) to reduce eye strain on high-contrast white backgrounds.
*   **Don't use "Standard" Shadows:** Never use the default shadow settings in design tools. Always blur higher and reduce opacity lower.
*   **Don't Box Everything:** Avoid the "Dashboard of Boxes" look. Let the content define the space, not the container.

---

## 7. Signature Texture: The Glass Overlay
For high-priority notifications or mobile navigation, use a **Glassmorphism** effect. 
*   **Background:** `surface_container_lowest` at 70% opacity.
*   **Effect:** 20px Backdrop Blur.
*   **Edge:** A 1px "Ghost Border" using `outline_variant` at 20% opacity.
This ensures the SaaS feels modern, layered, and high-end, moving it away from flat, static layouts.```