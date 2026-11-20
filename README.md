# KIM Portfolio

The professional portfolio of **Kent Ivan Manuel C. Gabito** — **AI Visual Content Creator | Creative Designer | IT Developer**.

An existing single-page portfolio maintained with HTML, Tailwind CSS (CDN), and vanilla JavaScript. Its editorial grid, Cormorant Garamond and DM Sans fonts, five accent themes, dark mode, marquees, and scroll reveal animations are preserved.

## Local preview and validation

Serve this folder with VS Code Live Server, or run `python -m http.server 8000` and open `http://localhost:8000/`. No install or build is required for the website. Tailwind, fonts, icons, and the optional typing animation use the existing external CDNs.

Run the dependency-free content and asset check with:

```sh
node tools/validate.mjs
```

It checks project data, retained screenshots and certificates, local asset paths (including filename case), JavaScript syntax, anchor targets, and required metadata. The page uses relative local asset paths so it also works at the GitHub Pages `/KIM-Portfolio/` subpath.

## Files and content

- `index.html`: Hero, About, categorized Skills, Freelance Experience, nine original Certificates, Services, Projects, Contact, and preview markup.
- `projects.js`: The centralized published gallery data. Creative work appears before software projects.
- `script.js`: Filters, HTML5 video and image previews, software screenshot carousels, focus handling, navigation, animations, and email drafts.
- `portfolio.css`: Targeted styles extending the existing design.
- `style-switcher.js` and `color-1.css` through `color-5.css`: Accent themes and dark mode, saved in browser storage when available.
- `style.css` and `style-switcher.css`: Existing legacy styles, retained without changes.
- `assets/Profile Pic/KIM.jpg`: Existing profile photo.
- `assets/Certificates/`: All nine original certificate images.
- `assets/Third Year/`: Retained software screenshots. The on-page category is **Software Development**; the existing folder names remain for compatibility.
- `assets/freelance/images/AI Generated/`: Four supplied AI image assets.
- `assets/freelance/videos/`: Seven supplied finished MP4 videos.
- `assets/freelance/videos/thumbnails/`: Lightweight JPG frames extracted from those seven MP4s.
- `.qa/`: Ignored local browser tooling, baseline copies, test results, and screenshots. These are not website dependencies.

## Published work

The gallery includes **7 AI videos**, **4 AI-generated images**, and **3 software projects**.

Videos:

1. Creating a Successful Morning Routine
2. Teaching Cleanup and Organization Skills
3. Helping a Child Transition From Playtime to Homework
4. Helping a Child Who Struggles to Ask for Help
5. Learning Through Play at Home
6. Teaching a Child to Express “I Want” Instead of Crying
7. Teaching a Child to Wait for Their Turn

Images: AI Editorial Imagery, AI Lifestyle Imagery, AI Video Production (a supplied still image), and Interior Visualization.

Software: **NeighborHelp** (42 screenshots), **RentiFi** (16 screenshots), and **VitalDrop** (53 screenshots). All original screenshot sequences remain intact. Their previous cards contained no descriptions, technology lists, repository URLs, or demo URLs; none have been invented.

The Cafe, DNSC-IDEAS, Group, Machine Problem, Nike, Poster, Rose, Second, Traveler, and WasteWise cards were removed from the gallery. Their asset folders and unrelated files were left untouched.

No finished files were found for Friends Through Play, Learning to Start Conversations, Building Confidence in Group Activities, or Practicing Social Skills Through Role-Playing, so those proposed projects are excluded.

## Adding approved freelance media

Only list finished assets you have permission to show publicly. Add the actual image or video inside the existing freelance asset folders, then add an object to `projectsData` in `projects.js`. The gallery is curated from this list; dropping a file into a folder alone does not publish it.

For an image, supply a unique `id`, the actual `title`, `category: 'image'`, a relative `src`, a factual `description`, descriptive `alt` text, and the actual `tools` used. For a video, use `category: 'video'` and also provide a real frame `thumbnail`, `width`, and `height`. Keep MP4 video in a browser-supported codec such as H.264 with AAC audio. Vertical video is displayed without cropping. The player has native controls, starts only on request, and releases the file when its dialog closes. Initial cards load thumbnails only, avoiding downloads of large MP4s.

Copy an existing entry as the schema; change every value to verified details and run the validator. To add software details later, the renderer supports optional `description`, `technologies`, `repository`, and `demo` fields. Use verified HTTPS URLs only.

## Contact behavior

The original email, phone, GitHub profile, and specific Upwork profile remain. Generic LinkedIn/Facebook URLs and the placeholder website were removed. A personal LinkedIn URL can be added when supplied.

The contact form opens a draft in the visitor's email application with a subject, sender details, and message. It does not submit to a server or claim delivery. A direct email link is also available. Form validation and labels work with the keyboard.

Email: kentivanmanuelgabito@gmail.com

GitHub: https://github.com/LeunaM1917

Upwork: https://www.upwork.com/freelancers/~0193d67271c7d2101a?mp_source=share

## GitHub Pages

Keep the current repository and Pages settings. This update is local only and does not commit, push, or deploy. When you later publish, include the existing asset relocation into `assets/` together with the source edits and new video thumbnails. The pre-existing `images/` deletions and untracked `assets/` files are the local asset move, which this update references directly. Original media files have not been moved or deleted by this work.

## Verification performed

- The dependency-free validator passed all 157 local asset references, syntax checks, navigation targets, and content checks.
- 80 Edge browser checks passed, including all four filters, actual playback of every MP4, every image/certificate preview, retained screenshot navigation, focus trapping/restoration, theme persistence, form validation, and layouts at 320, 375, 390, 768, 1024, and 1440 pixels.
- The 111 software screenshots and nine certificate images matched the original Git blobs byte for byte.
- Axe scans found no WCAG A/AA violations in the tested page, image dialog, mobile layout, or any of the ten accent/light-dark theme combinations. Automated scans supplement the manual screenshot review; they do not establish full accessibility conformance.
- The gallery and static professional title also worked with the typing CDN blocked and browser storage denied.
- The contact form's draft behavior was tested without sending an email. No commit, push, or deployment was performed.
