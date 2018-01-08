#!/usr/bin/env bash

set -e # abort on the first error

for f in tests/*.proto
do
	fileName=${f%.*}

	# Convert the prototype file
	./node_modules/protobufjs/bin/pbjs -t json -o $fileName.json $f

	# Start the program (it should work)
	node proto2typescript.js -f $fileName.json > $fileName.d.ts

	# Run the TypeScript compiler and let see if it's ok
	tsc -out /dev/null $fileName.d.ts
done

echo "Conversion OK"

# Run the unit tests
echo "Running mocha tests"
./node_modules/mocha/bin/mocha tests.js


rm tests/*.d.ts
rm tests/*.json