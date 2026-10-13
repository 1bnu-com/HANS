// Usage: node render.mjs spec.json out.mp4            -> full video
//        node render.mjs spec.json still.jpg --at 5.0 -> single frame
import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const [specPath, outPath, flag, atVal] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const FPS = 24;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#fff}</style></head><body>
${spec.template === 'story'
  ? `<script>${readFileSync(resolve(here, 'story.js'), 'utf8')}</script>`
  : spec.template === 'motion'
  ? `<script>${readFileSync(resolve(here, 'motion.js'), 'utf8')}</script>`
  : `<script>${readFileSync(resolve(here, 'engine.js'), 'utf8')}</script><script>${readFileSync(resolve(here, 'scene.js'), 'utf8')}</script>`}</body></html>`;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.setContent(html);
const { duration } = await page.evaluate(s => window.setup(s), spec);

const grab = async t => Buffer.from((await page.evaluate(t => window.frame(t), t)).split(',')[1], 'base64');

if (flag === '--at') {
  writeFileSync(outPath, await grab(parseFloat(atVal)));
  console.log('still written', outPath);
} else {
  const total = Math.round(duration * FPS);
  const music = resolve(here, 'music.m4a');
  const args = ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  let hasMusic = false;
  try { readFileSync(music); hasMusic = true; } catch {}
  if (hasMusic) args.push('-i', music, '-shortest', '-c:a', 'aac', '-b:a', '160k');
  args.push('-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-r', String(FPS), '-movflags', '+faststart', outPath);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = ''; ff.stderr.on('data', d => { err += d; if (err.length > 20000) err = err.slice(-10000); });
  const t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const buf = await grab(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 48 === 0) console.log(`frame ${i}/${total} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on('close', r));
  if (code !== 0) { console.error(err.slice(-3000)); process.exit(1); }
  console.log('video written', outPath, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
await browser.close();
