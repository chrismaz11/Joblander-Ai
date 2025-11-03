# Branding integration

You attached a `Joblander-logo` folder with vector assets and font/branding files. To integrate branding across the site, follow these steps:

1. Copy the logo and fonts into the repo public folder

  - Place logo files (SVG/PNG) here:

    `frontend/public/assets/branding/logo.svg`
    `frontend/public/assets/branding/logo.png`

  - Place font files here:

    `frontend/public/assets/branding/fonts/<font-file>.woff2`

2. Add `frontend/src/styles/branding.css` (created as placeholder) which declares `@font-face` and CSS variables. Use variables for color, brand-accent, and fonts.

3. Update your global layout to import the branding stylesheet (e.g., in your root CSS or main layout component):

```css
@import '/assets/branding/branding.css';
:root {
  --brand-font: 'JobLander Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  --brand-accent: #ffcc00; /* adjust to brand color */
}
body { font-family: var(--brand-font); }
```

4. Use the logo in header/footer via `/assets/branding/logo.svg`.

If you want, I can:
- Copy files from the attached folder into `frontend/public/assets/branding` (I can do that if you confirm you want them tracked in the repo).
- Generate `@font-face` rules if you upload the actual `.woff2`/.ttf files into the attachment or place them in the path above.
