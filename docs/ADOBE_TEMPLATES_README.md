# Adobe Templates (JobLander)

This folder contains editable CSS templates used by JobLander to render resume previews and printed PDFs.

Placement:
- CSS files: `adobe-templates/*.css`
- Preview images (thumbnails and full previews): `frontend/public/assets/images/templates/<template-slug>/thumbnail.png` and `preview.png`

Naming conventions:
- File names should be descriptive and kebab-case, e.g. `white-yellow-minimal-cv.css`.
- Each CSS file defines a root class such as `.resume-cv--white-yellow` or `.resume-beige-marketing` — use that class on the resume container element so the styles apply correctly.

Where to put preview images for the review section:
1. Create directories in `frontend/public/assets/images/templates/` for each template slug. Example:
```
frontend/public/assets/images/templates/white-yellow-minimal/
  thumbnail.png    # small square/rect preview used in lists
  preview.png      # larger preview used in the template preview modal

frontend/public/assets/images/templates/beige-marketing-resume/
  thumbnail.png
  preview.png
```

2. Use consistent sizes for thumbnails (recommended 320x420) and previews (recommended 1200x1600 for high-res). PNG or WebP preferred.

3. When rendering the review list, point the preview URL to `/assets/images/templates/<slug>/thumbnail.png` (served from `public/`).

Auto-generating matching cover letters and thank-you notes:
- Yes — we can auto-generate matching cover letter and thank-you letter HTML that use the same visual CSS. Approach:
  1. Use the selected resume template's CSS and inline it into the generated HTML (so it prints consistently).
  2. Generate letter body text with the AI service (existing AI endpoints / `careerAI`), passing the resume content, target role, company, tone, and template metadata.
  3. Wrap the AI-generated text inside a semantic HTML letter using the same root class (e.g., `.resume-cv--white-yellow`) and return HTML to the client.

Files added here are initial CSS files and placeholders for the templates you provided. For any placeholders, paste the CSS you want and keep the `:root` section for easy edits.
