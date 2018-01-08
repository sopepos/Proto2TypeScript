"use strict";

/* eslint-disable no-console */

// Import in commondjs style
const dust = require("dustjs-linkedin");
const fs = require("fs");
const _ = require("lodash");

initializeDustJS();

// Load dust templates
loadDustTemplate("module");
loadDustTemplate("interface");
loadDustTemplate("enum");

const globalContext = {};

module.exports = function (inputStr, options, callback) {
  // Load the json file
  var model;
  try {
    model = JSON.parse(inputStr);
  }
  catch (e) {
    callback("Input doesn't look like a JSON!", null);
  }

  // override package name(module name)
  model.package = options.moduleName || model.package;

  // convert from new json(pbjs6) to old json(pbjs5) format
  convertNamespace(model);

  // Generates the names of the model
  generateNames(model, model.package);

  globalContext.options = options;
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

  dust.filters.convertType = function (value) {
    switch (value.toLowerCase()) {
    case "string":
      return "string";
    case "bool":
      return "boolean";
    case "bytes":
      return "ByteBuffer";
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
    }
    // By default, it's a message identifier
    return value;
  };

  dust.filters.optionalFieldDeclaration = function (value) {
    return value === "optional" ? "?" : "";
  };

  dust.filters.repeatedType = function (value) {
    return value === "repeated" ? "[]" : "";
  };
}

function isMessage(obj) {
  return "fields" in obj;
}

function isEnum(obj) {
  return "values" in obj;
}

function isNamespace(obj) {
  return "nested" in obj;
}

function convertEnum(obj) {
  const newValues = [];

  _.forOwn(obj.values, (value, key) => {
    const enumValue = { name: key, id: value };
    newValues.push(enumValue);
  });

  obj.values = newValues;
}

function convertMessage(obj) {
  const newFields = [];

  _.forOwn(obj.fields, (field, key) => {
    field.name = key;
    newFields.push(field);
  });

  obj.fields = newFields;
}

// convert from new json(pbjs6) to old json(pbjs5) format
function convertNamespace(model) {
  const messages = [];
  const enums = [];

  _.forOwn(model.nested, (obj, key) => {
    obj.name = key;

    const _isNamespace = isNamespace(obj);
    const _isMessage = isMessage(obj);
    const _isEnum = isEnum(obj);

    if (_isNamespace) {
      convertNamespace(obj);
    }

    if (_isMessage) {
      convertMessage(obj);
    }

    if (_isNamespace || _isMessage) {
      messages.push(obj);
    }

    if (_isEnum) {
      convertEnum(obj);
      enums.push(obj);
    }
  });

  if (messages.length) {
    model.messages = messages;
  }
  if (enums.length) {
    model.enums = enums;
  }
  delete model.nested;
}

// Generate the names for the model, the types, and the interfaces
function generateNames(model, prefix, name) {
  if (prefix || name) {
    model.fullPackageName = (prefix || "") + (prefix && name ? "." : "") + (name || "");
  }

  // Generate names for messages
  // Recursive call for all messages
  for (const key in model.messages) {
    const message = model.messages[key];

    generateNames(message, model.fullPackageName, model.name);
  }

  // Generate names for enums
  for (const key in model.enums) {
    const currentEnum = model.enums[key];

    if (model.fullPackageName || model.name) {
      currentEnum.fullPackageName =
        (model.fullPackageName || "") +
        (model.fullPackageName && model.name ? "." : "") +
        (model.name || "");
    }
  }
}
