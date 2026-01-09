const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "files");
const OUT = path.join(__dirname, "docs");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// Render pages
const pagesDir = path.join(SRC, "pages");
for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith(".ejs")) continue;

  const name = file.replace(".ejs", "");
  const html = ejs.render(
    fs.readFileSync(path.join(pagesDir, file), "utf8"),
    {},
    { filename: path.join(pagesDir, file) } // IMPORTANT for includes
  );

  fs.writeFileSync(path.join(OUT, `${name}.html`), html);
}

// Copy static assets
copyDir(path.join(SRC, "assets"), path.join(OUT, "assets"));

console.log("Build complete → /docs");
