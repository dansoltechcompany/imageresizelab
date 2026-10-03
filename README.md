# ImageResizeLab

Free image resizer, JPG/PNG compressor, WebP converter, cropper, and related photo tools. Separate product from WordHuntLab.

Read [PRODUCT.md](./PRODUCT.md) for scope. Buy `imageresizelab.com` when you can (confirm on a registrar first).

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the homepage is the image resizer.

Images stay in the browser. Nothing is uploaded to an ImageResizeLab server.

## Indexing

The public address is `https://imageresizelab.com/`. `public/_worker.js` is copied into the Pages build and permanently sends `www.imageresizelab.com` to that address, the same way paychecklink.com does. Slashless pages forward to the trailing-slash address already listed in the sitemap. Old `/icon` and `/opengraph-image` addresses forward to real image files.
