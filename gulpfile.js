const pkg = require('./package.json');

const {rollup} = require('rollup');
const terser = require('@rollup/plugin-terser');
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve').default;

const gulp = require('gulp');

const banner = `/*!
* reveal.js-autotoc ${pkg.version}
* ${pkg.homepage}
* MIT licensed
*
* Copyright (C) 2022-2023 Jochen Wierum
*/\n`;

const babelConfig = {
    babelHelpers: 'bundled',
    ignore: ['node_modules'],
    compact: false,
    extensions: ['.js'],
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: 3,
                useBuiltIns: 'usage',
                modules: false,
                targets: {
                    browsers: [
                        'last 2 Chrome versions',
                        'last 2 Safari versions',
                        'last 2 iOS versions',
                        'last 2 Firefox versions',
                        'last 2 Edge versions',
                    ]
                }
            }
        ]
    ]
};

gulp.task('build', () =>
    rollup({
        input: './autotoc.js',
        plugins: [
            resolve(),
            commonjs(),
            babel({
                ...babelConfig,
                ignore: [/node_modules\/(?!(highlight\.js|marked)\/).*/],
            }),
            terser()
        ]
    }).then(bundle =>
        Promise.all([
            bundle.write({
                file: './dist/autotoc.esm.js',
                name: 'AutoToc',
                format: 'es'
            }),

            bundle.write({
                file: './dist/autotoc.js',
                name: 'AutoToc',
                format: 'umd'
            })])
    )
);

gulp.task('default', gulp.series('build'));

