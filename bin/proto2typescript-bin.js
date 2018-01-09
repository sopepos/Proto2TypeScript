#!/usr/bin/env node

/* eslint-disable no-console */
const argv = require("yargs")
  .usage("Convert a ProtoBuf.js JSON description in TypeScript definitions.\nUsage: $0 <options>")

  .demandOption("f")
  .alias("f", "file")
  .describe("f", "The JSON file")

  .boolean("noCtor")
  .describe("noCtor", "Don't generate constructor")

  .boolean("noCreate")
  .describe("noCreate", "Don't generate create() method")

  .boolean("noCoding")
  .describe("noCoding", "Don't generate encode()/decode() methods")

  .boolean("noInherit")
  .describe("noInherit", "Don't inherit Message<T>")

  .string("m")
  .alias("m", "moduleName")
  .describe("m", "Top level module name")

  .help()
  .argv;

const fs = require("fs");
const proto2typescript = require("../lib/proto2typescript");

const fileContent = fs.readFileSync(argv.file);

proto2typescript(
  fileContent,
  {
    noCtor: argv.noCtor,
    noCreate: argv.noCreate,
    noCoding: argv.noCoding,
    noInherit: argv.noInherit,
    moduleName: argv.moduleName,
  },
  function (err, out) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    else {
      process.stdout.write(out);
    }
  }
);
