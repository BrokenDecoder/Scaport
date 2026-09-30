# Portfolio Workspace Rules

## 1. Typography Stack
Always use these designated Google Fonts:
- **Primary / Display / Headings**: `Bricolage Grotesque` (`font-display`, `font-sans`)
- **Code & Technical Data**: `Google Sans Code` (`font-mono`)
- **Handwritten / Casual Accents**: `Gochi Hand` (`font-handwriting`)
- **Retro / Pixel Highlights**: `Press Start 2P` (`font-pixel`)

## 2. Strict Anti-Pattern & Cliché Prohibitions
- **NO Symbol Headlines**: Never prepend decorative symbols or emojis (such as `✦`, `⚡`, `✨`, or icons) before headings. Headlines must be clean, direct typography.
- **NO Glowing Orbs or Blurred Blobs**: Absolutely no radial blurred gradient background blobs/orbs (`blur-[120px]` color circles).
- **NO AI Web Template Clichés**:
  - No generic neon glow cards or fake badge pills.
  - No speculative or unrequested sections.
  - No dead code or placeholder assets.
## 3. Navbar Scroll Morphing Architecture (Forward & Reverse)
- **Top / Hero State (`scrollY <= 20px`)**:
  - Full-width / max-w-7xl, transparent background (`bg-transparent`), zero border (`border-transparent`), zero shadow, flush at the top.
- **Scrolled State (`scrollY > 20px`)**:
  - Morphs forward into a floating dock pill:
  - Floating inset (`top-3` / `top-4`, `max-w-5xl`), large rounded container (`rounded-2xl`), frosted dark surface (`bg-[#0d0d12]/90 backdrop-blur-md`), crisp border (`border border-zinc-800`), and elevation shadow (`shadow-2xl shadow-black/50`).
- **Reactive Forward & Reverse Motion**:
  - Scrolling down triggers the forward morph into the floating pill.
  - Scrolling back up to the top triggers the reverse animation back to the flat top bar.
  - Normalized smoothly by Lenis with GPU-accelerated spring/bezier transition.

