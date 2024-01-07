import {rollup} from 'rollup';
import {default as terser} from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import {default as commonjs} from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import gulp from 'gulp';

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
            nodeResolve(),
            commonjs(),
            babel({
                ...babelConfig,
                ignore: [/node_modules\/.*/],
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

