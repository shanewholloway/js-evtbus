import pkg from './package.json'
import {minify} from 'uglify-es'
import rpi_uglify from 'rollup-plugin-uglify'
import rpi_resolve from 'rollup-plugin-node-resolve'
import rpi_jsy from 'rollup-plugin-jsy-babel'

const sourcemap = 'inline'
const external = ['react']

const plugins = [rpi_resolve({module: true, jsnext: true}), rpi_jsy()]
const ugly = { compress: {warnings: false}, output: {comments: false}, sourceMap: false }
const prod_plugins = plugins.concat([rpi_uglify(ugly, minify)])

export default [
	{ input: 'code/index.jsy',
		output: [
      { file: pkg.main, format: 'cjs', sourcemap, exports:'named' },
      { file: pkg.module, format: 'es', sourcemap }],
    external, plugins },

	{ input: 'code/evtbus.jsy',
		output: [
      { file: 'cjs/evtbus.js', format: 'cjs', sourcemap },
      { file: 'esm/evtbus.js', format: 'es', sourcemap },
      { file: 'umd/evtbus.js', format: 'umd', sourcemap, name: 'evtbus' },
    ],
    external, plugins },

	{ input: 'code/react.jsy',
		output: [
      { file: 'cjs/react.js', format: 'cjs', sourcemap },
      { file: 'esm/react.js', format: 'es', sourcemap },
      { file: 'umd/react.js', format: 'umd', sourcemap, name: 'evtbus' },
    ],
    external, plugins },


  prod_plugins &&
    { input: 'code/index.jsy',
      output: { file: pkg.browser, format: 'umd', name: 'evtbus-all', exports:'named' },
      external, plugins: prod_plugins },

  prod_plugins &&
    { input: 'code/evtbus.jsy',
      output: { file: 'umd/evtbus.min.js', format: 'umd', name: 'evtbus' },
      external, plugins: prod_plugins },

  prod_plugins &&
    { input: 'code/react.jsy',
      output: { file: 'umd/react.min.js', format: 'umd', name: 'evtbus' },
      external, plugins: prod_plugins },

].filter(e=>e)
