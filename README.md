Pbjs2TypeScript (Proto2TypeScript)
================

This tool generate TypeScript definitions for your Protocol Buffers models, when you use the excellent [ProtoBuf.js](https://github.com/dcodeIO/ProtoBuf.js/) library.

UPDATES -- Difference from [aliok/Proto2TypeScript](https://github.com/aliok/Proto2TypeScript)
================

This fork version:
* Added support for *.proto and protobufjs (only) 6.x json format
* Rewrote code in ES6 syntax
* Separated data interface from Message class
```typescript
export interface IAwesomeMessage {
  awesome_field: number;
}

export class AwesomeMessage extends protobuf.Message<AwesomeMessage> implements IAwesomeMessage {
  public awesome_field: number;
  ...
}
```
* Removed `-c`, `-u`, `-p` options
* Added `--noCtor`, `--noCreate`, `--noCoding`, `--noInherit`, `--bytes` options
  * `--noCtor`: Don't generate `constructor`
  * `--noCreate`, Don't generate `create()` method
  * `--noCoding`: Don't generate `encode()`/`decode()` methods
  * `--noInherit`: Don't inherit `Message<T>` class
  * `--bytes`: Set type name of "bytes" field. (default: Uint8Array)


UPDATES ([aliok/Proto2TypeScript](https://github.com/aliok/Proto2TypeScript)) -- Difference from the original
================
[Original tool](https://github.com/SINTEF-9012/Proto2TypeScript) doesn't seem supported anymore.

#### My updates:
* Made the package globally installable
* Converted the tool code from Typescript to Javascript as the build process for NPM package with Typescript
  was not there at all
* Fixed some bugs
* Published on NPM

Also, the build process was a mess. I fixed those. But I don't even send a PR, because I changed a lot of stuff.

----
## Installation
```sh
npm install pbjs2typescript -g
```

## Usage
```sh
# Convert the model to TypeScript definitions
pbjs2typescript --file model.proto > model.d.ts
```
or,
```sh
# Parse and convert the proto file to json using pbjs (from ProtoBuf.js)
pbjs model.proto > model.json

# Convert the model to TypeScript definitions
pbjs2typescript --file model.json > model.d.ts
```

## Options
```
Options:
  -f, --file              proto file or JSON file                             [required]
  --noCtor                Don't generate `constructor`                        [default: false]
  --noCreate              Don't generate `create()` method                    [default: false]
  --noCoding              Don't generate `encode()`/`decode()` methods        [default: false]
  --noInherit             Don't inherit `Message<T>` class                    [default: false]
  --bytes                 Set type name of "bytes" field.                     [default: Uint8Array]
```

## Gulp
See <https://github.com/aliok/websocket-protobufs-ts-experiments> for Gulp integration.

## Why ?

Because intelligent code completion is cool :-)

![](http://i.imgur.com/evVnEM5.png "Example in sublime text")

## Requirements

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

## Changes
### 4.0
* Added support for *.proto file (`-f`, `--file` options)
* fixed property type name of interface
  * in interface, if type of property is "message", now correctly specifies the message interface name, not message class name
  * e.g.:
```typescript
export interface IAwesomeMessage {
  awesome_field: ISubDoc; // type is interface ISubDoc
}

export class AwesomeMessage extends protobuf.Message<AwesomeMessage> implements IAwesomeMessage {
  public awesome_field: SubDoc; // type if class SubDoc
  ...
}

export interface ISubDoc {
  ...
}

export class SubDoc extends protobuf.Message<SubDoc> implements ISubDoc {
  ...
}
```
* Removed `-m`, `--moduleName` options
* Added `--bytes` option
  * `--bytes`: Set type name of "bytes" field. (default: Uint8Array)


### 3.0
* Added support for protobufjs (only) 6.x json format
* Rewrote code in ES6 syntax
* Separated data interface from Message class
```typescript
export interface IAwesomeMessage {
  awesome_field: number;
}

export class AwesomeMessage extends protobuf.Message<AwesomeMessage> implements IAwesomeMessage {
  public awesome_field: number;
  ...
}
```
* Removed `-c`, `-u`, `-p` options
* Added `-m`, `--moduleName`, `--noCtor`, `--noCreate`, `--noCoding`, `--noInherit` options
  * `-m`, `--moduleName`: Set top level module name
  * `--noCtor`: Don't generate `constructor`
  * `--noCreate`, Don't generate `create()` method
  * `--noCoding`: Don't generate `encode()`/`decode()` methods
  * `--noInherit`: Don't inherit `Message<T>` class

## Acknowledgements

This code is developed in context of the [BRIDGE](http://www.bridgeproject.eu/en) project.

## Licence

The source code of this tool is licenced under the MIT License.
