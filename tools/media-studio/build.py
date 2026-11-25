"""Optional portable Windows build. Install pyinstaller first."""
from pathlib import Path
import shutil
import sys

import PyInstaller.__main__
from engine import binary

root = Path(__file__).resolve().parent
single_file = '--onefile' in sys.argv
distribution = root / 'dist' / 'desktop' if single_file else root / 'dist'
work = root / 'build' / 'desktop' if single_file else root / 'build'
PyInstaller.__main__.run([
    '--noconfirm', '--onefile' if single_file else '--onedir', '--windowed', '--name', 'Media Studio',
    '--distpath', str(distribution), '--workpath', str(work),
    '--specpath', str(work), '--collect-all', 'customtkinter',
    '--add-binary', binary('ffmpeg') + ';bin',
    '--add-binary', binary('ffprobe') + ';bin',
    str(root / 'main.py'),
])
if not single_file:
    shutil.copy2(root / 'README.md', root / 'dist' / 'Media Studio' / 'README.md')
