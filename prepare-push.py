#!/usr/bin/env python3
r"""Build ASCII-safe push_files payloads for pohela-boishakh-bd.

Reads the build files, emits one JSON file per chunk under /tmp/pbbd-push/
with ensure_ascii=True (Bengali -> unicode escapes), each under 90KB.
Prints the file list, per-chunk sizes, and the github push command template.
Does NOT push anything itself. Binary smoke screenshots are NOT pushed
(the push API cannot carry binaries).
"""
import json, os

BUILD = os.path.expanduser('~/workspace/muse-project-factory/builds/pohela-boishakh-bd')
OUT = '/tmp/pbbd-push'
FILES = [
    'index.html',
    'css/style.css',
    'js/data.js',
    'js/logic.js',
    'js/app.js',
    'tests/test.js',
    'tests/smoke.mjs',
    'README.md',
    'TEST_RESULTS.md',
    '.gitignore',
]

def read(p):
    with open(os.path.join(BUILD, p), 'r', encoding='utf-8') as f:
        return f.read()

def main():
    os.makedirs(OUT, exist_ok=True)
    entries = []
    for p in FILES:
        content = read(p)
        entries.append({'path': p, 'content': content})
        print(f'{p}: {len(content.encode("utf-8"))} bytes utf-8, '
              f'{len(json.dumps(content, ensure_ascii=True)) - 2} bytes ascii-escaped content')

    # Chunking: keep each push JSON under ~90KB.
    # Chunk A: shell + css + data + logic + gitignore. Chunk B: app + tests + docs.
    chunks = [
        ('chunk-a', entries[:4] + [entries[9]], 'pohela-boishakh-bd factory run #442 (1/2): shell + css + data + logic'),
        ('chunk-b', entries[4:9], 'pohela-boishakh-bd factory run #442 (2/2): app + tests + docs'),
    ]
    for name, chunk_files, message in chunks:
        payload = {
            'owner': 'fahad3235',
            'repo': 'pohela-boishakh-bd',
            'branch': 'main',
            'message': message,
            'files': chunk_files,
        }
        text = json.dumps(payload, ensure_ascii=True)
        out_path = os.path.join(OUT, name + '.json')
        with open(out_path, 'w', encoding='ascii') as f:
            f.write(text)
        print(f'{name}: {len(text)} bytes -> {out_path} '
              f'({"OK" if len(text) < 90000 else "TOO BIG"})')
        assert all(ord(c) < 128 for c in text), 'non-ascii leaked into ' + name
    print('All payloads ASCII-safe.')

if __name__ == '__main__':
    main()
