"""Media Studio desktop entry point. Run: python main.py."""
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(sys.executable).parent if getattr(sys, 'frozen', False) else Path(__file__).resolve().parent
VENV = ROOT / '.venv' / ('Scripts/python.exe' if os.name == 'nt' else 'bin/python')
if not getattr(sys, 'frozen', False) and sys.prefix == sys.base_prefix and VENV.exists():
    raise SystemExit(subprocess.call([str(VENV), str(Path(__file__).resolve()), *sys.argv[1:]]))
if sys.stdout is None:
    sys.stdout = open(os.devnull, 'w')
if sys.stderr is None:
    sys.stderr = open(os.devnull, 'w')

import json
import queue
import threading
import time
import zipfile
from datetime import datetime
from tkinter import filedialog, messagebox, ttk

import customtkinter as ctk
from PIL import Image, ImageOps

from engine import Converter, Options, SUPPORTED, scan_inputs

BG, CARD, BLUE, TEXT = '#101827', '#1E293B', '#2563EB', '#F8FAFC'
MUTED, GREEN, RED, BORDER = '#94A3B8', '#16A34A', '#DC2626', '#334155'
STATE_ROOT = (Path(os.environ.get('LOCALAPPDATA', str(Path.home()))) / 'Media Studio'
              if getattr(sys, 'frozen', False) else ROOT / '.state')

PROFILES = {
    'Yüksek kalite': (92, False, 24),
    'Dengeli web': (85, False, 32),
    'En küçük dosya': (75, False, 38),
    'Kayıpsız görsel': (100, True, 24),
}


def size(value):
    if value is None:
        return '—'
    for unit in ('B', 'KB', 'MB', 'GB'):
        if value < 1024 or unit == 'GB':
            return f'{value:.1f} {unit}'
        value /= 1024


def open_path(path):
    if os.name == 'nt':
        os.startfile(str(path))
    else:
        subprocess.Popen(['open' if sys.platform == 'darwin' else 'xdg-open', str(path)])


class ImagePreview(ctk.CTkToplevel):
    def __init__(self, parent, original, converted):
        super().__init__(parent)
        self.title('Media Studio • Önce / Sonra')
        self.geometry('1000x640')
        self.configure(fg_color=BG)
        self.images, self.jobs = [], []
        self.grid_columnconfigure((0, 1), weight=1)
        self.grid_rowconfigure(1, weight=1)
        ctk.CTkLabel(self, text='Aynı ölçekte karşılaştırma • Animasyonlar kendi kare süreleriyle oynatılır',
                     text_color=MUTED).grid(row=0, column=0, columnspan=2, pady=16)
        self.origin = time.monotonic()
        self.timelines = []
        for column, (title, path) in enumerate([('ORİJİNAL', original), ('DÖNÜŞTÜRÜLMÜŞ', converted)]):
            card = ctk.CTkFrame(self, fg_color=CARD, corner_radius=14)
            card.grid(row=1, column=column, padx=12, pady=12, sticky='nsew')
            ctk.CTkLabel(card, text=title, text_color=MUTED, font=('Segoe UI', 12, 'bold')).pack(pady=12)
            label = ctk.CTkLabel(card, text='')
            label.pack(expand=True, fill='both')
            ctk.CTkLabel(card, text=f'{path.name}  ·  {size(path.stat().st_size)}', text_color=TEXT).pack(pady=16)
            image = Image.open(path)
            self.images.append(image)
            times = []
            elapsed = 0
            for index in range(getattr(image, 'n_frames', 1)):
                image.seek(index)
                elapsed += max(10, int(image.info.get('duration', 100) or 100))
                times.append(elapsed)
            image.seek(0)
            loop = image.info.get('loop', 0)
            if path.suffix.lower() == '.gif':
                loop = 0 if image.info.get('loop') == 0 else image.info.get('loop', 0) + 1
            self.timelines.append((image, label, times, loop))
        self.origin = time.monotonic()
        self.animate()
        self.protocol('WM_DELETE_WINDOW', self.close)
        self.after(100, self.lift)

    def animate(self):
        import bisect
        elapsed = (time.monotonic() - self.origin) * 1000
        for image, label, times, loop in self.timelines:
            position = elapsed % times[-1]
            if loop and elapsed >= times[-1] * loop:
                position = times[-1] - 1
            index = min(len(times) - 1, bisect.bisect_right(times, position))
            image.seek(index)
            frame = ImageOps.exif_transpose(image).convert('RGBA')
            frame.thumbnail((430, 450), Image.Resampling.LANCZOS)
            asset = ctk.CTkImage(frame, size=frame.size)
            label.configure(image=asset)
            label._preview_asset = asset
        self.jobs = [self.after(20, self.animate)]

    def close(self):
        for job in self.jobs:
            self.after_cancel(job)
        for image in self.images:
            image.close()
        self.destroy()


class Studio(ctk.CTk):
    def __init__(self):
        ctk.set_appearance_mode('dark')
        super().__init__()
        self.title('Media Studio • Web için dönüştür & optimize et')
        self.geometry('1220x850')
        self.minsize(1020, 760)
        self.configure(fg_color=BG)
        self.events = queue.Queue()
        self.paths, self.items, self.records = [], [], {}
        self.worker = self.converter = self.session = None
        self.closing = False
        self.busy = False
        self.sources_text = ctk.StringVar(value='Henüz dosya seçilmedi')
        self.destination = ctk.StringVar(value=str(ROOT / 'outputs'))
        self.profile = ctk.StringVar(value='Yüksek kalite')
        self.layout = ctk.StringVar(value='Klasör yapısını koru')
        self.gif_lossless = ctk.BooleanVar(value=True)
        self.keep_audio = ctk.BooleanVar(value=True)
        self.copy_other = ctk.BooleanVar(value=False)
        self.verify_video = ctk.BooleanVar(value=True)
        self.state_text = ctk.StringVar(value='HAZIR')
        self.detail_text = ctk.StringVar(value='Bir klasör veya birden fazla dosya seçerek başlayın.')
        self.stats = ctk.StringVar(value='0 dosya  ·  0 B kaynak  ·  0 B çıktı')
        self.load_settings()
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(3, weight=1)
        self.build()
        self.protocol('WM_DELETE_WINDOW', self.close)
        self.after(80, self.poll)

    def label(self, parent, text='', **kw):
        kw.setdefault('text_color', TEXT)
        kw.setdefault('font', ('Segoe UI', 13))
        return ctk.CTkLabel(parent, text=text, **kw)

    def button(self, parent, text, command, secondary=False, **kw):
        kw.setdefault('height', 36)
        return ctk.CTkButton(parent, text=text, command=command, corner_radius=8,
                            fg_color=BORDER if secondary else BLUE, **kw)

    def build(self):
        header = ctk.CTkFrame(self, fg_color='transparent')
        header.grid(row=0, column=0, sticky='ew', padx=26, pady=(20, 12))
        ctk.CTkLabel(header, text='Media Studio', font=('Segoe UI', 29, 'bold'), text_color=TEXT).pack(side='left')
        self.label(header, 'WEB İÇİN DAHA HAFİF MEDYA', text_color_disabled=MUTED).pack(side='left', padx=20)
        self.label(header, '●  Yerel çalışma', text_color_disabled=GREEN).pack(side='right')

        setup = ctk.CTkFrame(self, fg_color=CARD, corner_radius=14)
        setup.grid(row=1, column=0, padx=24, pady=6, sticky='ew')
        setup.grid_columnconfigure(1, weight=1)
        self.label(setup, '01  DOSYALAR', text_color_disabled=MUTED).grid(row=0, column=0, padx=18, pady=12, sticky='w')
        self.label(setup, textvariable=self.sources_text, anchor='w').grid(row=0, column=1, padx=12, sticky='ew')
        actions = ctk.CTkFrame(setup, fg_color='transparent')
        actions.grid(row=0, column=2, padx=14)
        self.file_button = self.button(actions, 'Dosya ekle', self.add_files, secondary=True, width=110)
        self.file_button.pack(side='left', padx=4)
        self.folder_button = self.button(actions, 'Klasör ekle', self.add_folder, width=110)
        self.folder_button.pack(side='left', padx=4)
        self.clear_button = self.button(actions, 'Temizle', self.clear, secondary=True, width=75)
        self.clear_button.pack(side='left', padx=4)
        self.label(setup, '02  ÇIKTI KONUMU', text_color_disabled=MUTED).grid(row=1, column=0, padx=18, pady=12, sticky='w')
        self.output_entry = ctk.CTkEntry(setup, textvariable=self.destination, height=36, fg_color=BG, border_color=BORDER)
        self.output_entry.grid(row=1, column=1, padx=12, pady=8, sticky='ew')
        self.output_button = self.button(setup, 'Konum seç', self.choose_output, secondary=True, width=110)
        self.output_button.grid(row=1, column=2, sticky='e', padx=18)

        settings = ctk.CTkFrame(self, fg_color=CARD, corner_radius=14)
        settings.grid(row=2, column=0, padx=24, pady=8, sticky='ew')
        settings.grid_columnconfigure((0, 1, 2), weight=1)
        self.label(settings, 'Dönüştürme profili').grid(row=0, column=0, padx=18, pady=(10, 4), sticky='w')
        self.label(settings, 'Dosya düzeni').grid(row=0, column=1, padx=18, pady=(10, 4), sticky='w')
        self.label(settings, 'PNG / JPG / GIF → WebP   ·   MP4 / MOV → WebM', text_color_disabled=MUTED).grid(row=0, column=2, padx=18, sticky='w')
        self.profile_menu = ctk.CTkOptionMenu(settings, variable=self.profile, values=list(PROFILES), fg_color=BG,
                                            button_color=BLUE, width=220)
        self.profile_menu.grid(row=1, column=0, sticky='ew', padx=18, pady=6)
        self.layout_menu = ctk.CTkOptionMenu(settings, variable=self.layout,
                                           values=['Klasör yapısını koru', 'Tek klasörde topla'], fg_color=BG, button_color=BLUE)
        self.layout_menu.grid(row=1, column=1, sticky='ew', padx=18, pady=6)
        self.label(settings, 'Çözünürlük korunur. Video profilleri kayıplıdır.', text_color_disabled=MUTED).grid(row=1, column=2, padx=18, sticky='w')
        switches = ctk.CTkFrame(settings, fg_color='transparent')
        switches.grid(row=2, column=0, columnspan=3, sticky='ew', padx=18, pady=12)
        self.switches = []
        for text, variable in [('GIF / animasyon: kayıpsız', self.gif_lossless), ('Sesi koru', self.keep_audio),
                               ('Diğer dosyaları kopyala', self.copy_other), ('Videoyu tam doğrula', self.verify_video)]:
            switch = ctk.CTkSwitch(switches, text=text, variable=variable, progress_color=BLUE,
                                   font=('Segoe UI', 12))
            switch.pack(side='left', padx=(0, 20))
            self.switches.append(switch)

        self.tabs = ctk.CTkTabview(self, fg_color=CARD, segmented_button_selected_color=BLUE)
        self.tabs.grid(row=3, column=0, sticky='nsew', padx=24, pady=8)
        self.tabs.add('Dönüştür')
        history = self.tabs.add('İşlem Geçmişi')
        history.grid_columnconfigure(0, weight=1)
        history.grid_rowconfigure(0, weight=1)
        self.log_widget = ctk.CTkTextbox(history, fg_color=BG, text_color=TEXT, wrap='word')
        self.log_widget.grid(row=0, column=0, sticky='nsew', padx=8, pady=8)
        try:
            self.log_widget.insert('end', (STATE_ROOT / 'history.log').read_text(encoding='utf-8')[-200000:])
        except OSError:
            pass
        self.log_widget.configure(state='disabled')
        content = ctk.CTkFrame(self.tabs.tab('Dönüştür'), fg_color=CARD, corner_radius=14)
        content.pack(fill='both', expand=True)
        content.grid_columnconfigure(0, weight=1)
        content.grid_rowconfigure(1, weight=1)
        top = ctk.CTkFrame(content, fg_color='transparent')
        top.grid(row=0, column=0, sticky='ew', padx=16, pady=10)
        self.label(top, 'Dönüştürme kuyruğu').pack(side='left')
        self.preview_button = self.button(top, 'Önce / Sonra', self.preview, secondary=True, width=130)
        self.preview_button.pack(side='right')
        style = ttk.Style(self)
        style.theme_use('clam')
        style.configure('Media.Treeview', background=BG, fieldbackground=BG, foreground=TEXT,
                        borderwidth=0, rowheight=34, font=('Segoe UI', 11))
        style.configure('Media.Treeview.Heading', background=CARD, foreground=MUTED,
                        relief='flat', font=('Segoe UI', 10, 'bold'))
        style.map('Media.Treeview', background=[('selected', BLUE)], foreground=[('selected', 'white')])
        tree_frame = ctk.CTkFrame(content, fg_color=BG)
        tree_frame.grid(row=1, column=0, sticky='nsew', padx=16)
        tree_frame.grid_columnconfigure(0, weight=1)
        tree_frame.grid_rowconfigure(0, weight=1)
        columns = ('path', 'format', 'before', 'after', 'saving', 'state')
        self.tree = ttk.Treeview(tree_frame, columns=columns, show='headings', style='Media.Treeview', selectmode='browse')
        for col, text, width in zip(columns, ['DOSYA / KLASÖR', 'ÇIKTI', 'ÖNCE', 'SONRA', 'KAZANÇ', 'DURUM'],
                                    [350, 80, 100, 100, 90, 160]):
            self.tree.heading(col, text=text)
            self.tree.column(col, width=width, minwidth=65, stretch=col in ('path', 'state'))
        self.tree.grid(row=0, column=0, sticky='nsew')
        scroll = ttk.Scrollbar(tree_frame, orient='vertical', command=self.tree.yview)
        scroll.grid(row=0, column=1, sticky='ns')
        horizontal = ttk.Scrollbar(tree_frame, orient='horizontal', command=self.tree.xview)
        horizontal.grid(row=1, column=0, sticky='ew')
        self.tree.configure(yscrollcommand=scroll.set, xscrollcommand=horizontal.set)
        self.tree.tag_configure('ok', foreground='#86EFAC')
        self.tree.tag_configure('larger', foreground='#FCD34D')
        self.tree.tag_configure('error', foreground='#FCA5A5')
        self.tree.bind('<Double-1>', lambda _: self.preview())
        self.tree.bind('<<TreeviewSelect>>', self.selected_detail)
        self.detail_label = self.label(content, textvariable=self.detail_text, anchor='w', justify='left', wraplength=1050)
        self.detail_label.grid(row=2, column=0, sticky='ew', padx=18, pady=10)

        footer = ctk.CTkFrame(self, fg_color='transparent')
        footer.grid(row=4, column=0, sticky='ew', padx=26, pady=(6, 18))
        footer.grid_columnconfigure(0, weight=1)
        self.label(footer, textvariable=self.state_text, anchor='w').grid(row=0, column=0, sticky='ew')
        self.label(footer, textvariable=self.stats, anchor='w', text_color_disabled=MUTED).grid(row=1, column=0, sticky='ew', pady=5)
        self.progress = ctk.CTkProgressBar(footer, height=8, progress_color=BLUE)
        self.progress.grid(row=2, column=0, sticky='ew', padx=(0, 18), pady=6)
        self.progress.set(0)
        controls = ctk.CTkFrame(footer, fg_color='transparent')
        controls.grid(row=0, column=1, rowspan=3)
        self.open_button = self.button(controls, 'Çıktıyı aç', self.open_output, secondary=True, width=100)
        self.open_button.grid(row=0, column=0, padx=4, pady=4)
        self.zip_button = self.button(controls, 'ZIP oluştur', self.export_zip, secondary=True, width=100)
        self.zip_button.grid(row=1, column=0, padx=4, pady=4)
        self.pause_button = self.button(controls, 'Sıra sonunda beklet', self.pause, secondary=True, width=160, state='disabled')
        self.pause_button.grid(row=0, column=1, padx=4, pady=4)
        self.stop_button = self.button(controls, 'Durdur', self.stop, secondary=True, width=160, state='disabled')
        self.stop_button.grid(row=1, column=1, padx=4, pady=4)
        self.start_button = self.button(controls, 'Dönüştürmeye başla  →', self.start, width=190, height=80)
        self.start_button.grid(row=0, column=2, rowspan=2, padx=(12, 0))

    def load_settings(self):
        try:
            settings_file = STATE_ROOT / 'settings.json'
            if not settings_file.exists():
                settings_file = ROOT / 'settings.json'
            data = json.loads(settings_file.read_text(encoding='utf-8'))
            self.destination.set(data.get('destination', self.destination.get()))
            if data.get('profile') in PROFILES:
                self.profile.set(data['profile'])
            if data.get('layout') in ('Klasör yapısını koru', 'Tek klasörde topla'):
                self.layout.set(data['layout'])
            for name in ('gif_lossless', 'keep_audio', 'copy_other', 'verify_video'):
                if isinstance(data.get(name), bool):
                    getattr(self, name).set(data[name])
            if data.get('schema_version', 1) < 2:
                self.copy_other.set(False)
        except (OSError, ValueError, TypeError):
            pass

    def save_settings(self):
        data = {name: getattr(self, name).get() for name in
                ('destination', 'profile', 'layout', 'gif_lossless', 'keep_audio', 'copy_other', 'verify_video')}
        try:
            STATE_ROOT.mkdir(parents=True, exist_ok=True)
            data['schema_version'] = 2
            (STATE_ROOT / 'settings.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        except OSError:
            pass

    def append_log(self, text):
        line = datetime.now().strftime('[%d.%m.%Y %H:%M:%S] ') + text + '\n'
        self.log_widget.configure(state='normal')
        self.log_widget.insert('end', line)
        self.log_widget.see('end')
        self.log_widget.configure(state='disabled')
        try:
            STATE_ROOT.mkdir(parents=True, exist_ok=True)
            with (STATE_ROOT / 'history.log').open('a', encoding='utf-8') as handle:
                handle.write(line)
        except OSError:
            pass

    def options(self):
        quality, lossless, crf = PROFILES[self.profile.get()]
        return Options(layout='flat' if self.layout.get() == 'Tek klasörde topla' else 'tree',
                       image_quality=quality, image_lossless=lossless, video_crf=crf,
                       gif_lossless=self.gif_lossless.get(), keep_audio=self.keep_audio.get(),
                       copy_other=self.copy_other.get(), verify_video=self.verify_video.get())

    def add_files(self):
        paths = filedialog.askopenfilenames(title='Dönüştürülecek dosyalar', filetypes=[
            ('Medya dosyaları', ' '.join('*' + ext for ext in sorted(SUPPORTED))), ('Tüm dosyalar', '*.*')])
        self.add_paths(paths)

    def add_folder(self):
        path = filedialog.askdirectory(title='Alt klasörleriyle birlikte kaynak klasör')
        if path:
            self.add_paths([path])

    def add_paths(self, paths):
        for path in paths:
            path = Path(path)
            if path not in self.paths:
                self.paths.append(path)
        self.sources_text.set(f'{len(self.paths)} kaynak seçildi  ·  ' + ', '.join(p.name for p in self.paths)[:75])
        self.detail_text.set('Klasörler alt klasörleriyle taranır. Orijinaller korunur; yalnızca dosyalar seçtiğiniz çıktı konumuna yazılır.')

    def clear(self):
        self.paths.clear()
        self.records.clear()
        self.tree.delete(*self.tree.get_children())
        self.sources_text.set('Henüz dosya seçilmedi')
        self.progress.set(0)
        self.stats.set('0 dosya  ·  0 B kaynak  ·  0 B çıktı')
        self.state_text.set('HAZIR')

    def choose_output(self):
        path = filedialog.askdirectory(title='Çıktıların kaydedileceği konum')
        if path:
            self.destination.set(path)

    def set_busy(self, busy):
        self.busy = busy
        for widget in [self.file_button, self.folder_button, self.clear_button, self.output_button,
                       self.output_entry, self.profile_menu, self.layout_menu, self.start_button,
                       self.zip_button, *self.switches]:
            widget.configure(state='disabled' if busy else 'normal')
        self.stop_button.configure(state='normal' if busy else 'disabled')
        self.pause_button.configure(state='normal' if busy else 'disabled', text='Sıra sonunda beklet')

    def start(self):
        if self.busy:
            return
        if not self.paths:
            messagebox.showinfo('Dosya seçin', 'Önce bir klasör veya dosya ekleyin.', parent=self)
            return
        if not self.destination.get().strip():
            messagebox.showerror('Konum seçin', 'Bir çıktı konumu seçin.', parent=self)
            return
        self.save_settings()
        self.tree.delete(*self.tree.get_children())
        self.records.clear()
        self.progress.set(0)
        self.session = None
        self.converter = Converter(self.options(), lambda event, data: self.events.put((event, data)))
        self.set_busy(True)
        self.state_text.set('Dosyalar taranıyor…')
        paths, destination, options = list(self.paths), Path(self.destination.get()), self.converter.options

        def work():
            try:
                session = destination.resolve()
                items, warnings = scan_inputs(paths, session, options)
                if not items:
                    raise ValueError('Seçimde dönüştürülecek veya kopyalanacak dosya bulunamadı.')
                session.mkdir(parents=True, exist_ok=True)
                self.events.put(('planned', {'items': items, 'session': session}))
                self.converter.run(items, session)
            except Exception as exc:
                self.events.put(('error', {'text': str(exc)}))
                self.events.put(('done', {'status': 'error', 'records': [], 'session': ''}))

        self.worker = threading.Thread(target=work, daemon=True)
        self.worker.start()

    def pause(self):
        if not self.converter:
            return
        if self.converter.resumed.is_set():
            self.converter.resumed.clear()
            self.pause_button.configure(text='Devam et')
            self.state_text.set('Bekletme istendi • Etkin işlem bitince yeni adıma geçilmeyecek')
        else:
            self.converter.resumed.set()
            self.pause_button.configure(text='Sıra sonunda beklet')
            self.state_text.set('Devam ediliyor…')

    def stop(self):
        if self.converter:
            self.converter.cancel()
            self.state_text.set('Durduruluyor… Etkin görsel kodlayıcısının dönmesi beklenebilir.')
            self.stop_button.configure(state='disabled')

    def poll(self):
        try:
            # Bound each GUI tick so a large directory never starves the event loop.
            for _ in range(100):
                event, data = self.events.get_nowait()
                if event == 'planned':
                    self.items, self.session = data['items'], data['session']
                    self.append_log(f'Dönüşüm başladı • {len(self.items)} dosya • Çıktı: {self.session}')
                    for index, item in enumerate(self.items):
                        self.tree.insert('', 'end', iid=str(index), values=(str(item.relative), item.target.suffix[1:].upper(),
                                         size(item.source.stat().st_size), '—', '—', 'Bekliyor'))
                elif event == 'begin':
                    self.current_index = data['index']
                    self.state_text.set(f'Dönüştürülüyor  {data["index"] + 1} / {data["total"]}  ·  {data["path"]}')
                    self.tree.set(str(data['index']), 'state', 'İşleniyor…')
                    self.tree.see(str(data['index']))
                elif event == 'file_progress':
                    self.progress.set((getattr(self, 'current_index', 0) + data['fraction']) / max(1, len(self.items)))
                elif event == 'phase':
                    self.state_text.set(data['text'])
                elif event == 'result':
                    index, record = data['index'], data['record']
                    self.records[index] = record
                    if record['status'] == 'ok':
                        self.append_log(f'{record["source"]} → {record["output"]} • {size(record["input_bytes"])} → {size(record["output_bytes"])} • {record.get("validation", {}).get("check", "")}')
                    else:
                        self.append_log(f'HATA • {record["source"]} • {record.get("error", "")}')
                    ok = record['status'] == 'ok'
                    saving = record.get('saved_percent', 0)
                    self.tree.set(str(index), 'after', size(record.get('output_bytes')))
                    self.tree.set(str(index), 'saving', f'%{saving:g}' if ok else '—')
                    self.tree.set(str(index), 'state', ('Tamamlandı' if saving >= 0 else 'Dosya büyüdü') if ok else 'Hata')
                    self.tree.item(str(index), tags=('ok' if saving >= 0 else 'larger',) if ok else ('error',))
                    self.progress.set((index + 1) / max(1, len(self.items)))
                    self.update_stats()
                elif event == 'error':
                    self.detail_text.set(data['text'])
                    self.append_log('HATA • ' + data['text'])
                    if not self.closing:
                        messagebox.showerror('Media Studio', data['text'], parent=self)
                elif event == 'done':
                    self.set_busy(False)
                    errors = sum(r['status'] != 'ok' for r in data['records'])
                    labels = {'completed': 'TAMAMLANDI', 'cancelled': 'DURDURULDU', 'error': 'HATA'}
                    self.state_text.set(f'{labels[data["status"]]}  ·  {len(data["records"])} işlendi  ·  {errors} hata')
                    for iid in self.tree.get_children():
                        if self.tree.set(iid, 'state') in ('Bekliyor', 'İşleniyor…'):
                            self.tree.set(iid, 'state', 'İşlenmedi')
                    if data['status'] == 'completed':
                        self.progress.set(1)
                    self.append_log(self.state_text.get())
                    if self.session:
                        self.detail_text.set(f'Çıktı: {self.session}  ·  ' + ('Hata ayrıntıları İşlem Geçmişi sekmesinde.' if errors else 'Yalnızca dönüştürülmüş dosyalar kaydedildi.'))
        except queue.Empty:
            pass
        if self.closing and (not self.worker or not self.worker.is_alive()):
            self.destroy()
        else:
            self.after(80, self.poll)

    def update_stats(self):
        successful = [r for r in self.records.values() if r['status'] == 'ok']
        before = sum(r['input_bytes'] for r in successful)
        after = sum(r['output_bytes'] for r in successful)
        percent = (1 - after / before) * 100 if before else 0
        self.stats.set(f'{len(successful)} başarılı  ·  {size(before)} → {size(after)}  ·  Toplam kazanç %{percent:.1f}')

    def selected_detail(self, _=None):
        selection = self.tree.selection()
        record = self.records.get(int(selection[0])) if selection else None
        if record:
            self.detail_text.set(record.get('error') or record.get('validation', {}).get('check', 'Tamamlandı'))

    def preview(self):
        selection = self.tree.selection()
        record = self.records.get(int(selection[0])) if selection else None
        if not record or record['status'] != 'ok':
            messagebox.showinfo('Karşılaştırma', 'Önce tamamlanmış bir dosya satırı seçin.', parent=self)
            return
        source, target = Path(record['source']), Path(record['output'])
        try:
            if target.suffix.lower() == '.webp':
                ImagePreview(self, source, target)
            else:
                window = ctk.CTkToplevel(self)
                window.title('Önce / Sonra • Medya dosyası')
                window.geometry('680x280')
                window.configure(fg_color=BG)
                self.label(window, 'İki dosyayı oynatıcınızda açarak görüntü ve hareketi karşılaştırın.').pack(pady=24)
                self.label(window, f'{size(record["input_bytes"])} → {size(record["output_bytes"])}').pack(pady=8)
                self.button(window, 'Orijinali aç', lambda: open_path(source)).pack(pady=8)
                self.button(window, 'Dönüştürülmüş dosyayı aç', lambda: open_path(target)).pack(pady=8)
        except Exception as exc:
            messagebox.showerror('Önizleme', str(exc), parent=self)

    def open_output(self):
        path = self.session or Path(self.destination.get())
        try:
            path.mkdir(parents=True, exist_ok=True)
            open_path(path)
        except OSError as exc:
            messagebox.showerror('Çıktı klasörü', str(exc), parent=self)

    def export_zip(self):
        if self.busy or not self.session or not self.records:
            messagebox.showinfo('ZIP oluştur', 'Önce bir dönüşüm tamamlayın.', parent=self)
            return
        destination = filedialog.asksaveasfilename(title='Çıktı arşivini kaydet', defaultextension='.zip',
                                                  initialfile=self.session.name + '.zip', filetypes=[('ZIP', '*.zip')])
        if not destination:
            return
        session = self.session
        selected = Path(destination).resolve()
        sources = {Path(r['source']).resolve() for r in self.records.values()}
        if selected in sources or selected == session or session in selected.parents:
            messagebox.showerror('ZIP konumu', 'Arşivi kaynak dosyanın veya çıktı klasörünün dışında kaydedin.', parent=self)
            return
        self.set_busy(True)
        self.pause_button.configure(state='disabled')
        self.stop_button.configure(state='disabled')
        self.state_text.set('ZIP oluşturuluyor…')

        files = [Path(record['output']) for record in self.records.values() if record['status'] == 'ok']

        def archive():
            temporary = selected.with_name(selected.name + '.partial')
            try:
                # Converted formats are already compressed; ZIP_STORED avoids wasted CPU.
                with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_STORED) as output:
                    for path in files:
                        output.write(path, path.relative_to(session))
                temporary.replace(selected)
                self.events.put(('phase', {'text': f'ZIP hazır: {selected}'}))
            except Exception as exc:
                self.events.put(('error', {'text': str(exc)}))
            finally:
                temporary.unlink(missing_ok=True)
                self.events.put(('done', {'status': 'completed', 'records': list(self.records.values()), 'session': str(session)}))
        self.worker = threading.Thread(target=archive, daemon=True)
        self.worker.start()

    def close(self):
        self.save_settings()
        self.closing = True
        if self.busy:
            self.stop()
        else:
            self.destroy()


if __name__ == '__main__':
    if len(sys.argv) == 3 and sys.argv[1] == '--self-test':
        from selftest import run
        raise SystemExit(run(Path(sys.argv[2])))
    Studio().mainloop()
