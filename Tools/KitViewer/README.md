# Kit Viewer

Double-click `Kit Viewer.cmd` to browse the kits in a Microsoft Edge (or Chrome) app window. It needs Node.js and Edge or Chrome; nothing else is installed.

Each kit gets these tabs:

- **Reference**, **Guide**, **Outline**: the three production files at the kit root.
- **Assets**: a gallery of the kit root's `assets/` folder. Click an image to enlarge it; use the arrow keys to step through and Esc to close.
- **Simplified …**: if the kit has a `simplified/` folder, each file in it gets its own tab, and each subfolder (except `info/`) gets a gallery tab.

**Extract images** (on each Guide tab and assets gallery, root or simplified) runs `Tools/guide-image-extractor.cjs` on that guide and shows its report. It runs locally in Node; no AI agent is involved. Existing identical files are left alone, and the extractor stops without writing if an existing file would change.

The window and taskbar icon is `icon.svg`.

Other controls: **Refresh** rescans the project, **Show in Explorer** selects the current file, and outline and image tabs have White, Transparent and Dark backgrounds. Click an image to switch between fit and actual size. Ctrl+Tab changes tabs; Alt+Up/Down changes kits.

`server.cjs` serves the project read-only on 127.0.0.1 with a random port and exits when the window closes. `node Tools/KitViewer/server.cjs --serve --no-browser` prints the URL instead of opening a window. The app window uses its own browser profile under `%LOCALAPPDATA%\KitViewer`.

A compiled .exe version was quarantined by Datto AV, so the launcher is a script.
