# Leonida Legend — GTA VI Trophy Guide &amp; Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/noniairox/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/noniairox/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The complete offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden. Every trophy carries its official name, description and grade as PlayStation publishes them (via Exophase and PSNProfiles), plus an original guide in this entry's own words, with its sources cited beside it.

## What the app does

- **Tracker** — a checklist of all 55 trophies with official names, descriptions, grades, kinds, counts and missable flags. Progress is saved in the browser (localStorage) and can be exported to a file and imported back.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, and by search. There are no online trophies in GTA VI — the filter says so when you pick it.
- **Spoiler setting** — hides the names and descriptions of story trophies until you earn them.
- **Roadmap to the platinum** — six stages in order: story first, contacts and strangers, activities, collectibles and exploration, combat and heists, then money, mysteries and 100% completion. Built from the official descriptions.
- **Missable flags** — only one trophy may be missable: Positive Mental Attitude (meditate at every spot). The guide explains how to protect it, and the roadmap tells you to keep a save at the start of each chapter because there is no mission replay.

## Run it

Serve `app/` with any static server and open `app/index.html` in desktop Chrome with the network off — it loads nothing from the network. Or run the entry program: `MAKEFUN_OUTPUT_DIR=out node main.ts`, which copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the tracker (vanilla JS, no libraries, no network)
- `app/data/trophies.json` — all 55 trophies with official data plus original guides, steps, kinds, missable flags and roadmap stages
- `screenshots/` — 3 screenshots of the running app
- `vendor/makefun-frontend.ts` — the kit's dossier library, copied byte-for-byte
- `main.ts` — the entry program

## Sources

- Exophase — GTA VI trophy list (official names, descriptions, grades, counts)
- PSNProfiles — GTA VI trophies (official list, tracked counts)
- PowerPyx — GTA VI trophy guide and roadmap (difficulty 4/10, ~200 hours, chapter-save advice, cheats disable trophies; five hidden trophies still unconfirmed)
- Push Square — GTA 6 Trophy Guide &amp; Roadmap
- KeenGamer — GTA 6 Trophy Guide &amp; Platinum Roadmap
- gamemapa — All 55 GTA 6 Trophies (100% checklist details)
- sixshore — GTA 6 Trophy and Achievement List
- EGamers — GTA 6 Trophy List (28 hidden, possibly-missable flag)
- GTABase and TrueTrophies — cross-checks

The guides are original writing for this entry. Official trophy names and descriptions are quoted as published; everything else is paraphrased, never copied. Five hidden trophies' exact triggers were still unconfirmed at the time of writing, and the guide marks them as such.
