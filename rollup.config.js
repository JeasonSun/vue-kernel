import path from "path";
import ts from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import resolvePlugin from "@rollup/plugin-node-resolve";

if (!process.env.TARGET) {
  throw new Error("TARGET package must be specified via --environment flag");
}

const packagesDir = path.resolve(__dirname, "packages");
const packageDir = path.resolve(packagesDir, process.env.TARGET);
const resolve = (p) => path.resolve(packageDir, p);
const pkg = require(resolve("package.json"));
const packageOptions = pkg.buildOptions || {};
const name = packageOptions.filename || path.basename(packageDir);

const outputConfig = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  "esm-browser": {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife",
  },
};

const defaultFormats = ["esm-bundler", "cjs"];
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(",");
const packageFormats =
  inlineFormats || packageOptions.formats || defaultFormats;

const packageConfigs = packageFormats.map((format) =>
  createConfig(format, outputConfig[format])
);

export default packageConfigs;

function createConfig(format, output) {
  if (!output) {
    console.error(`invalid format: "${format}"`);
    return process.exit(1);
  }
  const isGlobalBuild = /global/.test(format);
  if (isGlobalBuild) {
    output.name = packageOptions.name;
  }

  // output.sourcemap = !!process.env.SOURCE_MAP
  output.sourcemap = true;

  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      resolvePlugin(),
      commonjs(),
    ],
    onwarn: (msg, warn) => {
      // 忽略Circular的提醒
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    },
  };
}
