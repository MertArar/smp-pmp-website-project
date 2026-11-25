"""Hidden-window integration test: actual GUI queue, preview and ZIP commands."""
import json
import tempfile
import time
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

from PIL import Image

from main import ImagePreview, Studio


class DesktopTests(unittest.TestCase):
    def test_batch_preview_and_archive(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as temporary:
            root = Path(temporary)
            source = root / 'file'
            (source / 'other').mkdir(parents=True)
            Image.new('RGB', (64, 48), 'blue').save(source / '01.png')
            frames = [Image.new('RGB', (64, 48), color) for color in ('red', 'green', 'blue')]
            frames[0].save(source / 'other/02.gif', save_all=True, append_images=frames[1:],
                           duration=[40, 80, 120], loop=0)
            state_patch = patch('main.STATE_ROOT', root / 'app-state')
            state_patch.start()
            app = Studio()
            app.withdraw()
            app.save_settings = lambda: None
            app.destination.set(str(root / 'out'))
            app.profile.set('Kayıpsız görsel')
            errors = []
            app.report_callback_exception = lambda *args: errors.append(str(args))
            try:
                with patch('main.messagebox.showerror', side_effect=lambda *args, **kw: errors.append(str(args))):
                    app.add_paths([source])
                    app.start()
                    self.wait_for_work(app)
                    self.assertEqual(len(app.records), 2)
                    self.assertTrue(all(r['status'] == 'ok' for r in app.records.values()), app.records)
                    self.assertEqual(app.progress.get(), 1)
                    record = app.records[1]
                    preview = ImagePreview(app, Path(record['source']), Path(record['output']))
                    preview.withdraw()
                    for _ in range(12):
                        app.update()
                        time.sleep(.02)
                    preview.close()
                    # ZIP must include this run's outputs only, even in an existing directory.
                    (app.session / 'unrelated.txt').write_text('old file', encoding='utf-8')
                    archive = root / 'bundle.zip'
                    with patch('main.filedialog.asksaveasfilename', return_value=str(archive)):
                        app.export_zip()
                        self.wait_for_work(app)
                    with zipfile.ZipFile(archive) as output:
                        self.assertEqual(set(output.namelist()), {'file/01.webp', 'file/other/02.webp'})
                    self.assertEqual({path.relative_to(app.session).as_posix() for path in app.session.rglob('*') if path.is_file()},
                                     {'file/01.webp', 'file/other/02.webp', 'unrelated.txt'})
                    history = app.log_widget.get('1.0', 'end')
                    self.assertIn('02.gif', history)
                    self.assertIn('TAMAMLANDI', history)
                    self.assertTrue((root / 'app-state/history.log').exists())
                    self.assertFalse(errors, errors)
            finally:
                app.destroy()
                state_patch.stop()

    def wait_for_work(self, app):
        deadline = time.monotonic() + 20
        while app.busy and time.monotonic() < deadline:
            app.update()
            time.sleep(.01)
        self.assertFalse(app.busy, 'Arayüz çalışan işlemi tamamlayamadı')


if __name__ == '__main__':
    unittest.main(verbosity=2)
