# Kanen Coffee — Project Memory

## Key Accounts & Credentials

| Resource | Details |
|----------|---------|
| YouTube channel | @kanencoffee — **Kanen Coffee, LLC. Brand Account** |
| Channel owner login | samuel@kanencoffee.com (personal Google acct that owns the Brand Account) |
| OAuth credentials | `~/Downloads/kanen_youtube_oauth_credentials.json` |
| Saved OAuth token | `~/Downloads/kanen_youtube_token.json` |
| Google Cloud project | `kanen-coffee-youtube-api` |
| OAuth client ID | `372005232601-d735s3c2c08isisrf7s7rka3jpeg33kl.apps.googleusercontent.com` |
| Auth scope (updater) | `youtube` + `youtube.force-ssl` |
| Auth scope (dryrun) | `youtube.readonly` |
| Test users approved | `samuel@kanencoffee.com`, `service@kanencoffee.com` |

**OAuth login notes:** During the OAuth flow, Chrome will offer multiple Google accounts. Always select `samuel@kanencoffee.com`, then on the channel picker choose **"Kanen Coffee, LLC."** — this is the Brand Account with ~5,500 videos.

---

## YouTube Bulk Update Scripts

All three files live in `~/Documents/`:

| File | Purpose |
|------|---------|
| `kanen_youtube_core.py` | **Single source of truth** — all title/description/tag logic. Edit this to update both scripts. |
| `kanen_youtube_dryrun.py` | Read-only preview — shows proposed title, description & tag changes. Saves JSON to `~/Downloads/kanen_youtube_dryrun_results.json`. |
| `kanen_youtube_updater.py` | Live update — writes to YouTube API. Updates titles, descriptions, creates brand playlists. |

### Workflow

```bash
# 1. Preview first (read-only)
python3 ~/Documents/kanen_youtube_dryrun.py

# 2. Review results
open ~/Downloads/kanen_youtube_dryrun_results.json

# 3. Go live (run each night until complete — auto-resumes via checkpoint)
python3 ~/Documents/kanen_youtube_updater.py > ~/Downloads/kanen_youtube_update_log.txt 2>&1 &
tail -f ~/Downloads/kanen_youtube_update_log.txt
```

### YouTube API Quota

- Free quota: **10,000 units/day**
- `videos().update()` costs **50 units** → ~180 video updates/day
- `channels().list()` + `playlistItems().list()` (fetching all videos) costs ~1,100 units
- **Resets at midnight Pacific Time**
- At ~180 updates/day, all 5,345 videos take ~30 days on free quota

**To get more done per day — request a quota increase:**
1. Go to [Google Cloud Console](https://console.cloud.google.com) → `kanen-coffee-youtube-api`
2. APIs & Services → YouTube Data API v3 → Quotas
3. Request increase to 1,000,000 units/day (approved for legitimate channel owners)

#### Quota increase request (submitted 2026-03-15)

| Field | Value |
|-------|-------|
| GCP project | `kanen-coffee-youtube-api` (owned by `service@kanencoffee.com`) |
| Requested | 1,000,000 units/day (up from 10,000 free tier) |
| Form used | https://support.google.com/youtube/contact/yt_api_form |
| PDF attached | `~/Documents/kanen_coffee_youtube_api_design.pdf` |
| Justification | 5,345 videos × 50 units = 267,250 units minimum; 1M requested for 90-day runway |
| Status | ⏳ Submitted — awaiting Google review (typically 3–7 business days) |

> **Note:** The GCP project is owned by `service@kanencoffee.com`, not `samuel@kanencoffee.com`. You must be logged into the `service@` account in Google Cloud Console to see the project and check approval status.

### Nightly cron job

A cron job is installed to auto-run the updater at **midnight Pacific time** every night:

```bash
# View the job
crontab -l

# Remove the job (if needed)
crontab -e   # then delete the line

# Watch live progress
tail -f ~/Downloads/kanen_youtube_update_log.txt
```

The job uses the checkpoint file to resume where it left off — it will process ~180 videos/night on the free 10,000-unit quota (more once the quota increase is approved).

### Checkpoint / Resume

The updater saves progress to `~/Downloads/kanen_youtube_checkpoint.json` after every successful video update. If it hits the quota limit, it stops cleanly and prints how many were done. Just run it again the next day — it skips already-updated videos automatically.

To start completely fresh (re-update everything):
```bash
rm ~/Downloads/kanen_youtube_checkpoint.json
```

### What the scripts do

- **Titles** → Hybrid clickable format: `{Brand Model} {Problem Hook} — Diagnosed & Fixed | Kanen Coffee`
  - Example: `DeLonghi Magnifica S Not Frothing Milk — Diagnosed & Fixed | Kanen Coffee`
  - Example: `Rancilio Silvia Won't Build Pressure? Here's What We Found | Kanen Coffee`
- **Descriptions** → Personalized opener + specific `help.kanencoffee.com/#issue-id` deep link + service CTA + 10 rich hashtags + work order number at bottom
- **Tags** → `BASE_TAGS` + brand hashtags + problem-specific hashtags (all in `kanen_youtube_core.py`)
- **Playlists** → One playlist per brand (e.g. "DeLonghi Espresso Machine Service | Kanen Coffee")
- **Job/work order numbers** → Stripped from title, preserved in description as `🔢 Work order: #XXXX`

### Adding / editing anything

**To add a new brand:**
1. Add to `BRANDS` list in `kanen_youtube_core.py`
2. Add to `BRAND_TAGS` dict

**To add a new problem type:**
1. Add detection regex in `detect_problem_type()`
2. Add entry in `PROBLEM_HELP_MAP` with the `help.kanencoffee.com` issue ID
3. Add title hook in `TITLE_HOOKS`
4. Add description intro in `DESCRIPTION_INTROS`
5. Add hashtags in `PROBLEM_TAGS`

---

## help.kanencoffee.com (Deep Linking)

- **Repo:** `kanencoffee/espresso-troubleshooter` on GitHub
- **Deployed:** Vercel auto-deploys on push to `main`
- **Local clone:** `/tmp/espresso-troubleshooter/`

### How deep links work

Each issue card has `id={issue.id}` in the DOM. URLs like `https://help.kanencoffee.com/#pump-low-pressure` will:
1. Load the page
2. Read `window.location.hash` on mount
3. Auto-expand the matching issue card
4. Smooth-scroll to it
5. Update the URL hash as user navigates

The 29 issue IDs (used in `PROBLEM_HELP_MAP`):
```
pump-low-pressure        pump-noise               boiler-temp
electronics-heating-element  electronics-pressurestat  electronics-ssr
steam-none               seals-internal-leak      group-portafilter-leak
grinder-motor            boiler-scale             solenoid-failure
electronics-pcb          water-flowmeter          boiler-opv
group-no-flow
```

### Search tracking

`Header.jsx` fires a debounced `gtag('event', 'search', { search_term })` 1 second after the user stops typing (min 3 chars). View in GA4 → Reports → Engagement → Events → search.

### Copy link button

Each expanded issue card shows a "🔗 Copy link" button that copies the full deep-link URL to clipboard.

---

## Channel Statistics (as of March 2026)

- Total videos: ~5,496
- Public/unlisted (will be updated): ~5,345
- Private (skipped): ~137 (includes untagged camera roll videos like `IMG_xxxx`)
- Brand breakdown: DeLonghi (851), Breville (559), Jura (474), La Pavoni (473), Gaggia (351), Rancilio (282), Saeco (204), Rocket (190), and 20+ others
- Unknown brand: 984 videos (no brand keyword detected in title)

---

## Known Issues / Edge Cases

- Videos with titles like `IMG_1234`, `MOV_0056`, or month names are skipped (no useful title)
- `Unknown` brand playlist won't be created (no brand to name it after)
- If a video title has a 4–5 digit number with no surrounding context it will be treated as a job number — check the dryrun output for false positives
- "Rancilio test # 7813" format (just brand + test + number) correctly becomes a 'test' type video

---

## Git / Deploy

```bash
# React app changes
cd /tmp/espresso-troubleshooter
git add client/src/...
git commit -m "message"
git push origin main  # Vercel auto-deploys
```

Last deployed commit: `9863939` — search bar moved to sticky header with nav links
