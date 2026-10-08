# Portfolio

The site bundles Carlito Regular and Bold, a Calibri-compatible font from [Google Fonts](https://github.com/googlefonts/carlito). Font files and their SIL Open Font License are in `assets/fonts`.

Open `index.html` directly to preview the site, or serve this folder over HTTP:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://localhost:8765.

## Updating projects

Edit `projects.json`. Projects appear in the order of its `projects` array; no HTML changes are needed to add, remove, or reorder them.

After editing the JSON, regenerate the data used when opening `index.html` directly:

```sh
node sync-projects.cjs
```

This updates `projects-data.js`; do not edit that generated file by hand. HTTP previews and hosted sites read `projects.json` directly and do not require regeneration.

Each project contains:

- `id`: a unique identifier.
- `title` and `summary`: the card and dialog text.
- `tech`: an array of technology or platform labels.
- `contributions`: an array of details for the dialog's “What I built” section.
- `outcome`: a factual description for “What it enables”; use measured results only when supported.
- `cover`: an image object with `type`, `src`, and `alt`.
- `media`: an ordered array of image or video objects for the dialog gallery.

Each media object can include a `caption`, shown beneath the current screenshot or video. Captions fall back to `alt` when omitted.

Use paths relative to the site, such as `assets/sq1.png`. Images, including animated GIFs, use `"type": "image"`. Videos use `"type": "video"` and can include a `poster` image path. Video playback depends on the browser's support for the file's format and codec.

Project descriptions and confirmed technology labels were transcribed or paraphrased from the supplied portfolio recording. `assets/hksp-poster.jpg` and `assets/ts-poster.jpg` were extracted from the existing demo videos for the cards.
