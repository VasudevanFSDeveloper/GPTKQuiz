import re
import os

with open('index.backup.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. CSS
css_match = re.search(r'<style>([\s\S]*?)<\/style>', html)
if css_match:
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(css_match.group(1).strip())

# 2. JS
js_match = re.search(r'<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>', html)
if js_match:
    js_code = js_match.group(1).strip()
    
    imports = '''import React, { useState, useEffect, useRef, useMemo } from 'react';
import './index.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

'''
    
    js_code = re.sub(r'const\s*\{\s*useState\s*,\s*useEffect\s*,\s*useRef\s*\}\s*=\s*React;', '', js_code)
    js_code = re.sub(r'ReactDOM\.createRoot\([\s\S]*?\)\.render\(<App\/>\);', '', js_code)
    js_code += '\n\nexport default App;\n'
    
    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(imports + js_code)

# 3. HTML
vite_html = '''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GPTKQuiz — University Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arima:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="stars1"></div>
    <div class="stars2"></div>
    <div class="stars3"></div>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(vite_html)

# 4. main.jsx
main_jsx = '''import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);'''

with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(main_jsx)

print('Extraction complete')
