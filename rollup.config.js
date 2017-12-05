import pkg from './package.json'
import {minify} from 'uglify-es'
import rpi_uglify from 'rollup-plugin-uglify'
import rpi_babel from 'rollup-plugin-babel'

const sourcemap = 'inline'

const external = ['react']

const plugins = [jsy_plugin()]
const ugly = { compress: {warnings: false}, output: {comments: false}, sourceMap: false }
const prod_plugins = plugins.concat([rpi_uglify(ugly, minify)])

export default [
	{ input: 'code/index.jsy',
		output: [
      { file: pkg.main, format: 'cjs', exports:'named' },
      { file: pkg.module, format: 'es' }],
    sourcemap, external, plugins },

	{ input: 'code/index.jsy',
		output: { file: pkg.browser, format: 'amd', exports:'named' },
    external, plugins: prod_plugins },


	{ input: 'code/evtbus.jsy',
		output: [
      { file: 'dist/evtbus.js', format: 'cjs' },
      { file: 'dist/evtbus.mjs', format: 'es' }],
    sourcemap, external, plugins },

	{ input: 'code/evtbus.jsy',
		output: { file: 'dist/evtbus.amd.js', format: 'amd' },
    external, plugins: prod_plugins },


	{ input: 'code/react.jsy',
		output: [
      { file: 'dist/react.js', format: 'cjs' },
      { file: 'dist/react.mjs', format: 'es' }],
    sourcemap, external, plugins },

	{ input: 'code/react.jsy',
		output: { file: 'dist/react.amd.js', format: 'amd' },
    external, plugins: prod_plugins },

]


function jsy_plugin() {
  const jsy_preset = [ 'jsy/lean', { no_stage_3: true, modules: false } ]
  return rpi_babel({
    exclude: 'node_modules/**',
    presets: [ jsy_preset ],
    plugins: [],
    babelrc: false }) }

