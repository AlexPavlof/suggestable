import flow       from 'rollup-plugin-flow';
import babel      from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint';
import pkg        from './package.json';

const plugins = [
    eslint(),
    flow(),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
            ['@babel/env', { modules: false }],
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties',
        ],
    }),
];
let outputs = [{
    file:    pkg.main,
    name:    'Suggestable',
    exports: 'named',
    format:  'umd',

}, {
    file:   pkg.module,
    format: 'esm',

}];

if (process.env.BUILD === 'production') {
    plugins.push(uglify());

    outputs = {
        file:    'build/Suggestable.min.js',
        name:    'Suggestable',
        exports: 'named',
        format:  'umd',
    };
}

export default {
    input:  'src/Suggestable.js',
    output: outputs,
    plugins,
};
