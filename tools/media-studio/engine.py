"""Media Studio conversion API. No GUI dependency; reusable by a future launcher."""
from __future__ import annotations

import json
import math
import os
import queue
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from PIL import Image, ImageChops, ImageOps, ImageStat

IMAGES = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff'}
VIDEOS = {'.mp4', '.mov', '.m4v', '.webm', '.mkv', '.avi'}
SUPPORTED = IMAGES | VIDEOS
ROOT = Path(sys.executable).parent if getattr(sys, 'frozen', False) else Path(__file__).resolve().parent
NO_WINDOW = subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0


class Cancelled(Exception):
    pass


@dataclass
class Options:
    layout: str = 'tree'
    image_quality: int = 90
    image_lossless: bool = False
    gif_lossless: bool = True
    video_crf: int = 26
    keep_audio: bool = True
    copy_other: bool = False
    verify_video: bool = True


@dataclass
class Item:
    source: Path
    relative: Path
    target: Path


def binary(name: str) -> str:
    suffix = '.exe' if os.name == 'nt' else ''
    candidates = [ROOT / 'bin' / (name + suffix)]
    if getattr(sys, 'frozen', False):
        candidates.append(Path(sys._MEIPASS) / 'bin' / (name + suffix))
    # Reuse the user's previously installed converter when running from source.
    candidates.append(Path('D:/Python Tools/media_converter/bin') / (name + suffix))
    for candidate in candidates:
        if candidate.is_file():
            return str(candidate)
    found = shutil.which(name)
    if found:
        return found
    raise RuntimeError(f'{name} bulunamadı. ffmpeg ve ffprobe dosyalarını bin klasörüne koyun.')


def scan_inputs(paths: list[Path], destination: Path, options: Options) -> tuple[list[Item], list[str]]:
    """Reserve every output path before work. Never overwrite colliding basenames."""
    items, warnings, seen, reserved = [], [], set(), set()
    destination = destination.resolve()
    for chosen in paths:
        chosen = chosen.resolve()
        if chosen.is_dir() and (destination == chosen or chosen in destination.parents):
            raise ValueError('Çıktı klasörü kaynak klasörün içinde olamaz; ayrı bir konum seçin.')
        files = sorted(chosen.rglob('*')) if chosen.is_dir() else [chosen]
        for source in files:
            if source.is_symlink() or not source.is_file():
                continue
            resolved = source.resolve()
            if chosen.is_dir() and chosen not in resolved.parents:
                continue
            if resolved in seen:
                continue
            seen.add(resolved)
            if source.suffix.lower() not in SUPPORTED and not options.copy_other:
                continue
            relative = source.relative_to(chosen.parent) if chosen.is_dir() else Path(source.name)
            if options.layout == 'flat':
                relative = Path(relative.name)
            ext = source.suffix.lower()
            target_rel = relative.with_suffix('.webp' if ext in IMAGES else '.webm') if ext in SUPPORTED else relative
            key = target_rel.as_posix().casefold()
            if key in reserved:
                raise ValueError(f'Aynı çıktı adı birden fazla dosyada kullanılıyor: {target_rel}\n'
                                 'Klasör yapısını koruyun veya çakışan dosyaları yeniden adlandırın.')
            reserved.add(key)
            items.append(Item(source, relative, destination / target_rel))
    return items, warnings


def frame_duration(image):
    image.load()  # WebP exposes the current duration only after decoding the frame.
    return max(10, int(image.info.get('duration', 100) or 100))


def animation_loop(image):
    loop = image.info.get('loop', 0)
    if image.format == 'GIF':
        return 0 if image.info.get('loop') == 0 else image.info.get('loop', 0) + 1
    return loop


def decoded_frame(image, index, animated):
    image.seek(index)
    image.load()
    frame = image if animated else ImageOps.exif_transpose(image)
    frame = frame.convert('RGBA')
    # RGB values below fully transparent pixels have no visible meaning.
    # libwebp is allowed to replace those values even in lossless animations.
    alpha = frame.getchannel('A')
    transparent = alpha.point(lambda value: 255 if value == 0 else 0)
    frame.paste((0, 0, 0, 0), mask=transparent)
    return frame


def verify_image(source: Path, output: Path, lossless: bool, checkpoint=None, progress=None) -> dict:
    checkpoint = checkpoint or (lambda: None)
    with Image.open(source) as before, Image.open(output) as after:
        count_a, count_b = getattr(before, 'n_frames', 1), getattr(after, 'n_frames', 1)
        animated = count_a > 1
        if animated and animation_loop(before) != animation_loop(after):
            raise ValueError('Doğrulama: animasyon döngüsü değişti.')
        a = b = 0
        frame_a = decoded_frame(before, 0, animated)
        frame_b = decoded_frame(after, 0, animated)
        if frame_a.size != frame_b.size:
            raise ValueError('Doğrulama: çözünürlük değişti.')
        left_a, left_b = frame_duration(before), frame_duration(after)
        elapsed = 0
        max_error, squared, values = 0, 0.0, 0
        while True:
            checkpoint()
            diff = ImageChops.difference(frame_a, frame_b)
            max_error = max(max_error, *(extreme[1] for extreme in diff.getextrema()))
            stats = ImageStat.Stat(diff)
            squared += sum(value * value for value in stats.rms)
            values += 4
            if progress:
                progress(a / max(1, count_a))
            if not animated:
                if count_b != 1:
                    raise ValueError('Doğrulama: beklenmeyen animasyon.')
                break
            step = min(left_a, left_b)
            elapsed += step
            left_a -= step
            left_b -= step
            if left_a == 0:
                a += 1
            if left_b == 0:
                b += 1
            if a >= count_a or b >= count_b:
                if a != count_a or b != count_b or left_a != 0 or left_b != 0:
                    raise ValueError('Doğrulama: animasyon süresi değişti.')
                break
            if left_a == 0:
                frame_a = decoded_frame(before, a, True)
                left_a = frame_duration(before)
            if left_b == 0:
                frame_b = decoded_frame(after, b, True)
                left_b = frame_duration(after)
        if lossless and max_error != 0:
            raise ValueError('Kayıpsız doğrulama başarısız: görünür piksel farkı bulundu.')
        rmse = math.sqrt(squared / max(1, values))
        return {'width': frame_a.width, 'height': frame_a.height,
                'source_frames': count_a, 'output_frames': count_b,
                'duration_ms': elapsed if animated else None,
                'pixel_exact': max_error == 0, 'max_channel_error': max_error,
                'psnr_db': round(20 * math.log10(255 / rmse), 2) if rmse else None,
                'check': 'Görüntü eşdeğer' if max_error == 0 else 'Görsel karşılaştırma önerilir'}


class Converter:
    def __init__(self, options: Options, emit: Callable[[str, dict], None] | None = None):
        self.options = options
        self.emit = emit or (lambda *_: None)
        self.cancelled = threading.Event()
        self.resumed = threading.Event()
        self.resumed.set()
        self.process = None

    def cancel(self):
        self.cancelled.set()
        self.resumed.set()
        process = self.process
        if process and process.poll() is None:
            try:
                process.terminate()
            except OSError:
                pass

    def checkpoint(self):
        while not self.resumed.wait(.1):
            if self.cancelled.is_set():
                raise Cancelled()
        if self.cancelled.is_set():
            raise Cancelled()

    def command(self, args, on_line=None, timeout=0):
        """Drain output on a reader thread so cancellation works even on silent tools."""
        self.checkpoint()
        lines = queue.Queue()
        self.process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                        text=True, encoding='utf-8', errors='replace',
                                        creationflags=NO_WINDOW)
        process = self.process

        def read():
            for line in process.stdout:
                lines.put(line)
            lines.put(None)

        reader = threading.Thread(target=read, daemon=True)
        reader.start()
        tail = []
        started = time.monotonic()
        try:
            while True:
                if self.cancelled.is_set():
                    raise Cancelled()
                if timeout and time.monotonic() - started > timeout:
                    raise RuntimeError('Medya bilgisi okunurken zaman aşımı oluştu.')
                try:
                    line = lines.get(timeout=.1)
                except queue.Empty:
                    continue
                if line is None:
                    break
                tail.append(line)
                tail = tail[-300:]
                if on_line:
                    on_line(line.strip())
            if process.wait() != 0:
                if self.cancelled.is_set():
                    raise Cancelled()
                raise RuntimeError(''.join(tail)[-3000:])
            return ''.join(tail)
        finally:
            if process.poll() is None:
                process.kill()
                process.wait()
            reader.join(timeout=2)
            process.stdout.close()
            self.process = None

    def probe(self, path):
        text = self.command([binary('ffprobe'), '-v', 'error', '-show_entries',
                             'stream=codec_type,codec_name,width,height,pix_fmt,duration,avg_frame_rate,color_space,color_transfer,color_primaries,color_range:stream_side_data=rotation:format=duration',
                             '-of', 'json', str(path)], timeout=30)
        return json.loads(text)

    def image(self, source: Path, output: Path):
        with Image.open(source) as image:
            count = getattr(image, 'n_frames', 1)
            animated = count > 1
            if image.mode in ('I', 'I;16', 'I;16B', 'F'):
                raise ValueError('8 bit üzerindeki görsel: WebP bit derinliğini koruyamaz; kaynak korundu.')
            lossless = self.options.gif_lossless if animated or source.suffix.lower() == '.gif' else self.options.image_lossless
            if animated:
                # Pillow/libwebp streaming interface, pinned by requirements.txt.
                # Keep only the current RGBA frame instead of a list of all decoded frames.
                from PIL import _webp
                loop = animation_loop(image)
                encoder = _webp.WebPAnimEncoder(image.size, 0, loop, False,
                                                9 if lossless else 3, 17 if lossless else 5, False, False)
                timestamp = 0
                quality = 75 if lossless else self.options.image_quality
                for index in range(count):
                    self.checkpoint()
                    frame = decoded_frame(image, index, True)
                    encoder.add(frame.getim(), timestamp, lossless, quality, 100, 4)
                    timestamp += frame_duration(image)
                    self.emit('file_progress', {'fraction': .75 * (index + 1) / count})
                encoder.add(None, timestamp, lossless, quality, 100, 0)
                self.checkpoint()
                data = encoder.assemble(image.info.get('icc_profile') or b'', b'', b'')
                if data is None:
                    raise ValueError('Animasyon kodlanamadı.')
                output.write_bytes(data)
            else:
                frame = ImageOps.exif_transpose(image).convert('RGBA')
                frame.save(output, format='WEBP', lossless=lossless, quality=self.options.image_quality,
                           method=6, exact=True, icc_profile=image.info.get('icc_profile') or b'')
        self.checkpoint()
        self.emit('phase', {'text': 'Görsel / animasyon doğrulanıyor…'})
        return verify_image(source, output, lossless, self.checkpoint,
                            lambda fraction: self.emit('file_progress', {'fraction': .75 + .24 * fraction}))

    def video(self, source: Path, output: Path):
        original = self.probe(source)
        stream = next((s for s in original['streams'] if s['codec_type'] == 'video'), None)
        if not stream:
            raise ValueError('Video akışı bulunamadı.')
        pix = stream.get('pix_fmt', '')
        if 'a' in pix and pix.startswith(('yuva', 'rgba', 'bgra', 'argb', 'abgr', 'gbrap')):
            raise ValueError('Alfa kanallı video: saydamlığı koruyan özel iş akışı gerekli; kaynak korundu.')
        duration = float(original.get('format', {}).get('duration') or stream.get('duration') or 0)
        pixel_formats = {'yuv420p', 'yuv422p', 'yuv444p', 'gbrp', 'yuv420p10le', 'yuv422p10le',
                         'yuv444p10le', 'gbrp10le', 'yuv420p12le', 'yuv422p12le', 'yuv444p12le'}
        output_pix = pix if pix in pixel_formats else 'yuv420p'
        args = [binary('ffmpeg'), '-hide_banner', '-v', 'warning', '-nostdin', '-y', '-i', str(source),
                '-map', '0:v:0', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', str(self.options.video_crf),
                '-row-mt', '1', '-cpu-used', '3', '-threads', str(min(8, os.cpu_count() or 2)),
                '-pix_fmt', output_pix, '-fps_mode', 'passthrough']
        for key, flag in [('color_space', '-colorspace'), ('color_transfer', '-color_trc'),
                          ('color_primaries', '-color_primaries'), ('color_range', '-color_range')]:
            if stream.get(key) and stream[key] not in ('unknown', 'unspecified'):
                args += [flag, stream[key]]
        if self.options.keep_audio:
            args += ['-map', '0:a:0?', '-c:a', 'libopus', '-b:a', '128k']
        else:
            args += ['-an']
        args += ['-progress', 'pipe:1', '-nostats', '-f', 'webm', str(output)]

        def progress(line):
            key, _, value = line.partition('=')
            if key == 'out_time_us' and duration > 0:
                try:
                    self.emit('file_progress', {'fraction': min(.94, max(0, float(value) / 1e6 / duration * .94))})
                except ValueError:
                    pass

        self.command(args, progress)
        self.checkpoint()
        self.emit('phase', {'text': 'Video doğrulanıyor…'})
        converted = self.probe(output)
        new_stream = next(s for s in converted['streams'] if s['codec_type'] == 'video')
        rotation = next((abs(int(s.get('rotation', 0))) % 180 for s in stream.get('side_data_list', [])
                         if 'rotation' in s), 0)
        expected = (stream['height'], stream['width']) if rotation == 90 else (stream['width'], stream['height'])
        if (new_stream['width'], new_stream['height']) != expected:
            raise ValueError('Doğrulama: video çözünürlüğü değişti.')
        new_duration = float(converted.get('format', {}).get('duration') or 0)
        if duration and abs(new_duration - duration) > max(.15, duration * .002):
            raise ValueError('Doğrulama: video süresi değişti.')
        had_audio = any(s['codec_type'] == 'audio' for s in original['streams'])
        if self.options.keep_audio and had_audio and not any(s['codec_type'] == 'audio' for s in converted['streams']):
            raise ValueError('Doğrulama: ses akışı kayboldu.')
        if self.options.verify_video:
            self.command([binary('ffmpeg'), '-v', 'error', '-xerror', '-nostdin', '-i', str(output),
                          '-f', 'null', '-'])
        return {'width': expected[0], 'height': expected[1], 'duration_seconds': new_duration,
                'source_fps': stream.get('avg_frame_rate'), 'output_fps': new_stream.get('avg_frame_rate'),
                'check': 'Çözünürlük / süre / tam çözümleme OK' if self.options.verify_video else 'Çözünürlük / süre OK',
                'note': 'VP9 görüntü ve Opus ses kayıplı kodlanır; görsel karşılaştırma önerilir.'}

    def run(self, items: list[Item], session: Path):
        records = []
        status = 'completed'
        try:
            for index, item in enumerate(items):
                self.checkpoint()
                self.emit('begin', {'index': index, 'total': len(items), 'path': str(item.relative)})
                item.target.parent.mkdir(parents=True, exist_ok=True)
                record = {'source': str(item.source), 'output': str(item.target),
                          'input_bytes': item.source.stat().st_size, 'status': 'error'}
                # Temporary files sit next to outputs for an atomic publish.
                handle, temp_name = tempfile.mkstemp(prefix='.media-', suffix=item.target.suffix,
                                                     dir=item.target.parent)
                os.close(handle)
                temp = Path(temp_name)
                try:
                    self.checkpoint()
                    suffix = item.source.suffix.lower()
                    if suffix in IMAGES:
                        record['validation'] = self.image(item.source, temp)
                    elif suffix in VIDEOS:
                        record['validation'] = self.video(item.source, temp)
                    else:
                        shutil.copy2(item.source, temp)
                        record['validation'] = {'check': 'Dönüştürülmeden kopyalandı'}
                    self.checkpoint()
                    # Exclusive creation also protects a destination modified externally during work.
                    created = False
                    try:
                        with item.target.open('xb') as target, temp.open('rb') as source:
                            created = True
                            shutil.copyfileobj(source, target)
                    except BaseException:
                        if created:
                            item.target.unlink(missing_ok=True)
                        raise
                    record.update(status='ok', output_bytes=item.target.stat().st_size)
                    record['saved_percent'] = round((1 - record['output_bytes'] / max(1, record['input_bytes'])) * 100, 2)
                except Cancelled:
                    raise
                except Exception as exc:
                    record['error'] = str(exc)
                finally:
                    temp.unlink(missing_ok=True)
                records.append(record)
                self.emit('result', {'index': index, 'record': record})
        except Cancelled:
            status = 'cancelled'
        except Exception as exc:
            status = 'error'
            self.emit('error', {'text': str(exc)})
        finally:
            self.emit('done', {'status': status, 'records': records, 'session': str(session)})
        return records
