#!/usr/bin/env python3
"""
kanen_youtube_cache_builder.py
Build a complete local cache of all video metadata from the YouTube channel.
Run this once, then all other scripts use the cache (zero YouTube API calls).

Cost: ~110 quota units (one-time cost)
Output: ~/Downloads/kanen_youtube_cache.json
"""

import json
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
import googleapiclient.discovery

SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
TOKEN_FILE = os.path.expanduser('~/Downloads/kanen_youtube_token.json')
CREDENTIALS_FILE = os.path.expanduser('~/Downloads/kanen_youtube_oauth_credentials.json')
CACHE_FILE = os.path.expanduser('~/Downloads/kanen_youtube_cache.json')
CHANNEL_ID = 'UCEu3VqYZuaIm2cKQp1X-v3A'  # @kanencoffee

def authenticate():
    """Authenticate with YouTube API using stored or new OAuth token."""
    creds = None

    # Load existing token if available
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

        # Always refresh token before use to ensure it's valid
        if creds.refresh_token:
            try:
                creds.refresh(Request())
                with open(TOKEN_FILE, 'w') as f:
                    f.write(creds.to_json())
                print("✅ Token refreshed successfully")
            except Exception as e:
                print(f"⚠️ Token refresh failed: {e}")

        return creds

    # New auth flow (local machine only, not in CI/CD)
    if os.path.exists(CREDENTIALS_FILE):
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=0, open_browser=True)
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())
        return creds

    # If no token and no credentials file, error
    raise FileNotFoundError(f"Token file not found: {TOKEN_FILE}\nCredentials file not found: {CREDENTIALS_FILE}")

def build_cache():
    """Fetch all videos from channel and save to local cache."""
    creds = authenticate()
    youtube = googleapiclient.discovery.build('youtube', 'v3', credentials=creds)

    print("📊 Building cache of all videos...")
    print("⏳ Fetching channel uploads playlist...")

    # Get uploads playlist ID (1 API call, 1 unit)
    channels_response = youtube.channels().list(
        part='contentDetails',
        id=CHANNEL_ID
    ).execute()

    if 'error' in channels_response:
        print(f"❌ API Error: {channels_response['error']}")
        raise Exception(f"YouTube API error: {channels_response['error']}")

    if 'items' not in channels_response or not channels_response['items']:
        print(f"❌ No channels found. Response: {channels_response}")
        raise Exception("No channels found in response")

    uploads_playlist_id = channels_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

    # Fetch all videos from uploads playlist (paginated)
    all_videos = {}
    next_page_token = None
    page_count = 0

    while True:
        page_count += 1
        print(f"  Page {page_count}...", end=' ', flush=True)

        # playlistItems.list (50 units per call, but batches 50 videos per call)
        request = youtube.playlistItems().list(
            playlistId=uploads_playlist_id,
            part='snippet',
            maxResults=50,
            pageToken=next_page_token
        )
        response = request.execute()

        for item in response.get('items', []):
            video_id = item['snippet']['resourceId']['videoId']
            all_videos[video_id] = {
                'video_id': video_id,
                'title': item['snippet']['title'],
                'published_at': item['snippet']['publishedAt'],
            }

        print(f"({len(all_videos)} total)", flush=True)
        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break

    # Fetch full video details (titles, descriptions, tags)
    print(f"\n📝 Fetching full video details for {len(all_videos)} videos...")

    video_ids_batch = list(all_videos.keys())
    for i in range(0, len(video_ids_batch), 50):
        batch = video_ids_batch[i:i+50]
        batch_num = i // 50 + 1
        total_batches = (len(video_ids_batch) + 49) // 50
        print(f"  Batch {batch_num}/{total_batches}...", end=' ', flush=True)

        # videos.list (1 unit per video, but batches 50 per call)
        videos_response = youtube.videos().list(
            part='snippet,status',
            id=','.join(batch)
        ).execute()

        for video in videos_response.get('items', []):
            vid_id = video['id']
            all_videos[vid_id].update({
                'title': video['snippet']['title'],
                'description': video['snippet']['description'],
                'tags': video['snippet'].get('tags', []),
                'status': video['status']['privacyStatus'],
            })

        print(f"✓", flush=True)

    # Save cache
    cache = {
        'channel_id': CHANNEL_ID,
        'total_videos': len(all_videos),
        'videos': all_videos
    }

    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)

    print(f"\n✅ Cache built! {len(all_videos)} videos saved to {CACHE_FILE}")

    # Summary
    public = sum(1 for v in all_videos.values() if v.get('status') == 'public')
    unlisted = sum(1 for v in all_videos.values() if v.get('status') == 'unlisted')
    private = sum(1 for v in all_videos.values() if v.get('status') == 'private')

    print(f"  • Public: {public}")
    print(f"  • Unlisted: {unlisted}")
    print(f"  • Private: {private}")
    print(f"\n💾 Quota used: ~{50 + (len(video_ids_batch) // 50)} units (one-time cost)")

if __name__ == '__main__':
    build_cache()
