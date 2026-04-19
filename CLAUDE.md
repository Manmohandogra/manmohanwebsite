# Project Rules for Claude

## Workflow

### ALWAYS preview before touching main
- All website changes go to the `preview` branch first
- Generate a demo link using: `https://htmlpreview.github.io/?https://github.com/manmohandogra/manmohanwebsite/blob/preview/index.html`
- Share the demo link with the user and wait for approval
- Only push to `main` after explicit user approval
- Never make live site changes without a preview step

## Branch Strategy
- `main` = live/production website (GitHub Pages)
- `preview` = staging demo (htmlpreview.github.io link)

## Contact Data
- Email and WhatsApp must NEVER appear as plain text in HTML
- Always use JavaScript obfuscation for private contact details
- Instagram and Facebook links are safe to render as plain HTML

## Photos
- All photos currently in repo root, referenced from root paths
- Categories: portrait, performance, other (see data/photos.json)

## Data Files
- `data/artist.json` — structured artist data
- `data/contact.json` — socials and private contact info
- `data/photos.json` — photo manifest
- `content/about.md` — full biography
