# Kanen Coffee YouTube Automation

Automated YouTube API integration for updating video metadata, building local cache, analyzing captions, and driving traffic to help.kanencoffee.com.

## Overview

Three GitHub Actions workflows handle all YouTube automation:

1. **YouTube Cache Builder** — One-time setup to fetch all channel metadata (~110 API units)
2. **YouTube Caption Analyzer** — Free analysis of video transcripts to detect repair types and extract context
3. **YouTube Nightly Updater** — Runs at 12:05 AM PT every night, updates ~180 videos on free quota

## Setup Instructions

### Step 1: Create GitHub Secret (OAuth Token)

The workflows need a GitHub secret containing your OAuth token:

1. **Complete OAuth locally** (one-time):
   ```bash
   python3 kanen_youtube_oauth_setup_simple.py
   ```
   This will:
   - Open your browser to Google's OAuth page
   - Ask you to sign in as `samuel@kanencoffee.com`
   - Ask you to select "Kanen Coffee, LLC." channel
   - Grant access to the YouTube API
   - Save token to `~/Downloads/kanen_youtube_token.json`

2. **Copy the token file contents**:
   ```bash
   cat ~/Downloads/kanen_youtube_token.json
   ```

3. **Add to GitHub secrets**:
   - Go to: https://github.com/kanencoffee/espresso-troubleshooter/settings/secrets/actions
   - Click: "New repository secret"
   - Name: `YOUTUBE_OAUTH_TOKEN`
   - Value: Paste the entire contents of your token file (JSON)
   - Click: "Add secret"

### Step 2: Trigger Cache Builder

The cache builder runs once to fetch metadata for all 5,496 videos:

1. Go to: https://github.com/kanencoffee/espresso-troubleshooter/actions
2. Find: "YouTube Cache Builder (One-Time Setup)"
3. Click: "Run workflow"
4. Wait for completion (~3-5 minutes)
5. Check: Artifacts tab for `youtube-cache.json`

**Cost**: ~110 YouTube API quota units (one-time)

### Step 3: Run Caption Analyzer

The caption analyzer processes all videos to extract repair type and context:

1. Go to: https://github.com/kanencoffee/espresso-troubleshooter/actions
2. Find: "YouTube Caption Analyzer"
3. Click: "Run workflow"
4. Wait for completion (~10-15 minutes)

**Cost**: 0 YouTube API units (uses free youtube-transcript-api)

### Step 4: Enable Nightly Updates

The nightly updater runs automatically at 12:05 AM PT:

- Updates ~180 videos per night on free quota
- Reads cache and caption analysis (both free locally)
- Calls YouTube API only for title/description updates (50 units per video)
- At ~180 updates/night, all 5,345 videos complete in ~28 nights

**Manual trigger**:
1. Go to: https://github.com/kanencoffee/espresso-troubleshooter/actions
2. Find: "YouTube Nightly Updater"
3. Click: "Run workflow"

## Files Structure

```
scripts/youtube-automation/
├── kanen_youtube_core.py          # Core logic (shared by all scripts)
├── kanen_youtube_cache_builder.py # Builds local cache
├── kanen_youtube_caption_analyzer.py  # Analyzes captions
├── kanen_youtube_updater_v2.py    # Updates videos with cache + analysis
├── kanen_youtube_cache.json       # Cached metadata (created by cache builder)
├── kanen_youtube_caption_analysis.json  # Caption analysis (created by analyzer)
└── kanen_youtube_checkpoint.json  # Resume checkpoint for updater
```

## How It Works

### Cache Builder (`cache_builder.yml`)

Fetches all video metadata once:
- Title, description, tags, status for all videos
- Paginated `videos().list()` calls (50 units)
- Paginated `playlistItems().list()` for full list (1 unit per page)
- **Total cost**: ~110 units
- **Saved to**: `scripts/youtube-automation/kanen_youtube_cache.json`

### Caption Analyzer (`caption_analyzer.yml`)

Analyzes video transcripts to find:
- **Problem type**: pump, steam, leak, heating, error, descale, etc.
- **Specific parts**: pump, solenoid, gasket, seal, heating_element, etc.
- **Actions taken**: "after pump replacement", "after cleaning", etc.
- **Error codes**: Pressure values, error numbers from video
- **Custom help links**: Points to help.kanencoffee.com/#issue-id
- **Cost**: 0 YouTube API units (free `youtube-transcript-api` library)

### Nightly Updater (`youtube_nightly_updater.yml`)

Updates videos with enhanced titles and descriptions:
- Runs daily at 12:05 AM PT
- Uses cached metadata (no API cost)
- Uses caption analysis (no API cost)
- Calls `videos().update()` only for actual changes (~50 units each)
- Processes ~180 videos/night on free 10,000-unit quota
- Saves checkpoint to resume if quota is hit

**Checkpoint system**:
- Saves progress after every 10 successful updates
- Automatically skips already-updated videos on next run
- Safe to run multiple times — won't duplicate changes

## Monitoring

Watch logs in GitHub Actions:
1. Go to: https://github.com/kanencoffee/espresso-troubleshooter/actions
2. Click on any workflow run
3. See real-time progress and any errors

Artifacts available for 30-90 days:
- `youtube-cache`: Full metadata cache
- `youtube-caption-analysis`: Analysis results
- `youtube-update-logs`: Nightly update logs

## Troubleshooting

### "Cache file not found"
→ Run the Cache Builder workflow first

### "Analysis missing"
→ Run the Caption Analyzer workflow after Cache Builder completes

### "OAuth token invalid"
→ Follow "Step 1: Create GitHub Secret" above to refresh the token

### YouTube API Quota Exceeded
→ The updater will stop automatically when quota is hit
→ It resumes the next day and continues where it left off
→ Request quota increase: https://support.google.com/youtube/contact/yt_api_form

## Quota Management

Free tier: **10,000 units/day**

**Daily budget**:
- Cache builder: ~110 units (one-time)
- Caption analyzer: 0 units (reusable)
- Nightly updater: ~9,000 units (180 × 50 units per update)
- **Safe**: Leaves 1,000 units buffer for manual YouTube API calls

At 28 nights, all 5,345 videos will be updated.

## Manual Local Testing

All scripts work locally too:

```bash
# Build cache locally
python3 scripts/youtube-automation/kanen_youtube_cache_builder.py

# Analyze captions
python3 scripts/youtube-automation/kanen_youtube_caption_analyzer.py

# Update videos
python3 scripts/youtube-automation/kanen_youtube_updater_v2.py --use-captions
```

All scripts expect the OAuth token at `~/Downloads/kanen_youtube_token.json`.

## Future Improvements

- [ ] Quota increase request (Google usually approves 1M+ units for legitimate channels)
- [ ] Batch multi-language descriptions per IETF language tags
- [ ] Custom playlist creation per brand + problem type
- [ ] Email notifications on workflow completion
- [ ] Slack integration for status updates
