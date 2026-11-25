# Header assets and configuration

Themes: `red`, `blue`, `white` (alias: `basic`), `gray` (green animated symbol).
The configuration is inside `src/components/layout/Header/Header.tsx`.

```tsx
export const HEADER_PAGE_OPTIONS: Record<string, HeaderOptions> = {
  "/foundry": { variant: "red" },
  "/green-pump": { variant: "gray" },
};
```

Page-to-theme assignments follow HEADER_PAGE_OPTIONS in Header.tsx. Unlisted pages use white/basic. Nested paths inherit their closest configured
parent. `showImPumpTechnology: true/false` independently shows or hides the
partner logo, for any theme. It defaults to true. Normal pages already use the
shared Header from the root layout; do not add a second Header in page content.

## Actual files

- `sempa-white.png`: complete static white logo; also red reduced-motion fallback.
- `sempa-blue.png`: complete static blue logo.
- `sempa-gray.png`: complete static gray/green logo; reduced-motion fallback.
- `sempa-white-text.png`: white SEMPA wordmark, without symbol.
- `sempa-black-text.png`: dark SEMPA wordmark, without symbol.
- `sempa-red.mp4`: red foundry symbol, paired with the white wordmark.
- `sempa-green.webp`: transparent green symbol, paired with the dark wordmark.
- `im-pump-technology.png`: shared partner logo, independent of the theme.
- `flag-tr.png`, `flag-en.png`, `flag-es.png`, `flag-ru.png`: shared flags.

The wordmark and animated symbol occupy one reserved 172x44 desktop brand box;
the square symbol extends decoratively without changing header height. Animation
is removed when offscreen, when the tab is hidden or when reduced motion is
requested. Static complete logos provide the corresponding fallback.

Upload replacement files under the same names to retain the wiring. No
`sempa-red.png` or generic `sempa.png` is required with this split setup.
