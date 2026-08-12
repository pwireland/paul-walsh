# Paul Walsh — personal site redesign

A zero-build static site designed for direct deployment to Vercel.

## Customize the content

Open `site-data.js`. This is the only file you need to edit for:

- article titles, summaries and links
- artwork titles and image paths
- AI album title, description, listening link and track names
- LinkedIn, email and GitHub links

For artwork, replace/add files in `assets/` and keep the filenames in `site-data.js` in sync. The site shows abstract fallback artwork until your real files are present.

## Deploy to Vercel

### Simplest
1. Put these files in a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: `Other`.
4. Build command: leave blank.
5. Output directory: leave blank / project root.
6. Deploy.

### Vercel CLI
From this folder:

```bash
vercel
```

No npm install or build step is required.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.


## Reused image

`assets/pink-run.webp` is the Pink Run photograph reused from the original site and is displayed in the new Running section.


## Career record

The site includes Paul Walsh's four-year Senior Research Fellow period at the University of Edinburgh (2013–2017), a Running section using the Pink Run image from the original site, and a collapsible Awards & Certifications record. Award and certification entries can be edited in `site-data.js`.
