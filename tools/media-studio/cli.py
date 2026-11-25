"""CLI integration point for a future central application."""
import argparse
from pathlib import Path

from engine import Converter, Options, scan_inputs


def main():
    parser = argparse.ArgumentParser(description='Media Studio • Toplu WebP / WebM dönüştürücü')
    parser.add_argument('sources', nargs='+', type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--flat', action='store_true', help='Alt klasörleri tek klasörde topla')
    parser.add_argument('--lossless-images', action='store_true')
    parser.add_argument('--image-quality', type=int, default=92, choices=range(1, 101), metavar='1..100')
    parser.add_argument('--video-crf', type=int, default=24, choices=range(0, 64), metavar='0..63')
    parser.add_argument('--mute', action='store_true')
    parser.add_argument('--skip-other', action='store_true')
    args = parser.parse_args()
    options = Options(layout='flat' if args.flat else 'tree', image_lossless=args.lossless_images,
                      image_quality=args.image_quality, video_crf=args.video_crf,
                      keep_audio=not args.mute, copy_other=not args.skip_other)
    session = args.output.resolve()
    items, _ = scan_inputs(args.sources, session, options)
    if not items:
        parser.error('Dönüştürülecek dosya yok.')

    def emit(event, data):
        if event == 'begin':
            print(f'[{data["index"] + 1}/{data["total"]}] {data["path"]}', flush=True)
        elif event == 'result':
            record = data['record']
            print(record.get('error') or f'OK • %{record["saved_percent"]} kazanç', flush=True)
        elif event == 'error':
            print(data['text'], flush=True)

    converter = Converter(options, emit)
    try:
        records = converter.run(items, session)
    except KeyboardInterrupt:
        converter.cancel()
        return 130
    print(f'Çıktılar: {session}')
    return 1 if any(r['status'] != 'ok' for r in records) or len(records) != len(items) else 0


if __name__ == '__main__':
    raise SystemExit(main())
