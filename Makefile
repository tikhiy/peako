all: lint
	node_modules/.bin/browserify -o dist/peako.js peako.js -x qs

min: all
	node_modules/.bin/uglifyjs -cmo dist/peako.min.js dist/peako.js

lint:
	node_modules/.bin/jshint . --verbose
