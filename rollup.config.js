const typescript = require('@rollup/plugin-typescript');
const copy = require('rollup-plugin-copy');
const terser = require('@rollup/plugin-terser');

module.exports = {
    input: {
        content: 'src/content.ts'
    },
    output: {
        dir: 'dist/twitter-revert-rebrand',
        format: 'esm'
    },
    plugins: [
        typescript(),
        copy({ targets: [{ src: 'public/*', dest: 'dist/twitter-revert-rebrand' }] }),
        terser()
    ]
};
