import path from 'path'
import ts from 'rollup-plugin-typescript2'
// import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolvePlugin from '@rollup/plugin-node-resolve'

console.log(process.env.TARGET);

if(!process.env.TARGET){
  throw new Error('TARGET package must be specified via --environment flag')
}
