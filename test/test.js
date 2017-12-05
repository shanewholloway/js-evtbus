//const eb = require('evtbus')
const eb = require('../dist/evtbus')

const g = {}
eb.sink(g).subscribe('neato', 'keen', console.log)

eb.topic('neato').emit('keen', {y:1942})
