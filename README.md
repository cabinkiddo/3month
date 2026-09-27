# The 3-Month Rule

## Test in VS Code

Open this folder in VS Code, open its terminal and run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173).
Do not open `index.html` directly with `file://`; the WebGL app needs a local server.

## Build for hosting

```bash
npm run build
npm run preview
```

Upload the contents of `dist/` to a static hosting provider. `dist/index.html` is the entry point, but keep its `assets/` folder with it. This package includes a prebuilt `dist/` too; rebuild it after editing source.

## Edit the X link

The X link in `components/sections/TopHundred.tsx` points to https://x.com/TheDataEdge_. Change `X_PROFILE_URL` there if your handle changes.

The 100 fund names and three-month returns came from the supplied screenshot. The sparklines and long-view simulation are illustrative, with no live data connection.

## Ambient sound

Use the bottom-right **Sound off/on** button to start or mute the quiet synthesized background audio. Browsers require a click before a page can play sound.
