const nodePandoc = require("node-pandoc");
const { readFile } = require("fs/promises");
const fs = require("fs");
let publications;
async function loadData() {
  publications = JSON.parse(await readFile("./publications.json"));
  console.log(publications);
}
loadData().then(() => {
  publications.forEach((publication) => markdownToHTML(publication));
});
function markdownToHTML(publication) {
  const src = publication.src;
  const fileName = publication.name;
  const args = [
    "-f",
    "markdown",
    "-t",
    "html",
    "--template",
    "./templates/template.html",
    "-o",
    `./html/${fileName}.html`,
  ];
  publication.HTMLsrc = `../convert/html/${fileName}.html`;
  const updatedJSONData = JSON.stringify(publications, null, 2);
  fs.writeFileSync("./publications.json", updatedJSONData);

  nodePandoc(src, args, (err, result) => {
    if (err) {
      console.error("Conversion error:", err);
    } else {
      console.log("Conversion successful:", result);
    }
  });
}
