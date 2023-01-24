const { build } = require("esbuild");
const { readFileSync, writeFileSync } = require("fs");
const pkg = require("./package.json");

const dependencies = Object.keys(pkg.dependencies ?? {});
const peerDependencies = Object.keys(pkg.peerDependencies ?? {});

const external = [...dependencies, ...peerDependencies];

const entryFile = "src/index.ts";
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  external,
  logLevel: "info",
  minify: true,
  sourcemap: false,
};

build({
  ...shared,
  format: "esm",
  outfile: pkg.module,
  target: ["ES6"],
}).then(() => {
  const f = readFileSync("./dist/esm/index.js").toString();
  // replace import X from 'React' to const X = window.React
  const replaced = f.replace(
    /import\s+(\w+)\s+from['"]react['"]/g,
    "const $1=window.React"
  );

  // replace import X from 'styled-components' to const X = window.styled
  const replaced2 = replaced.replace(
    /import\s+(\w+)\s+from['"]styled-components['"]/g,
    "const $1=window.styled"
  );
  writeFileSync("./dist/esm/index.js", replaced2);
});
