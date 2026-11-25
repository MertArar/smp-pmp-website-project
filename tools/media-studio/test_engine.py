import json
import tempfile
import threading
import time
import unittest
from pathlib import Path

from PIL import Image, ImageDraw

from engine import Cancelled, Converter, Options, binary, scan_inputs, verify_image


class ConversionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=Path(__file__).parent)
        self.root = Path(self.temp.name)
        self.source = self.root / 'file'
        (self.source / 'other').mkdir(parents=True)
        self.session = self.root / 'output'
        self.output = self.session

    def tearDown(self):
        self.temp.cleanup()

    def make_image(self, path, color=(35, 67, 185, 255)):
        image = Image.new('RGBA', (128, 80), color)
        ImageDraw.Draw(image).rectangle((10, 10, 40, 50), fill=(255, 0, 55, 100))
        image.save(path)

    def test_lossless_tree_and_copy(self):
        self.make_image(self.source / '01.png')
        self.make_image(self.source / 'other' / '02.png')
        (self.source / 'other' / 'notes.txt').write_text('Özgün içerik', encoding='utf-8')
        options = Options(image_lossless=True, copy_other=True)
        items, _ = scan_inputs([self.source], self.output, options)
        results = Converter(options).run(items, self.session)
        self.assertTrue(all(r['status'] == 'ok' for r in results), results)
        self.assertTrue((self.output / 'file/other/02.webp').is_file())
        self.assertEqual((self.output / 'file/other/notes.txt').read_text(encoding='utf-8'), 'Özgün içerik')
        self.assertTrue(verify_image(self.source / '01.png', self.output / 'file/01.webp', True)['pixel_exact'])
        self.assertTrue((self.source / '01.png').exists())
        self.assertEqual({p.relative_to(self.output).as_posix() for p in self.output.rglob('*') if p.is_file()},
                         {'file/01.webp', 'file/other/02.webp', 'file/other/notes.txt'})

    def test_flat_names_and_collision_rejected(self):
        self.make_image(self.source / '01.png')
        self.make_image(self.source / 'other' / '02.png')
        items, _ = scan_inputs([self.source], self.output, Options(layout='flat'))
        self.assertEqual({i.target.name for i in items}, {'01.webp', '02.webp'})
        self.make_image(self.source / 'other' / '01.png')
        with self.assertRaisesRegex(ValueError, 'Aynı çıktı adı'):
            scan_inputs([self.source], self.output, Options(layout='flat'))
        (self.source / '01.jpg').write_bytes(b'not read during planning')
        with self.assertRaisesRegex(ValueError, 'Aynı çıktı adı'):
            scan_inputs([self.source], self.output, Options())

    def test_nested_output_rejected(self):
        with self.assertRaisesRegex(ValueError, 'kaynak klasörün içinde'):
            scan_inputs([self.source], self.source / 'output', Options())

    def test_animation_disposal_timing_and_loops(self):
        for loop in (None, 0, 2):
            with self.subTest(loop=loop):
                frames = []
                for x in (5, 20, 40, 60):
                    image = Image.new('RGBA', (100, 80), (0, 0, 0, 0))
                    ImageDraw.Draw(image).rectangle((x, 10, x + 20, 40), fill=(255, 10, 80, 255))
                    frames.append(image)
                path = self.source / f'motion-{loop}.gif'
                kwargs = {'loop': loop} if loop is not None else {}
                frames[0].save(path, save_all=True, append_images=frames[1:], duration=[40, 80, 120, 160],
                               disposal=2, **kwargs)
                output = self.root / f'motion-{loop}.webp'
                check = Converter(Options()).image(path, output)
                self.assertEqual(check['duration_ms'], 400)
                self.assertTrue(check['pixel_exact'])

    def test_transparent_palette_visual_equivalence(self):
        frames = []
        for x in (5, 20, 40):
            frame = Image.new('P', (80, 60), 0)
            frame.putpalette([200, 150, 100, 255, 10, 80] + [0] * 762)
            ImageDraw.Draw(frame).rectangle((x, 10, x + 10, 30), fill=1)
            frames.append(frame)
        path = self.source / 'transparent.gif'
        frames[0].save(path, save_all=True, append_images=frames[1:], transparency=0,
                       duration=[40, 70, 120], disposal=2, loop=0)
        output = self.root / 'transparent.webp'
        check = Converter(Options()).image(path, output)
        self.assertTrue(check['pixel_exact'])
        self.assertEqual(check['duration_ms'], 230)
        with Image.open(output) as image:
            changed = image.convert('RGBA')
        changed.putpixel((79, 59), (255, 255, 255, 255))
        wrong = self.root / 'changed.webp'
        changed.save(wrong, lossless=True)
        with self.assertRaises(ValueError):
            verify_image(path, wrong, True)

    def test_jpeg_orientation_and_icc(self):
        path = self.source / 'portrait.jpg'
        image = Image.new('RGB', (30, 50), (20, 80, 160))
        exif = Image.Exif()
        exif[274] = 6
        image.save(path, exif=exif)
        output = self.root / 'portrait.webp'
        check = Converter(Options(image_lossless=True)).image(path, output)
        self.assertEqual((check['width'], check['height']), (50, 30))
        self.assertTrue(check['pixel_exact'])

    def test_bad_file_does_not_stop_batch_and_existing_is_safe(self):
        self.make_image(self.source / 'good.png')
        (self.source / 'bad.png').write_bytes(b'broken')
        items, _ = scan_inputs([self.source], self.output, Options())
        results = Converter(Options()).run(items, self.session)
        self.assertEqual([r['status'] for r in results], ['error', 'ok'])
        target = self.output / 'file/good.webp'
        original_bytes = target.read_bytes()
        repeat = Converter(Options()).run(items, self.session)
        self.assertEqual(repeat[-1]['status'], 'error')
        self.assertEqual(target.read_bytes(), original_bytes)
        self.assertFalse(list(self.output.rglob('.media-*')))

    def test_cancel_silent_subprocess_and_pause(self):
        import sys
        converter = Converter(Options())
        timer = threading.Timer(.3, converter.cancel)
        timer.start()
        started = time.monotonic()
        with self.assertRaises(Cancelled):
            converter.command([sys.executable, '-c', 'import time; time.sleep(20)'])
        timer.join()
        self.assertLess(time.monotonic() - started, 3)
        converter = Converter(Options())
        converter.resumed.clear()
        event = threading.Event()
        thread = threading.Thread(target=lambda: (converter.checkpoint(), event.set()))
        thread.start()
        self.assertFalse(event.wait(.15))
        converter.resumed.set()
        thread.join(2)
        self.assertTrue(event.is_set())

    def test_video_resolution_duration_audio_and_decode(self):
        converter = Converter(Options())
        source = self.source / 'movie.mov'
        converter.command([binary('ffmpeg'), '-v', 'error', '-y', '-f', 'lavfi', '-i',
                           'testsrc2=size=160x90:rate=12:duration=1', '-f', 'lavfi', '-i',
                           'sine=frequency=440:duration=1', '-c:v', 'libx264', '-c:a', 'aac', str(source)])
        output = self.root / 'movie.webm'
        check = converter.video(source, output)
        self.assertEqual((check['width'], check['height']), (160, 90))
        self.assertLess(abs(check['duration_seconds'] - 1), .15)
        self.assertEqual(check['source_fps'], check['output_fps'])
        streams = converter.probe(output)['streams']
        self.assertTrue(any(s['codec_name'] == 'opus' for s in streams))
        silent = Converter(Options(keep_audio=False))
        silent_output = self.root / 'silent.webm'
        silent.video(source, silent_output)
        self.assertFalse(any(s['codec_type'] == 'audio' for s in silent.probe(silent_output)['streams']))


if __name__ == '__main__':
    unittest.main(verbosity=2)
