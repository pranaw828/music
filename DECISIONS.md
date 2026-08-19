# Architectural & Design Decisions

This document details the architectural guidelines, layout constraints, user interface improvements, and functional choices implemented for the SONORA homepage project.

---

## 1. Responsive Design & Layout Integrity
- **Breakpoint Philosophy**: Prioritized mobile viewports down to a minimum of **390px** (standard mobile width). Breakpoints are structured logically at `1024px`, `768px`, and `480px`.
- **Elimination of Horizontal Overflow**: Removed the reliance on `overflow-x: hidden` to mask alignment bugs. Instead, we scaled down elements directly using media queries to fit within the viewport bounds:
  - The vinyl player (`.vinyl-wrapper`) scales down from `380px` to `280px` on mobile viewports (<480px).
  - Floating player widgets (like Chill, Daily, and Focus cards) are hidden on screens smaller than `500px` to maintain a clean aesthetic and prevent visual noise or clipping.
  - The main player widget (`.hero-card-player`) transitions from an absolute floating layout on desktop to a centered, inline, block-level element stacked underneath the vinyl player on mobile viewports.
- **Mobile Navigation Drawer**:
  - The horizontal layout of navigation links and actions on desktop is collapsed into a single menu toggle button (hamburger icon) on mobile.
  - Clicking this toggle reveals a clean, premium, full-screen glassmorphic navigation drawer using a high-density blur effect (`backdrop-filter: blur(25px)`).

---

## 2. Content Integrity & Authenticity
- **No Fake Counts**: Replaced all fake playlist follower counts (e.g. `2.6M followers`, `28.7M followers`) with authentic, context-appropriate metadata (e.g. `Playlist • 30 songs`, `Playlist • 50 songs`). This establishes trust and presents a clean, realistic interface.

---

## 3. Interactive Experience & Animations
- **Magical Canvas Visualizer**: Employs a fixed background canvas visualizer rendering floating music notes, organic butterflies, and glitter particles.
- **State Integration**: Toggling playback states in the hero player updates the vinyl spin animations, triggers glowing audio rings, sweeps the tonearm into position, and activates a dynamic visualizer canvas at high fidelity.

---

## 4. Bonus Easter Egg (Cosmic Disco Mode)
- **Activation Mechanism**: Double-clicking or clicking the SONORA logo 5 times triggers "Cosmic Disco Mode." This makes the feature interactive and hidden from standard crawler passes.
- **Visuals and Audio Alterations**:
  - A dynamic, smooth CSS color animation cycling the primary ambient glow through a rainbow gradient.
  - Accelerated particle generation on the canvas overlay, rendering colorful rainbow stars and notes.
  - Auto-plays a hidden secret synthwave track (`"Antigravity Dreams" by "The Deepminders"`) loaded dynamically into the player.
  - Displays a premium glassmorphic toast notification.
