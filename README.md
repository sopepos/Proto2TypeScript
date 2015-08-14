Proto2TypeScript
================

This tool generate TypeScript definitions for your Protocol Buffers models, when you use the excellent [ProtoBuf.js](https://github.com/dcodeIO/ProtoBuf.js/) library.

### Installation
```sh
npm install proto2typescript -g
```

### Usage
```sh
# Parse and convert the proto file to json using pbjs (from ProtoBuf.js)
pbjs model.proto > model.json

# Convert the model to TypeScript definitions
proto2typescript --file model.json > model.d.ts
```

### Options
```
Options:
  -f, --file              The JSON file                                       [required]
  -c, --camelCaseGetSet   Generate getter and setters in camel case notation  [default: true]
  -u, --underscoreGetSet  Generate getter and setters in underscore notation  [default: false]
  -p, --properties        Generate properties                                 [default: true]
```

### Why ?

Because intelligent code completion is cool :-)

![](http://i.imgur.com/evVnEM5.png "Example in sublime text")

### Requirements

It is a Node.js project. The sourcecode is written in TypeScript, but the JavaScript output is present in the repository.

If you want to run the tests, you need bash, mocha and typescript.

```sh
npm install mocha -g
npm install typescript -g
```

In order to run tests:

```sh
./runTests.sh
```

### Acknowledgements

This code is developed in context of the [BRIDGE](http://www.bridgeproject.eu/en) project.

### Licence

The source code of this tool is licenced under the MIT License.
