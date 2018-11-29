#!/usr/bin/env node

/* eslint-disable no-console */
const argv = require("yargs")
  .usage("Convert a proto file or ProtoBuf.js JSON description to TypeScript definitions.\nUsage: $0 <options>")

  .demandOption("f")
  .alias("f", "file")
  .describe("f", "*.json or *.proto file")

  .boolean("noCtor")
  .describe("noCtor", "Don't generate constructor")

  .boolean("noCreate")
  .describe("noCreate", "Don't generate create() method")

  .boolean("noCoding")
  .describe("noCoding", "Don't generate encode()/decode() methods")

  .boolean("noInherit")
  .describe("noInherit", "Don't inherit Message<T>")

  .string("bytes")
  .default("bytes", "Uint8Array")
  .describe("bytes", "Set type name of \"bytes\" field")

  .help()
  .argv;

const proto2typescript = require("../lib/proto2typescript");

proto2typescript(
  argv.file,
  {
    noCtor: argv.noCtor,
    noCreate: argv.noCreate,
    noCoding: argv.noCoding,
    noInherit: argv.noInherit,
    bytes: argv.bytes,
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
