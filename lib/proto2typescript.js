"use strict";

/* eslint-disable no-console */

// Import in commondjs style
const dust = require("dustjs-linkedin");
const fs = require("fs");
const _ = require("lodash");
const protobuf = require("protobufjs");

initializeDustJS();

// Load dust templates
loadDustTemplate("module");
loadDustTemplate("object");

/**
 * @param {string} filePath path of *.json file or *.proto file
 * @param {(err, out: string) => void} callback
 */
module.exports = function (filePath, options, callback) {
  // Load the json file
  let model;

  try {
    model = protobuf.loadSync(filePath);
    model.resolveAll();
  }
  catch (e) {
    callback(e, null);
    return;
  }

  // convert from new json(pbjs6) to old json(pbjs5) format
  // convertNamespace(model);

  const globalContext = {
    options,
    // context helper in context of Field
    classFieldType,
    // context helper in context of Field
    interfaceFieldType,
    // context helper in context of ReflectionObject
    isType,
    // context helper in context of ReflectionObject
    isEnum,
    // context helper in context of Enum
    enumValues,
  };
  const context = dust.makeBase(globalContext).push(model);

  // Render the model
  dust.render("module", context, function (err, out) {
    callback(err, out);
  });
};

// --------------------------- functions -----------------------

function loadDustTemplate(name) {
  const template = fs.readFileSync(__dirname + "/../templates/" + name + ".dust", "UTF8");
  const compiledTemplate = dust.compile(template, name);
  dust.loadSource(compiledTemplate);
}

function initializeDustJS() {
  // Keep line breaks
  // dust.optimizers.format = function (ctx, node) {
  //   return node;
  // };
  dust.config.whitespace = true;

  // strip first character if dot (.)
  dust.filters.toModuleName = function (value) {
    if (!value) {
      return "";
    }
    return (value[0] === ".") ? value.slice(1) : value;
  };

  // Create view filters
  dust.filters.firstLetterInUpperCase = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  dust.filters.firstLetterInLowerCase = function (value) {
    return value.charAt(0).toLowerCase() + value.slice(1);
  };

  dust.filters.camelCase = function (value) {
    return value.replace(/(_[a-zA-Z])/g, function (match) {
      return match[1].toUpperCase();
    });
  };
}

function convertBasicType(typeName, options) {
  switch (typeName.toLowerCase()) {
  case "string":
    return "string";

  case "bool":
    return "boolean";

  case "bytes":
    return options.bytes;

  case "double":
  case "float":
  case "int32":
  case "int64":
  case "uint32":
  case "uint64":
  case "sint32":
  case "sint64":
  case "fixed32":
  case "fixed64":
  case "sfixed32":
  case "sfixed64":
    return "number";

  // message or enum
  default:
    return "";
  }
}

// helper

/**
 * context helper: true if current context is Type
 * context: ReflectionObject
 */
function isType(chunk, context, bodies, params) {
  const reflectionObject = context.current();
  return reflectionObject instanceof protobuf.Type;
}

/**
 * context helper: true if current context is Enum
 * context: ReflectionObject
 */
function isEnum(chunk, context, bodies, params) {
  const reflectionObject = context.current();
  return reflectionObject instanceof protobuf.Enum;
}

/**
 * context helper: get value array of Enum (convert "values" object to array)
 * context: ReflectionObject
 * @returns {{ name: string, value: number }[]}
 */
function enumValues(chunk, context, bodies, params) {
  const values = context.get("values");
  const valueArray = _.map(values, (value, key) => ({ name: key, value }));
  return valueArray;
}

/**
 * context helper: get field type name of interface
 * context: Field
 */
function classFieldType(chunk, context, bodies, params) {
  const type = context.get("type");
  const options = context.get("options");

  const result = convertBasicType(type, options);
  // if result is empty, it's Type or Enum
  return chunk.write(result || type);
}

/**
 * context helper: get field type name of interface
 * context: Field
 */
function interfaceFieldType(chunk, context, bodies, params) {
  const type = context.get("type");
  const options = context.get("options");

  const result = convertBasicType(type, options);
  if (result) {
    return chunk.write(result);
  }

  const resolvedType = context.get("resolvedType");
  if (!resolvedType) {
    return chunk;
  }

  // filter enum type
  if (resolvedType instanceof protobuf.Enum) {
    return chunk.write(type);
  }

  // By default, it's a message "interface" identifier
  return chunk.write(messageNameToInterfaceName(type));
}

/** e.g. Protocols.Message -> Protocols.IMessage */
function messageNameToInterfaceName(value) {
  const lastDotIndex = value.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "I" + value;
  }

  const result = value.slice(0, lastDotIndex) + ".I" + value.slice(lastDotIndex + 1);
  return result;
}
