#!/usr/bin/env bash

set -e # abort on the first error

for f in tests/*.proto
do
	fileName=${f%.*}
	
	# Convert the prototype file
	./node_modules/protobufjs/bin/pbjs $f --target json > $fileName.json

	# Start the program (it should work)
	echo "/// <reference path=\"../definitions/bytebuffer.d.ts\" />" > $fileName.d.ts
	node proto2typescript.js -f $fileName.json >> $fileName.d.ts

	# Run the TypeScript compiler and let see if it's ok
	tsc -out /dev/null $fileName.d.ts
done

echo "Conversion OK"

# Run the unit tests
echo "Running mocha tests"
mocha tests.js


rm tests/*.d.ts
rm tests/*.json