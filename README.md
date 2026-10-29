# ITALIA VIVA — V0.1
Static, editable browser game. Serve `dist/` over HTTP; Three.js is bundled locally (MIT).

Modules:
- `geography.js`: coordinates, provisional scene extents, geographic topology decoder and references.
- `software-renderer.js`: original Canvas2D triangle-based 3D CPU fallback if WebGL is unavailable; reduced geometry and no photographic textures, visibly labelled.
- `engine.js`: original procedural Three.js scene, avatar, collisions, NPCs, birds, camera and rendering.
- `weather.js`: Europe/Rome clock, Open-Meteo adapter, clearly labelled simulated fallback.
- `events.js`: pure timestamp scheduler; only verified and sourced Piazza Duomo events enter the production schedule. Separate 72-second local demonstration.
- `data.js`: dated editorial news snapshot, agenda and local transport interface. Economy disabled.
- `app.js`: navigation, SVG atlas, UI and integration.

`npm run check` exercises event gates/boundaries, DST, offline weather and bundled topology. No build needed.

Controls: WASD/arrows; Shift run; drag mouse to orbit; wheel camera distance; E interaction. Touch controls included.

Real news is a manually checked snapshot (2026-10-29); not a live feed. BookCity agenda has no invented start time and does not trigger piazza events. No real concerts loaded. Weather uses Open-Meteo model output and explicitly falls back to simulation on failure. News links point to the Comune press release index where announcements were verified. Geometry follows east/north landmark placement from Lombardia Beni Culturali, but is schematic, original and not a faithful reconstruction. Shop interiors are text demonstrations. Multiplayer has only a local transport seam: authoritative networking, accounts and persistence are not implemented.

Third-party assets: Three.js r170 MIT (`dist/vendor/THREE-LICENSE.txt`), Natural Earth country geometry via world-atlas v2 (public-domain map data, ISC distribution). See `dist/assets/ATTRIBUTION.md`. All building models, avatar models and procedural textures are original. Font fallback system works offline.

`transport.js` is the future networking boundary; currently session-local only. `economy.js` is a disabled placeholder with no money, payments or transactions.
CPU fallback uses perspective triangles with reduced shading and geometry; it does not have WebGL shadows or full texture rendering. This browser QA environment has WebGL disabled, so the GPU path could not be visually verified here. CPU navigation was browser-tested.
