# Changelog

## [0.24.1](https://github.com/datisthq/livemark/compare/v0.24.0...v0.24.1) (2026-10-06)


### Bug Fixes

* **changelog:** escape MDX angles as an entity so placeholders after a URL render ([224b11e](https://github.com/datisthq/livemark/commit/224b11e9ec25e46643cbde612363444ab26caf10))
* **ci:** look up the release PR instead of reading the action output ([de8eae5](https://github.com/datisthq/livemark/commit/de8eae5036a5709f57f23a04d7ecad37f8dacc91))

## [0.24.0](https://github.com/datisthq/livemark/compare/v0.23.0...v0.24.0) (2026-08-29)

### Features

- **landing:** replace stack section with Datist attribution ([80678a2](https://github.com/datisthq/livemark/commit/80678a2f293dac36cc166545bc088a6bff2c9d6b))

## [0.23.0](https://github.com/datisthq/livemark/compare/v0.22.0...v0.23.0) (2026-05-26)

### Features

- send page URL to ChatGPT/Claude via ?q= prompt instead of clipboard ([edd882e](https://github.com/datisthq/livemark/commit/edd882e04b12b0663f53d4afc0efc581d382058e))

## [0.22.0](https://github.com/datisthq/livemark/compare/v0.21.0...v0.22.0) (2026-05-16)

### Features

- emit per-blog-section RSS 2.0 feeds at /<prefix>/rss.xml ([912a66c](https://github.com/datisthq/livemark/commit/912a66cff2f69671facdbe7b9b865a081c8b9116)), closes [#6](https://github.com/datisthq/livemark/issues/6)

## [0.21.0](https://github.com/datisthq/livemark/compare/v0.20.0...v0.21.0) (2026-05-16)

### Features

- emit default robots.txt with sitemap link ([6f52c54](https://github.com/datisthq/livemark/commit/6f52c5482d827722d69e0c2ebedcff731434be8f)), closes [#29](https://github.com/datisthq/livemark/issues/29)

## [0.20.0](https://github.com/datisthq/livemark/compare/v0.19.0...v0.20.0) (2026-05-11)

### Features

- section-scoped siteLink override for the SiteTitle target ([e1f6015](https://github.com/datisthq/livemark/commit/e1f6015999a0f1e1c2b9351e7773233bfa442631))

## [0.19.0](https://github.com/datisthq/livemark/compare/v0.18.0...v0.19.0) (2026-05-11)

### Features

- section-scoped siteTitle and siteDescription overrides ([bda4d83](https://github.com/datisthq/livemark/commit/bda4d8336abd1d99ea06178a5849d0cd805f2117))

### Bug Fixes

- highlight the home article in the sidebar when its path is "/" ([01eae30](https://github.com/datisthq/livemark/commit/01eae3067103d741c1f7ba6840f3a94d6bf8a808))

## [0.18.0](https://github.com/datisthq/livemark/compare/v0.17.0...v0.18.0) (2026-05-09)

### Features

- drop default icons for sections and articles ([1de4a11](https://github.com/datisthq/livemark/commit/1de4a11b4a0a0d98fc5363299a37a6aae949dcf7))
- shift chrome breakpoint to lg, banner to xl ([7ae9f6d](https://github.com/datisthq/livemark/commit/7ae9f6d8f566eb65ddc379f668c9044699a8040a))

## [0.17.0](https://github.com/datisthq/livemark/compare/v0.16.0...v0.17.0) (2026-05-09)

### Features

- allow `base` as a function `(command) => string` ([ba2c663](https://github.com/datisthq/livemark/commit/ba2c663481587b53b9b49f165da8e9ee32a62571))
- rename ExternalSection to CustomSection, support active state ([79fe808](https://github.com/datisthq/livemark/commit/79fe8089d4001e105cacf7f88c5a9423784adba9))

## [0.16.0](https://github.com/datisthq/livemark/compare/v0.15.0...v0.16.0) (2026-05-09)

### Features

- add `external` section type for arbitrary-URL navigation ([b8d1a32](https://github.com/datisthq/livemark/commit/b8d1a322a1f4d34f47c812ff4d0966beeed9d509))
- remove article.group, render a single hardcoded "Articles" label ([fa81902](https://github.com/datisthq/livemark/commit/fa8190231684c573a5e33b5389e93dd792bf5597))

## [0.15.0](https://github.com/datisthq/livemark/compare/v0.14.0...v0.15.0) (2026-05-09)

### Features

- support config.base for sub-path deployments ([8170cb3](https://github.com/datisthq/livemark/commit/8170cb3522ec82dcc43346bc067659fb479efb5b))

### Bug Fixes

- normalize path separators in resolveAssetPath output ([6d9c7bf](https://github.com/datisthq/livemark/commit/6d9c7bfd2cd95cde374d42c6b4fcf70dc4975548))

## [0.14.0](https://github.com/datisthq/livemark/compare/v0.13.1...v0.14.0) (2026-05-09)

### Features

- render nested article children at any depth in the sidebar ([704acb3](https://github.com/datisthq/livemark/commit/704acb3825d9511820f01909f09592c97bf2b6db))

## [0.13.1](https://github.com/datisthq/livemark/compare/v0.13.0...v0.13.1) (2026-05-08)

### Bug Fixes

- don't ship default banner ([80f627c](https://github.com/datisthq/livemark/commit/80f627c6059c6a93ec0da6e1d8ed222f38151e58))
- stop forcing _blank and external icon on config.links ([8c005f0](https://github.com/datisthq/livemark/commit/8c005f0521284f109cc15043c980963aaf71b780))

## [0.13.0](https://github.com/datisthq/livemark/compare/v0.12.1...v0.13.0) (2026-04-28)

### Features

- emit both rel="icon" and rel="shortcut icon" for legacy scrapers ([c3e8f4d](https://github.com/datisthq/livemark/commit/c3e8f4d0996cd45b1f67342d1dee8783ce90b2b7))

## [0.12.1](https://github.com/datisthq/livemark/compare/v0.12.0...v0.12.1) (2026-04-28)

### Bug Fixes

- mark binary asset extensions in .gitattributes ([3679003](https://github.com/datisthq/livemark/commit/3679003cdb6dfb369558d8fb021ac4aa7a67c561))

## [0.12.0](https://github.com/datisthq/livemark/compare/v0.11.7...v0.12.0) (2026-04-27)

### Features

- B hotkey scrolls back to top ([1ee1d95](https://github.com/datisthq/livemark/commit/1ee1d95e1acc2bf818470a266612ab0e4ce83ffe))

### Bug Fixes

- load markdown.css globally to prevent FOUC on landing→docs nav ([435d0b0](https://github.com/datisthq/livemark/commit/435d0b0b7dafb14a8d5b9ec7d22ee09c4ba30627))
- S hotkey is a no-op on desktop when page has no sidebar ([4e0f5ed](https://github.com/datisthq/livemark/commit/4e0f5ed7c82764c50e758bb804389d8421d68f30))

## [0.11.7](https://github.com/datisthq/livemark/compare/v0.11.6...v0.11.7) (2026-04-27)

### Bug Fixes

- footer links to livemark.dev instead of github repo ([5b77ae3](https://github.com/datisthq/livemark/commit/5b77ae31a4e1e23e9c07b6428a0bc2a20db22461))

## [0.11.6](https://github.com/datisthq/livemark/compare/v0.11.5...v0.11.6) (2026-04-27)

### Bug Fixes

- also full-reload client env after watcher emit so browser reloads ([e31fb0f](https://github.com/datisthq/livemark/commit/e31fb0f85ed601aa834e18af14acf01d44636f74))

## [0.11.5](https://github.com/datisthq/livemark/compare/v0.11.4...v0.11.5) (2026-04-27)

### Bug Fixes

- forward overlay/source changes to Vite watcher manually ([4c6a90d](https://github.com/datisthq/livemark/commit/4c6a90d1c629735c50d270274ebe491b6cd3ff90))

## [0.11.4](https://github.com/datisthq/livemark/compare/v0.11.3...v0.11.4) (2026-04-27)

### Bug Fixes

- HMR for .livemark/ edits — own chokidar instance, not server.watcher ([55b9397](https://github.com/datisthq/livemark/commit/55b9397eea0033e07a244208058ce3dfe59702e6))

## [0.11.3](https://github.com/datisthq/livemark/compare/v0.11.2...v0.11.3) (2026-04-26)

### Bug Fixes

- HMR for .livemark/ edits — pass dirs to watcher, not globs ([3200daf](https://github.com/datisthq/livemark/commit/3200daf88e57e540591140ea5853a8dac6ae5d3f))

## [0.11.2](https://github.com/datisthq/livemark/compare/v0.11.1...v0.11.2) (2026-04-26)

### Bug Fixes

- inline ssr deps into server.js for build (self-contained prerender) ([d6fa15d](https://github.com/datisthq/livemark/commit/d6fa15d3252a4928b24c581d81337ac22681e816))

## [0.11.1](https://github.com/datisthq/livemark/compare/v0.11.0...v0.11.1) (2026-04-26)

### Bug Fixes

- changelog cache uses one shared dir with selective md wipe ([0b6dbc2](https://github.com/datisthq/livemark/commit/0b6dbc2d11d2a2a7e30310641cf9764f035bc485))
- per-section etag meta file in changelog cache ([d8933a1](https://github.com/datisthq/livemark/commit/d8933a17dc786ed59013050e87e912ffaf86eb01))

## [0.11.0](https://github.com/datisthq/livemark/compare/v0.10.5...v0.11.0) (2026-04-26)

### Features

- livemark.config.ts setupVite escape hatch for arbitrary Vite config ([88c4620](https://github.com/datisthq/livemark/commit/88c462092e1ec90b66d56a8c1779e51b30d3992a))
- mount Vite at per-consumer targets/<hash>/, drop runtime resolveId tricks ([c20363b](https://github.com/datisthq/livemark/commit/c20363bdc3006d2281dc1c94485288a07be28996))
- virtual livemark:virtual module exposes typed config to override files ([7e6475e](https://github.com/datisthq/livemark/commit/7e6475ef59afe8fc88138368596abad2d033a44d))

### Bug Fixes

- fixed building workflow ([5491814](https://github.com/datisthq/livemark/commit/5491814c10ff265218b8f7fa0def5c8c894d1662))
- include .livemark/ in tsconfig (dot-dirs are skipped by *_/_ globs) ([6465d27](https://github.com/datisthq/livemark/commit/6465d2763c7bc63063d312cf15e6c4d141b7b1fe))
- remove tsconfig.json from npm ([a1e411e](https://github.com/datisthq/livemark/commit/a1e411ecd4a68d4d477f1519bbacb63ed1e2fa50))

## [0.10.5](https://github.com/datisthq/livemark/compare/v0.10.4...v0.10.5) (2026-04-25)

### Bug Fixes

- move react / react-dom to peerDeps, seed .npmrc on first run for pnpm consumers ([a9b3c05](https://github.com/datisthq/livemark/commit/a9b3c056deaf838c7737afaba6582614180893d5))

## [0.10.4](https://github.com/datisthq/livemark/compare/v0.10.3...v0.10.4) (2026-04-25)

### Bug Fixes

- pair ssr.external with resolve.dedupe for react / react-dom ([2995015](https://github.com/datisthq/livemark/commit/2995015d6c07f089c9cf980abc539b090b6c07f4))

## [0.10.3](https://github.com/datisthq/livemark/compare/v0.10.2...v0.10.3) (2026-04-25)

### Bug Fixes

- dedupe react and react-dom across SSR + client bundles ([f3e984c](https://github.com/datisthq/livemark/commit/f3e984cebb2c84a1cdd68488a18f6c28317d173c))

## [0.10.2](https://github.com/datisthq/livemark/compare/v0.10.1...v0.10.2) (2026-04-25)

### Bug Fixes

- anchor unresolvable bare imports at livemark for full encapsulation ([8e6f685](https://github.com/datisthq/livemark/commit/8e6f685c37a14f4586c2f85f8de75f54da10324d))

## [0.10.1](https://github.com/datisthq/livemark/compare/v0.10.0...v0.10.1) (2026-04-25)

### Bug Fixes

- auto-exclude node_modules and build dirs when no .gitignore ([a087dac](https://github.com/datisthq/livemark/commit/a087dac8e70a26ce61aeb7aebef610cd010a179d))
- pin @tanstack/react-start resolution to livemark's own copy ([4de0a43](https://github.com/datisthq/livemark/commit/4de0a439cd5876c6b590b7227b6a25e449f9b73b))

## [0.10.0](https://github.com/datisthq/livemark/compare/v0.9.1...v0.10.0) (2026-04-25)

### Features

- default include to "**/*.md", make every config field optional ([0c7ba77](https://github.com/datisthq/livemark/commit/0c7ba776fbeee07ce1de8072c2d7d7ceaa02998f))

### Bug Fixes

- pass through unhandled directive nodes as plain text ([a3d13b3](https://github.com/datisthq/livemark/commit/a3d13b3907c6dbb5a0de9f418b61c4ed2fb2f23c))
- resolve any lucide icon name; drop README emoji bullets ([63957da](https://github.com/datisthq/livemark/commit/63957da3a5cca61b8e1a349ca7bb25a0dba3fbb6))

## [0.9.1](https://github.com/datisthq/livemark/compare/v0.9.0...v0.9.1) (2026-04-25)

### Bug Fixes

- compute physical() path relative to routesDir, not sourceDir ([c05841e](https://github.com/datisthq/livemark/commit/c05841e94d961f21571e97adb56ecd36ed7a4d7a))

## [0.9.0](https://github.com/datisthq/livemark/compare/v0.8.0...v0.9.0) (2026-04-25)

### Features

- drive article h1 from frontmatter title; rename to /introduction/ ([45adddf](https://github.com/datisthq/livemark/commit/45adddf1bdce9a204d1f98d6931d2998e5170e96))

### Bug Fixes

- drop trailing period from landing hero title ([b77165b](https://github.com/datisthq/livemark/commit/b77165b0bf22eaa86eef61ad4f95d17d1af24324))
- resolve consumer routes path and exclude routeTree.gen from npm ([2811642](https://github.com/datisthq/livemark/commit/2811642497e550e71d587d850d367bd09a15479b))

## [0.8.0](https://github.com/datisthq/livemark/compare/v0.7.2...v0.8.0) (2026-04-25)

### Features

- flat source/ tree, compile to target/ ([9181154](https://github.com/datisthq/livemark/commit/918115467a8f5e8053d4e2da9ec32e720946eaf4))
- generalize per-article GitHub link via sourceUrl + sourceAction ([505fa46](https://github.com/datisthq/livemark/commit/505fa46d2b64da95594bbab4f99ba7569701d4b3))

### Bug Fixes

- cleaner GitHub-sourced changelog entries (sort, single h1, recents=5) ([b26365b](https://github.com/datisthq/livemark/commit/b26365b4958cf6ad8e4833530c5524d2a61880d5))
- escape stray < in changelog body so MDX doesn't parse them as JSX ([346a1f3](https://github.com/datisthq/livemark/commit/346a1f3e575540c791a50c7f24e8a860b5686749))
- mkdir cache parent before writing changelog meta ([5f0a55a](https://github.com/datisthq/livemark/commit/5f0a55a8632e583ee3fc50c61d59dc3294547d07))
- point CI smoke at target/entrypoints/main.js ([5c3b945](https://github.com/datisthq/livemark/commit/5c3b945f03b1d51b63b93cae5d24a71f2f826a64))
- route sidebar toggle via live matchMedia, not stale React state ([41380d2](https://github.com/datisthq/livemark/commit/41380d29b7714f172467def18fb91628d1f4d5d4))

## [0.7.2](https://github.com/datisthq/livemark/compare/v0.7.1...v0.7.2) (2026-04-25)

### Bug Fixes

- extract OVERRIDE_SUBDIRS to settings, add livemark -v and CI smoke ([54019f9](https://github.com/datisthq/livemark/commit/54019f9c131398f2a790967232a0d3b83f093057))

## [0.7.1](https://github.com/datisthq/livemark/compare/v0.7.0...v0.7.1) (2026-04-25)

### Bug Fixes

- point livemark bin at compiled JS for node_modules consumers ([f8436b1](https://github.com/datisthq/livemark/commit/f8436b1fe1fe15004ce5ac5624ece397b1283e29))
- ship skills directory in npm package ([9608e12](https://github.com/datisthq/livemark/commit/9608e12d3b40cff33b62a8e467191e50f525cf06))

## [0.7.0](https://github.com/datisthq/livemark/compare/v0.6.0...v0.7.0) (2026-04-24)

### Features

- add 'escape' CLI command to list and fork overridable files ([d57e815](https://github.com/datisthq/livemark/commit/d57e815b6cbdd604a7555b808da1b6ca6a94eebb))
- add BackToTop floating button in Layout ([6e7b6e2](https://github.com/datisthq/livemark/commit/6e7b6e2527ecd10d198c152382165371a1bf9836))
- auto-close mobile sidebar sheet on internal navigation ([9cd5bf9](https://github.com/datisthq/livemark/commit/9cd5bf904eed55960dfc369922600cbaf76882b0))
- autoreload on livemark.config.ts and .livemark/ changes ([7f57f45](https://github.com/datisthq/livemark/commit/7f57f457617c587a1c23380b1e689a323a04713c))
- collapse section tabs into the sidebar on mobile ([b8e2d8e](https://github.com/datisthq/livemark/commit/b8e2d8e20cd91f59e5b5222326ec0e52ef1c55c4))
- config.patches for per-file frontmatter overrides ([ed0fef6](https://github.com/datisthq/livemark/commit/ed0fef66a921d870e889d1a7ecb62ad6066a3fd3))
- default TanStack devtools trigger to bottom-left ([c3b645a](https://github.com/datisthq/livemark/commit/c3b645afabb98b1bcf08baa5c7cd47eaf2cddf8c))
- mobile burger menu on every page via MiniSidebar ([7acdad5](https://github.com/datisthq/livemark/commit/7acdad572dcf0f6fab6dafb562cd26b176cc8c71))
- mobile TOC bar + consistent padding on blog/changelog/tag indexes ([82f135b](https://github.com/datisthq/livemark/commit/82f135be19efe24c0e406fe9e246da8e6810abbc))
- mobile TOC bar with scroll-progress ring ([88b12b0](https://github.com/datisthq/livemark/commit/88b12b01850f39ee86e0258f98ae1e9441e58721))
- mobile TOC panel as overlay dropdown with animation ([93abe1a](https://github.com/datisthq/livemark/commit/93abe1aa0872cbdcbceff8e36e86bf0600cf753a))
- modern animated landing page at / ([81beb7f](https://github.com/datisthq/livemark/commit/81beb7f0f2aa2e36e7f4cef47c050c29303bd24b))
- override livemark modules via .livemark/<subdir>/ ([7234504](https://github.com/datisthq/livemark/commit/72345043875ed6cab5ffe86b7a62fbe355deea2c))
- render header-positioned links in sidebar on mobile ([fb5ef62](https://github.com/datisthq/livemark/commit/fb5ef62def1a7469922ca70bcb28787ca31b9836))
- reserve scrollbar gutter globally to prevent layout shift ([e1e9d1c](https://github.com/datisthq/livemark/commit/e1e9d1c4a5552f79539875907b8d9f9d35535ad9))
- virtual routes in .livemark/routes/ via virtualRouteConfig ([6219924](https://github.com/datisthq/livemark/commit/62199246dc3bcb4ddc85f31a3215fb19ebe8949d))

### Bug Fixes

- align mobile header/content paddings with TOC bar gutter ([de41a4e](https://github.com/datisthq/livemark/commit/de41a4ea78417336ac0fb568f20665677007e672))
- bigger h1 top gap and scroll offset on mobile to clear TOC bar ([523d779](https://github.com/datisthq/livemark/commit/523d779f79fa427c20f474fbadf53dea8aafc549))
- bump header version suffix opacity for AA contrast ([05a317c](https://github.com/datisthq/livemark/commit/05a317c55d31c3769e30c9419373a9fa96619be4))
- close mobile sidebar on any link click, not just pathname change ([cfc1ee8](https://github.com/datisthq/livemark/commit/cfc1ee87b5d8ba0699a1208135f3bc7791af4d8f))
- dark-mode primary and tweak bg/gradient opacities ([9d5ae0d](https://github.com/datisthq/livemark/commit/9d5ae0dee6e37b5b18977b14211d9bde355c01a3))
- don't highlight a header section on custom routes ([7d68dbb](https://github.com/datisthq/livemark/commit/7d68dbbf3afd00c0b7b6d3a0c2c922c1f8966e61))
- don't highlight a sidebar section on custom routes ([5bcd59a](https://github.com/datisthq/livemark/commit/5bcd59ab6c5136f756de18a787f2588c15f7e019))
- fixed readme and wrangler.json ([3c5d180](https://github.com/datisthq/livemark/commit/3c5d180d142a08a600bfcd8a7cb43aaf69e36de2))
- hide sidebar Sections/Links groups on desktop when no sidebar items ([36b1d50](https://github.com/datisthq/livemark/commit/36b1d5077ed5ec8c87aec698781da7ae3db10551))
- pin SiteTitle to text-sm in all contexts ([6233ca1](https://github.com/datisthq/livemark/commit/6233ca1f8fcef61e38c1c63255740f77c3713e0c))
- remap shiki catppuccin-latte green for AA contrast ([34688e4](https://github.com/datisthq/livemark/commit/34688e4dc80c2b3ffa054675bdf5dd81fc3531b7))
- remove Theme button aria-label mismatching visible text ([ec7ac4d](https://github.com/datisthq/livemark/commit/ec7ac4dbef6fc81c6fd385fa1d3bfb1a164a35d7))
- resolve remaining a11y issues outside shiki code theme ([edb1625](https://github.com/datisthq/livemark/commit/edb16253611586085f02b5fb0d2a18b9379d92e1))
- separator and top padding above Actions in mobile TOC panel ([6023fdb](https://github.com/datisthq/livemark/commit/6023fdb77229c5ca8a0e03145dcaea85883e7725))

## [0.6.0](https://github.com/datisthq/livemark/compare/v0.5.0...v0.6.0) (2026-04-18)

### Features

- add changelog section type with local file and GitHub release sources ([12fb5e3](https://github.com/datisthq/livemark/commit/12fb5e368bed9e21a188bf84a55028fa09f91904))
- add tag pages for blog sections ([028013c](https://github.com/datisthq/livemark/commit/028013c841a76a136a7fa72046459b85d38584bd))
- added logo ([ce87fa3](https://github.com/datisthq/livemark/commit/ce87fa310a77b2fdd5fe90716568cb50fda076ce))
- custom favicon support with user public directory ([30bc944](https://github.com/datisthq/livemark/commit/30bc94456eafb71dfe109cc0e71aa36510bf668e))
- global Sections nav across all sidebars with default icons ([d8e6b09](https://github.com/datisthq/livemark/commit/d8e6b09c2b5003c5d2a20710d8bbaf160f161588))
- make blog and changelog indexes use the article page layout ([3affbe4](https://github.com/datisthq/livemark/commit/3affbe4030be40e49c85f73d941da7de654bf699))
- show "Updated <date>" meta on blog and changelog indexes ([2cfe8ce](https://github.com/datisthq/livemark/commit/2cfe8cea40acfaf9e1a61f165e8403683f623391))
- split changelog into per-version articles with sidebar and index ([a0bad1a](https://github.com/datisthq/livemark/commit/a0bad1a0928febdee0d088df0a94c556478b503c))
- support blog section type with BlogSidebar, BlogIndex, and tags ([af300a5](https://github.com/datisthq/livemark/commit/af300a53931547bfacc5e479ef6859d3d7c068c0))
- support config.logo for custom sidebar logo ([79c4bf5](https://github.com/datisthq/livemark/commit/79c4bf5e7749d86d9ba4a4672191175dc719bbbe))
- support config.sections for configurable header navigation ([df63704](https://github.com/datisthq/livemark/commit/df63704009a1c95f7336c8aaf71e58ee0831b2a8))
- support prefix filtering for header and sidebar links ([38bdc14](https://github.com/datisthq/livemark/commit/38bdc14c827478d8b6a4dc46eec4155e253708c0))
- support section.type "sidebar" for sidebar-placed sections ([360e590](https://github.com/datisthq/livemark/commit/360e590d13eb844a0245c25354a248a5faf26f7e))
- support section.version for changelog header label ([c821a12](https://github.com/datisthq/livemark/commit/c821a12ac1660a170cd460bcc34c4c328c29dfb7))

### Bug Fixes

- lighten blog/changelog index h1 weight to match article h1 ([df6d413](https://github.com/datisthq/livemark/commit/df6d41302c395de6ee9f39a968d3200bfd0fcfd3))
- unify active-tab underline across icon and text in header ([d8a9e98](https://github.com/datisthq/livemark/commit/d8a9e98cce079dc4857854a668c92f49d4c8b34e))
- unwrap paragraphs containing images with line breaks ([1fbd4d1](https://github.com/datisthq/livemark/commit/1fbd4d11ce80e0126f3a4ddbe45c920a99f89ecb))

### Performance Improvements

- lazy-load lucide icons registry and mermaid to reduce main bundle by 32% ([05eb526](https://github.com/datisthq/livemark/commit/05eb52669f2b2cb1aa9898881694ad42e0f9d9f2))

## [0.5.0](https://github.com/datisthq/livemark/compare/v0.4.0...v0.5.0) (2026-04-13)

### Features

- add article.image, article.author, article.date frontmatter ([f2b24d9](https://github.com/datisthq/livemark/commit/f2b24d9425a9a5904d8d2693738c7387f194f99f))
- config-driven header and sidebar links ([2210ad0](https://github.com/datisthq/livemark/commit/2210ad0e3c2f297c038c8343dca4e6ed87333fce))
- support article.sidebar to control sidebar visibility ([331994b](https://github.com/datisthq/livemark/commit/331994b7a9dc5156edcbbe7dcac4fa5e820cd814))
- support article.toc to have an ability to hide toc ([f5f9cb6](https://github.com/datisthq/livemark/commit/f5f9cb6b46b04742ba2ff338af04d232318f9dee))
- support config.code.theme for syntax highlighting colors ([14112d3](https://github.com/datisthq/livemark/commit/14112d31735bfec7cd0c178813115510cbd1d287))

### Bug Fixes

- fixed footer ([14cc21e](https://github.com/datisthq/livemark/commit/14cc21e0aea5558155011b5b531e011818711a34))
- move Footer from Article to Layout ([a2469c5](https://github.com/datisthq/livemark/commit/a2469c5352ecd9449946bc6462799e3ac50587db))

## [0.4.0](https://github.com/datisthq/livemark/compare/v0.3.0...v0.4.0) (2026-04-10)

### Features

- add tooltips to code block copy and wrap buttons ([2eae4a0](https://github.com/datisthq/livemark/commit/2eae4a09fc76b7a864471fb955bae18cd76cfa1d))
- added footer ([dc3dfe6](https://github.com/datisthq/livemark/commit/dc3dfe677750b2006edb602aa0b3c4ccb09e0d52))
- added sitemap ([9a185bc](https://github.com/datisthq/livemark/commit/9a185bcacdafdcd6528b14c885db166abe8b62c6))
- data-driven sidebar section labels via article.group ([11ea2a5](https://github.com/datisthq/livemark/commit/11ea2a5121bf50223ab1e08e0d8ee53f5915a5d6))
- introduce Customization section with Configuration child ([382d697](https://github.com/datisthq/livemark/commit/382d6975ad2e69bc021ccb247d665fc567fa2af7))
- move article schema to models and support negative order ([0a95a79](https://github.com/datisthq/livemark/commit/0a95a79f8c77ad936ae80f0bff2e19d5112fc131))
- support article.label as a sidebar display override ([248a5ee](https://github.com/datisthq/livemark/commit/248a5eeeca516e64930bd24a9717766c4cda89a7))

### Bug Fixes

- generate sitemap and prerendered pages on build ([b77f440](https://github.com/datisthq/livemark/commit/b77f44014701aeee3698724c00c1e1b9b9b983e8))
- hide banner on mobile ([c69d519](https://github.com/datisthq/livemark/commit/c69d519274ca7cb50233349f0f7a04eace66459f))
- unwrap image-only paragraphs to avoid p>div hydration error ([e32f523](https://github.com/datisthq/livemark/commit/e32f52385fdc77abfc83b2d2eadcaa496020fa0b))

## [0.3.0](https://github.com/datisthq/livemark/compare/v0.2.0...v0.3.0) (2026-04-05)

### Features

- add ANSI rendering, buttons, and inline TOC ([2174f6b](https://github.com/datisthq/livemark/commit/2174f6be22c15e01afc454eaf41369fdc56bee2f))
- add article tree navigation and split markdown docs ([b0e8716](https://github.com/datisthq/livemark/commit/b0e8716a531de007478dc17fe11ef3242e563a98))
- add banner support ([16f0c61](https://github.com/datisthq/livemark/commit/16f0c61758b500edc1e07c354072200fea1a2527))
- add collapsible code blocks and code tabs sync docs ([9df8e92](https://github.com/datisthq/livemark/commit/9df8e92c985900b4d62d091be4dcb8d253324c54))
- add content tabs and TypeScript Twoslash support ([adf106f](https://github.com/datisthq/livemark/commit/adf106f3010e8f589f6910ea47de57c3755e6d49))
- add full-text search with Orama and command palette ([92afc1f](https://github.com/datisthq/livemark/commit/92afc1f65b4ce6ded32190d34a345bf5bab8e8d1))
- add j/k smooth scroll and search dialog improvements ([c0d52ef](https://github.com/datisthq/livemark/commit/c0d52efcf4a68a0ddb4f8e56b3cb55dbe7f984ca))
- add keyboard shortcuts with @tanstack/react-hotkeys ([8c07a9a](https://github.com/datisthq/livemark/commit/8c07a9a474fef376a804fdf6f6cf7ddbb2d85038))
- add prev/next navigation, page toolbar, and last updated date ([7259f6a](https://github.com/datisthq/livemark/commit/7259f6a6c4f1778cf4ee710ba83014d73dcff0ec))
- add sortable table columns with shadcn styling ([d1bafbc](https://github.com/datisthq/livemark/commit/d1bafbc854c83c71be56dbe8b2b0bd6b65358c9d))
- add synced tabs, emoji shortcodes, and inline code highlighting ([527b515](https://github.com/datisthq/livemark/commit/527b515f6fe9fef3624e7895f4682ef9ba3f7490))
- add technical preview banner in header ([2759d7b](https://github.com/datisthq/livemark/commit/2759d7b91720471e43ac489c5396addd6d15405f))
- add themed images with [#light](https://github.com/datisthq/livemark/issues/light)/[#dark](https://github.com/datisthq/livemark/issues/dark) hash suffixes ([00f8cfb](https://github.com/datisthq/livemark/commit/00f8cfb63a526fff2554a68f288079f70be4b62b))
- add word wrap, definition lists, columns, and abbreviations ([a76fc70](https://github.com/datisthq/livemark/commit/a76fc70a713bf699b8c6987421ee4f6c3735b658))
- derive article pathname from slugified filename ([523029f](https://github.com/datisthq/livemark/commit/523029fc336931778c237da5bee8a1c22e2b585b))
- extract SiteTitle component with config-driven title/description ([bd2ef15](https://github.com/datisthq/livemark/commit/bd2ef15c3f1ba457e9e68bdb3f43446f35a8f494))
- improve search UX with icons, snippets, groups, and keyboard nav ([5c8582b](https://github.com/datisthq/livemark/commit/5c8582bf758da5be1a56f1682d118f8e08d3cf59))
- support code file includes and error/warning markers ([48e53d5](https://github.com/datisthq/livemark/commit/48e53d5cc3567beaaac7b1f360fc23805756ce32))
- support maxLevel in inline toc ([850ea9c](https://github.com/datisthq/livemark/commit/850ea9c73e578b14c7cf2ccb8cbd671996eae560))

### Bug Fixes

- skip includes inside code fences and auto-add filename title ([304d4bb](https://github.com/datisthq/livemark/commit/304d4bba1739019695688b5d13c5eb407d2d15c1))
