const Fs = require("fs");
const Path = require("path");

const name_to_string = name => {
  switch (name) {
    case "MorphPesyTemplate":
      return "<PACKAGE_NAME_UPPER_CAMEL>";
    case "morph_pesy_template":
      return "<PACKAGE_NAME_FULL>";
    case "./library":
      return "<PUBLIC_LIB_NAME>";
    case "./test":
      return "<TEST_LIB_NAME>";
    default:
      return name;
  }
};

const name_to_filename = name => {
  switch (name) {
    case "MorphPesyTemplate":
      return "__PACKAGE_NAME_UPPER_CAMEL__";
    case "morph_pesy_template":
      return "__PACKAGE_NAME_FULL__";
    case "library":
      return "__PUBLIC_LIB_NAME__";
    case "test":
      return "__TEST_LIB_NAME__";
    default:
      return name;
  }
};

const names = [
  "MorphPesyTemplate",
  "morph_pesy_template",
  "./library",
  "./test"
];

const fileNames = ["MorphPesyTemplate", "morph_pesy_template"];

const packageJson = names.reduce(
  (acc, curr) => {
    console.log(`'${curr}' - '${name_to_string(curr)}'`);
    return acc.replace(new RegExp(curr, "g"), name_to_string(curr));
  },
  Fs.readFileSync(Path.resolve("package.json"), {
    encoding: "utf8"
  })
);

Fs.writeFileSync("package.json", packageJson, { encoding: "utf8" });

const renameFiles = baseDir => {
  Fs.readdirSync(baseDir, { encoding: "utf8" })
    .filter(file => fileNames.some(n => file.includes(n)))
    .map(prev => {
      const next = fileNames.reduce((acc, curr) => {
        console.log(`'${curr}' - '${name_to_filename(curr)}'`);
        return acc.replace(new RegExp(curr, "g"), name_to_filename(curr));
      }, prev);
      return { prev, next };
    })
    .forEach(({ prev, next }) => {
      Fs.renameSync(Path.join(baseDir, prev), Path.join(baseDir, next));
    });
};

renameFiles(".");
renameFiles("testExe");
renameFiles("bin");
