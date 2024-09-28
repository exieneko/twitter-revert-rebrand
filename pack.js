const fs = require('fs');
const path = require('path');
const Zip = require('adm-zip');

if (fs.existsSync('dist/temp')) {
    fs.rmSync('dist/temp', { recursive: true });
}

fs.cpSync('dist/twitter-revert-rebrand', 'dist/temp', { recursive: true });

let manifest = JSON.parse(fs.readFileSync(path.join('dist/temp', 'manifest.json')));

manifest.browser_specific_settings = {
    gecko: {
        id: 'twitter-revert-rebrand@a.a'
    }
};

fs.writeFileSync(path.join('dist/temp', 'manifest.json'), JSON.stringify(manifest, null, 4));

if (fs.existsSync('dist/twitter-revert-rebrand-chromium.zip')) {
    fs.unlinkSync('dist/twitter-revert-rebrand-chromium.zip');
}

if (fs.existsSync('dist/twitter-revert-rebrand-firefox.zip')) {
    fs.unlinkSync('dist/twitter-revert-rebrand-firefox.zip');
}

const chromiumZip = new Zip();
chromiumZip.addLocalFolder('dist/twitter-revert-rebrand');
chromiumZip.writeZip('dist/twitter-revert-rebrand-chromium.zip');

const firefoxZip = new Zip();
firefoxZip.addLocalFolder('dist/temp');
firefoxZip.writeZip('dist/twitter-revert-rebrand-firefox.zip');

fs.rmSync('dist/temp', { recursive: true });
