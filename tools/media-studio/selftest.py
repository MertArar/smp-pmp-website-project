"""Small end-to-end check runnable inside the frozen executable."""
import json
import sys
from pathlib import Path

from PIL import Image
from engine import Converter, Options, binary, scan_inputs


def run(root: Path):
    root.mkdir(parents=True, exist_ok=True)
    result = {'success': False}
    try:
        source = root / 'sources'
        source.mkdir(exist_ok=True)
        Image.new('RGBA', (80, 60), (40, 80, 255, 180)).save(source / '01.png')
        frames = [Image.new('RGB', (80, 60), color) for color in ('red', 'blue', 'green')]
        frames[0].save(source / '02.gif', save_all=True, append_images=frames[1:], duration=[40, 80, 120], loop=0)
        options = Options(image_lossless=True)
        converter = Converter(options)
        converter.command([binary('ffmpeg'), '-v', 'error', '-y', '-f', 'lavfi', '-i',
                           'testsrc2=size=160x90:rate=12:duration=1', '-c:v', 'libx264', str(source / '03.mov')])
        session = root / 'converted'
        items, _ = scan_inputs([source], session, options)
        records = converter.run(items, session)
        result = {'success': len(records) == 3 and all(r['status'] == 'ok' for r in records),
                  'frozen': bool(getattr(sys, 'frozen', False)), 'ffmpeg': binary('ffmpeg'),
                  'ffprobe': binary('ffprobe'), 'records': records}
    except Exception as exc:
        result['error'] = str(exc)
    (root / 'selftest-result.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    return 0 if result['success'] else 1
