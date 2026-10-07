# Harsh Jaswal — Developer Portfolio

An immersive, scroll-driven, buildless portfolio using HTML, CSS, native WebGL, and JavaScript. Fonts and imagery are local assets.

## Sections
Selected project contributions, technical expertise, academic history, internship, personal introduction, and project brief builder. Project previews are explicitly illustrative.

## Deploy to Vercel
Import this repository. Choose Other as the framework, leave build and install commands empty, and set Output Directory to `dist`. Keep Vercel Authentication enabled and deploy to Preview for private access. Automatic Git deployments are disabled until a public release is explicitly authorized.

## Contact
Set `contactEmail` in `dist/project-data.js` to an approved email address to enable email drafts. The existing form prepares, copies, or downloads a brief locally and does not send a message.

## Checks
Run `node --check dist/app.js` and `node --check dist/sculpture.js`. Scroll controls the morphing sculpture, pinned project scenes, skills, and academic timeline. The motion toggle and system reduced-motion preference provide a readable static layout. No dependency installation or build step is required.
