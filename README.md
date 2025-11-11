# Lost & Found Padlet (Demo)

Simple Next.js + Tailwind demo app to create lost-and-found posts with image, description, comment and claim functions.

Features added:
- Session fields: visitors can set their name and student number for the session — these are included in posts, comments and claims.
- Dark mode: class-based Tailwind dark mode with a toggle in the UI.
- Uploaded images are saved to `public/uploads` (server-side) and served statically. You can track `public/uploads` with Git LFS if you want to keep images in the repo.

How to run

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

Notes
- This demo stores data in `data/items.json` on disk. Uploaded images are saved to `public/uploads` and the item JSON stores the image path (e.g. `/uploads/abcd.png`).
- Not suitable for production. Consider using a database and a proper file storage (S3, Cloudinary) for images.

Git LFS (optional)
- If you want to keep uploaded images in the Git repository and avoid large blobs in normal Git, enable Git LFS and track `public/uploads`:

```bash
git lfs install
git lfs track "public/uploads/*"
git add .gitattributes
```

Hosting notes
- The project uses Next.js API routes, so GitHub Pages (static hosting) is not suitable. Recommended hosting options:
	- Vercel (recommended): push the repo to GitHub and import the project in Vercel — API routes work out of the box.
	- Render / Fly / Heroku: any Node host that runs `npm start` can serve the app.
	- If you must use GitHub-hosted workflows, set up a GitHub Actions workflow to build and deploy to a Node host.

	Persistence note
	- The demo saves uploaded images to `public/uploads` on the filesystem and stores metadata in `data/items.json`.
	- On many serverless hosts (like Vercel Serverless Functions), the ephemeral filesystem means uploads will not persist between deployments or function invocations. For production use, move image storage to an external object store (S3, Cloudinary) and use a database for metadata.

Local dev
1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

Open http://localhost:3000
