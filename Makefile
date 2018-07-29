all: lint
	node_modules/.bin/browserify -o dist/peako.js     peako.js

min: all
	node_modules/.bin/uglifyjs   -o dist/peako.min.js dist/peako.js -cm

lint:
	node_modules/.bin/jshint . --verbose
