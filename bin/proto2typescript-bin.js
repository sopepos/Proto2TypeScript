#!/usr/bin/env node

/* eslint-disable no-console */
const argv = require("yargs")
  .usage("Convert a ProtoBuf.js JSON description in TypeScript definitions.\nUsage: $0 <options>")

  .demandOption("f")
  .alias("f", "file")
  .describe("f", "The JSON file")

  .boolean("noCreate")
  .describe("noCreate", "Don't generate create() method")

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
    noCreate: argv.noCreate,
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
