#!/usr/bin/env python3
"""
kanen_youtube_caption_analyzer.py
Analyze video transcripts to detect actual repair type and generate accurate titles.

Cost: 0 YouTube API quota units (uses free youtube-transcript-api library)
Input: ~/Downloads/kanen_youtube_cache.json (from cache_builder.py)
Output: ~/Downloads/kanen_youtube_caption_analysis.json (review before updating)

Process:
1. Load local cache (no API calls)
2. For each public/unlisted video, fetch transcript (free)
3. Analyze transcript to detect problem type (not title)
4. Generate new title based on actual content
5. Save results for review

Run this AFTER cache_builder.py, BEFORE updater.py
"""

import json
import os
import sys
import re
import subprocess
from collections import defaultdict

# Try to import youtube-transcript-api, install if needed
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled
except ImportError:
    print("📦 Installing youtube-transcript-api...")
    subprocess.run(['pip', 'install', 'youtube-transcript-api', '--quiet'], check=False)
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled

# Import from core module
sys.path.insert(0, os.path.expanduser('~/Documents'))
from kanen_youtube_core import (
    detect_brand, detect_problem_type_from_captions, extract_job_number,
    extract_context_from_captions, build_custom_description_from_captions,
    TITLE_HOOKS, PROBLEM_HELP_MAP, clean_title
)

CACHE_FILE = os.path.expanduser('~/Downloads/kanen_youtube_cache.json')
OUTPUT_FILE = os.path.expanduser('~/Downloads/kanen_youtube_caption_analysis.json')

def fetch_transcript(video_id):
    """Fetch transcript from YouTube video (free, no API quota)."""
    try:
        # Try to get English transcripts first
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Prefer manually created transcripts, fall back to auto-generated
        if transcript_list.manually_created_transcripts:
            transcript = transcript_list.manually_created_transcripts[0]
        else:
            transcript = transcript_list.find_transcript(['en'])

        # Combine all caption text
        full_text = ' '.join([item['text'] for item in transcript.fetch()])
        return full_text
    except (TranscriptsDisabled, Exception) as e:
        return None

def analyze_video(video_id, title, current_description):
    """Analyze video transcript and generate new title."""
    # Fetch transcript (free)
    transcript = fetch_transcript(video_id)

    if not transcript:
        # Fallback to title-based detection if no transcript
        return {
            'video_id': video_id,
            'original_title': title,
            'has_transcript': False,
            'transcript_length': 0,
            'detected_problem': 'general',
            'new_title': title,
            'changed': False
        }

    # Detect problem from transcript
    problem_type = detect_problem_type_from_captions(transcript)

    # Get brand (same as before)
    brand = detect_brand(title)
    job_number = extract_job_number(title)

    # Extract model from original title
    model_part = re.sub(r'\s*\|\s*Kanen Coffee\s*$', '', title).strip()
    if brand:
        model_part = re.sub(re.escape(brand), '', model_part, flags=re.IGNORECASE).strip()
        # Strip various suffixes to get clean model name
        for suffix_pattern in [
            r'\s+(?:Won\'t|Making|Had|Heating|SSR|Not|Leaking|Grinder|Scaled|Solenoid|Error|Flow|Pressure|No).*',
            r'\s*[-–].*$',
            r'\s*\|\s*Kanen.*$'
        ]:
            model_part = re.sub(suffix_pattern, '', model_part, flags=re.IGNORECASE).strip()
        brand_model = f"{brand} {model_part}".strip() if model_part else brand
    else:
        brand_model = model_part

    # Generate new title
    hook = TITLE_HOOKS.get(problem_type, TITLE_HOOKS['general'])
    hook_body = hook.replace('{bm} ', '').replace('{bm}', '')
    max_bm = 100 - len(hook_body) - 1
    if len(brand_model) > max_bm:
        brand_model = brand_model[:max_bm].rsplit(' ', 1)[0]

    new_title = hook.format(bm=brand_model)
    new_title = re.sub(r'\s+', ' ', new_title).strip()

    changed = new_title != title

    # Extract context from transcript for custom description
    context = extract_context_from_captions(transcript, problem_type)

    # Build custom description based on actual video content
    custom_description = build_custom_description_from_captions(
        brand=brand,
        problem_type=problem_type,
        context=context,
        job_number=job_number
    )

    return {
        'video_id': video_id,
        'original_title': title,
        'new_title': new_title,
        'changed': changed,
        'has_transcript': True,
        'transcript_length': len(transcript),
        'detected_problem': problem_type,
        'brand': brand,
        'job_number': job_number,
        'custom_description': custom_description,
        'context': context,
    }

def main():
    """Load cache and analyze all videos."""
    if not os.path.exists(CACHE_FILE):
        print(f"❌ Cache file not found: {CACHE_FILE}")
        print("   Run: python3 ~/Documents/kanen_youtube_cache_builder.py")
        return

    print(f"📂 Loading cache from {CACHE_FILE}...")
    with open(CACHE_FILE) as f:
        cache = json.load(f)

    total_videos = len(cache['videos'])
    public_unlisted = sum(
        1 for v in cache['videos'].values()
        if v.get('status') in ['public', 'unlisted']
    )

    print(f"📊 Found {total_videos} videos ({public_unlisted} public/unlisted)")
    print(f"\n🎬 Analyzing transcripts (this may take 10-15 minutes)...")

    analysis = {}
    changed_count = 0
    no_transcript_count = 0
    problem_types = defaultdict(int)

    for idx, (video_id, video_data) in enumerate(cache['videos'].items(), 1):
        status = video_data.get('status', 'unknown')

        # Skip private videos
        if status == 'private':
            continue

        title = video_data.get('title', '').strip()
        if not title or title.startswith('IMG_') or title.startswith('MOV_'):
            continue

        # Progress
        if idx % 50 == 0:
            print(f"  {idx}/{public_unlisted}... ({changed_count} changed so far)", flush=True)

        # Analyze
        result = analyze_video(video_id, title, video_data.get('description', ''))
        analysis[video_id] = result

        if result['changed']:
            changed_count += 1
        if not result['has_transcript']:
            no_transcript_count += 1
        problem_types[result['detected_problem']] += 1

    print(f"\n✅ Analysis complete!")
    print(f"\n📊 Summary:")
    print(f"  • Analyzed: {len(analysis)} videos")
    print(f"  • Titles to change: {changed_count}")
    print(f"  • No transcript available: {no_transcript_count}")
    print(f"\n🔧 Problem types detected:")
    for problem, count in sorted(problem_types.items(), key=lambda x: -x[1]):
        print(f"  • {problem:20} {count:4} videos")

    # Save analysis
    output = {
        'analysis_date': __import__('datetime').datetime.now().isoformat(),
        'total_analyzed': len(analysis),
        'total_changed': changed_count,
        'total_no_transcript': no_transcript_count,
        'problem_type_distribution': dict(problem_types),
        'videos': analysis
    }

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n💾 Results saved to: {OUTPUT_FILE}")
    print(f"\n🔍 Review samples (3 examples):")

    # Show 3 examples with full details
    changed_samples = [v for v in analysis.values() if v['changed']][:3]
    for idx, sample in enumerate(changed_samples, 1):
        print(f"\n  Example {idx}: {sample['video_id']}")
        print(f"    Problem detected: {sample['detected_problem']}")
        print(f"    Brand: {sample.get('brand', 'Unknown')}")
        if sample.get('context', {}).get('error_code'):
            print(f"    Error code: {sample['context']['error_code']}")
        if sample.get('context', {}).get('part_mentioned'):
            print(f"    Part mentioned: {sample['context']['part_mentioned']}")
        print(f"\n    TITLE:")
        print(f"      OLD: {sample['original_title'][:70]}")
        print(f"      NEW: {sample['new_title'][:70]}")
        print(f"\n    DESCRIPTION (first 150 chars):")
        desc = sample.get('custom_description', '')
        print(f"      {desc[:150]}...")

    print(f"\n✨ Ready to update? Run:")
    print(f"   python3 ~/Documents/kanen_youtube_updater.py --use-captions")

if __name__ == '__main__':
    main()
