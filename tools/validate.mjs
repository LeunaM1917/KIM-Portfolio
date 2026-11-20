// Run with: node tools/validate.mjs (Node.js only; no packages required).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('index.html');
const projects = vm.runInNewContext(`${read('projects.js')}\nJSON.stringify(projectsData);`);
const data = JSON.parse(projects);
let assets = 0;

function localAsset(reference) {
    if (/^(https?:|mailto:|tel:|#)/i.test(reference)) return;
    const clean = decodeURIComponent(reference.split('?')[0]);
    assert.ok(clean && !clean.startsWith('/'), `Use a relative GitHub Pages asset path: ${reference}`);
    let directory = root;
    for (const part of clean.split('/')) {
        assert.ok(part !== '..' && fs.readdirSync(directory).includes(part), `Missing asset or case mismatch: ${reference}`);
        directory = path.join(directory, part);
    }
    assert.ok(fs.statSync(directory).isFile(), `Expected a file: ${reference}`);
    assert.ok(fs.statSync(directory).size > 0, `Empty asset: ${reference}`);
    assets++;
}

for (const match of html.matchAll(/\b(?:src|href|data-image)="([^"]+)"/g)) localAsset(match[1]);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate element IDs');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing section target: ${match[1]}`);
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Exactly one page heading is required');
assert.equal((html.match(/class="cert-card /g) || []).length, 9, 'Keep all nine certificates');
assert.equal((html.match(/data-filter="/g) || []).length, 4, 'Keep all four gallery filters');
assert.ok(!/\bBSIT\b|\b(?:first|second|third)[- ]year\b|\bstudent\b|birthday|marital status/i.test(html), 'Remove student identity and unrelated demographics');
assert.ok(!/href="(?:#|https:\/\/www\.(?:linkedin|facebook)\.com\/)"/.test(html), 'Remove placeholder links');
assert.ok(html.includes('name="description"') && html.includes('property="og:image"') && html.includes('name="twitter:card"'), 'SEO/social metadata is required');
assert.ok(html.includes('id="experience"') && html.includes('Freelance Experience'), 'Freelance experience section is required');

const projectIds = new Set();
const totals = { video: 0, image: 0, software: 0 };
for (const project of data) {
    assert.ok(!projectIds.has(project.id), `Duplicate project ID: ${project.id}`);
    projectIds.add(project.id);
    assert.ok(Object.hasOwn(totals, project.category), `Unknown category: ${project.category}`);
    totals[project.category]++;
    for (const reference of [project.src, project.thumbnail, ...(project.images || [])].filter(Boolean)) localAsset(reference);
    if (project.category === 'video') {
        assert.ok(project.src.endsWith('.mp4') && project.thumbnail, `Video needs finished MP4 and real thumbnail: ${project.title}`);
        assert.ok(project.height > project.width, `Expected a vertical video: ${project.title}`);
    }
    if (project.category !== 'software') assert.ok(project.description && project.tools?.length, `Creative card needs a description and tools: ${project.title}`);
}
const expectedSoftware = { NeighborHelp: 42, RentiFi: 16, VitalDrop: 53 };
const software = data.filter(project => project.category === 'software');
assert.deepEqual(software.map(project => project.title), Object.keys(expectedSoftware), 'Keep the original software projects');
for (const project of software) assert.equal(project.images.length, expectedSoftware[project.title], `Keep every ${project.title} screenshot`);
for (const name of ['projects.js', 'script.js', 'style-switcher.js']) new vm.Script(read(name), { filename: name });
console.log(`Passed: ${data.length} projects (${totals.video} videos, ${totals.image} images, ${totals.software} software), 111 retained screenshots, 9 certificates, ${assets} local asset references, JavaScript syntax, navigation targets, content and metadata.`);
