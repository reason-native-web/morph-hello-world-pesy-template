const Fs = require("fs");
const Path = require("path");

const name_to_string = name => {
  switch (name) {
    case "<PACKAGE_NAME_UPPER_CAMEL>":
      return "MorphPesyTemplate";
    case "<PACKAGE_NAME_FULL>":
      return "morph_pesy_template";
    case "<PUBLIC_LIB_NAME>":
      return "./library";
    case "<TEST_LIB_NAME>":
      return "./test";
    default:
      return name;
  }
};

const name_to_filename = name => {
  switch (name) {
    case "__PACKAGE_NAME_UPPER_CAMEL__":
      return "MorphPesyTemplate";
    case "__PACKAGE_NAME_FULL__":
      return "morph_pesy_template";
    case "__PUBLIC_LIB_NAME__":
      return "library";
    case "__TEST_LIB_NAME__":
      return "test";
    default:
      return name;
  }
};

const names = [
  "<PACKAGE_NAME_UPPER_CAMEL>",
  "<PACKAGE_NAME_FULL>",
  "<PUBLIC_LIB_NAME>",
  "<TEST_LIB_NAME>"
];

const fileNames = ["__PACKAGE_NAME_UPPER_CAMEL__", "__PACKAGE_NAME_FULL__"];

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
