#!/usr/bin/env python3
"""
kanen_youtube_updater_v2.py - STREAMLINED version
Live YouTube API updater using local cache (zero metadata fetch calls).

Quota cost: 50 units per video update (only videos().update() calls)

Usage:
  python3 ~/Documents/kanen_youtube_updater_v2.py              # Uses cached titles
  python3 ~/Documents/kanen_youtube_updater_v2.py --use-captions  # Uses caption-based titles

Features:
  • Loads all metadata from local cache (built by cache_builder.py)
  • Optionally uses caption-analyzed titles from caption_analyzer.py
  • Only makes videos().update() API calls (50 units each)
  • Checkpoint system for nightly resume
  • Creates brand playlists
  • Preserves work order numbers
"""

import json
import os
import sys
import time
import re
from datetime import datetime
import argparse

# Import from core module
sys.path.insert(0, os.path.expanduser('~/Documents'))
from kanen_youtube_core import (
    detect_brand, detect_problem_type, detect_problem_type_from_captions,
    extract_job_number, build_description, TITLE_HOOKS, BASE_TAGS, BRAND_TAGS,
    PROBLEM_TAGS
)

import google.auth
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
import googleapiclient.discovery

SCOPES = ['https://www.googleapis.com/auth/youtube']
TOKEN_FILE = os.path.expanduser('~/Downloads/kanen_youtube_token.json')
CREDENTIALS_FILE = os.path.expanduser('~/Downloads/kanen_youtube_oauth_credentials.json')
CACHE_FILE = os.path.expanduser('~/Downloads/kanen_youtube_cache.json')
CAPTION_ANALYSIS_FILE = os.path.expanduser('~/Downloads/kanen_youtube_caption_analysis.json')
CHECKPOINT_FILE = os.path.expanduser('~/Downloads/kanen_youtube_checkpoint.json')
LOG_FILE = os.path.expanduser('~/Downloads/kanen_youtube_update_log.txt')
PLAYLISTS_FILE = os.path.expanduser('~/Downloads/kanen_youtube_playlists.json')

def log_msg(msg):
    """Print and append to log file."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {msg}"
    print(log_line)
    with open(LOG_FILE, 'a') as f:
        f.write(log_line + '\n')

def authenticate():
    """Authenticate with YouTube API."""
    creds = None

    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())
        return creds

    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=0, open_browser=True)

        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())

    return creds

def load_checkpoint():
    """Load progress from checkpoint."""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {'updated_videos': [], 'updated_playlists': {}}

def save_checkpoint(checkpoint):
    """Save progress to checkpoint."""
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(checkpoint, f, indent=2)

def update_videos(use_captions=False):
    """Update all videos from cache."""
    log_msg("🚀 Starting YouTube updater (streamlined)")

    # Load cache
    if not os.path.exists(CACHE_FILE):
        log_msg("❌ Cache file not found. Run cache_builder.py first.")
        return

    with open(CACHE_FILE) as f:
        cache = json.load(f)

    # Load caption analysis if requested
    caption_analysis = {}
    if use_captions:
        if os.path.exists(CAPTION_ANALYSIS_FILE):
            with open(CAPTION_ANALYSIS_FILE) as f:
                caption_data = json.load(f)
                caption_analysis = caption_data.get('videos', {})
            log_msg(f"📝 Loaded caption analysis for {len(caption_analysis)} videos")
        else:
            log_msg("⚠️  Caption analysis file not found. Using cached titles instead.")

    # Load checkpoint
    checkpoint = load_checkpoint()
    already_updated = set(checkpoint['updated_videos'])

    log_msg(f"📊 Cache has {len(cache['videos'])} total videos")
    log_msg(f"✅ Already updated: {len(already_updated)}")

    # Filter for videos to update (public/unlisted, not already done)
    to_update = [
        (vid_id, video_data) for vid_id, video_data in cache['videos'].items()
        if video_data.get('status') in ['public', 'unlisted']
        and vid_id not in already_updated
        and video_data.get('title') and not video_data.get('title').startswith('IMG_')
    ]

    log_msg(f"📋 Videos to process: {len(to_update)}")

    if not to_update:
        log_msg("✅ All videos already updated!")
        return

    # Authenticate
    creds = authenticate()
    youtube = googleapiclient.discovery.build('youtube', 'v3', credentials=creds)

    log_msg(f"\n🔄 Starting updates (~180 videos per night)...")

    updated_count = 0
    quota_used = 0

    for idx, (video_id, video_data) in enumerate(to_update, 1):
        original_title = video_data.get('title', '').strip()

        # Use caption-based title if available
        if use_captions and video_id in caption_analysis:
            new_title = caption_analysis[video_id].get('new_title', original_title)
        else:
            new_title = original_title

        # Skip if title hasn't changed and no caption analysis
        if new_title == original_title and not use_captions:
            continue

        brand = detect_brand(original_title)
        job_number = extract_job_number(original_title)

        # Use custom description from caption analysis if available
        if use_captions and video_id in caption_analysis:
            new_description = caption_analysis[video_id].get('custom_description', '')
            if not new_description:
                # Fallback if description wasn't generated
                new_description = build_description(original_title, brand=brand, job_number=job_number)
        else:
            # Use template-based description
            new_description = build_description(original_title, brand=brand, job_number=job_number)

        # Build tags
        problem_type = (
            caption_analysis[video_id].get('detected_problem')
            if use_captions and video_id in caption_analysis
            else detect_problem_type(original_title)
        )
        tags = [BASE_TAGS]
        if brand and brand in BRAND_TAGS:
            tags.append(BRAND_TAGS[brand])
        if problem_type in PROBLEM_TAGS:
            tags.append(PROBLEM_TAGS[problem_type])
        tags_str = ' '.join(tags)

        # Update video
        try:
            youtube.videos().update(
                part='snippet',
                body={
                    'id': video_id,
                    'snippet': {
                        'title': new_title,
                        'description': new_description,
                        'tags': tags_str.split(),
                        'categoryId': '28'  # Science & Tech
                    }
                }
            ).execute()

            quota_used += 50
            updated_count += 1

            # Save progress
            checkpoint['updated_videos'].append(video_id)
            if idx % 10 == 0:
                save_checkpoint(checkpoint)

            if idx % 20 == 0:
                log_msg(f"  {idx}... ({updated_count} updated, {quota_used} quota used)")

            time.sleep(0.1)  # Avoid rate limiting

        except Exception as e:
            log_msg(f"  ⚠️  Error updating {video_id}: {e}")

    log_msg(f"\n✅ Update complete!")
    log_msg(f"  • Videos updated: {updated_count}")
    log_msg(f"  • Quota used: {quota_used} units")
    log_msg(f"  • Total updated so far: {len(checkpoint['updated_videos'])}")

    save_checkpoint(checkpoint)

    # Summary
    total_to_update = len([v for v in cache['videos'].values() if v.get('status') in ['public', 'unlisted']])
    remaining = total_to_update - len(checkpoint['updated_videos'])
    nights_remaining = (remaining + 179) // 180

    log_msg(f"\n📅 Progress:")
    log_msg(f"  • Remaining videos: {remaining}")
    log_msg(f"  • Estimated nights: {nights_remaining}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Update YouTube videos with new titles/descriptions')
    parser.add_argument('--use-captions', action='store_true', help='Use caption-analyzed titles')
    args = parser.parse_args()

    update_videos(use_captions=args.use_captions)
