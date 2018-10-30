all: lint
	node_modules/.bin/browserify -o dist/peako.js peako.js -x qs -d

min: all
	node_modules/.bin/uglifyjs -cmo dist/peako.min.js dist/peako.js

lint:
	@node_modules/.bin/eslint .

test:
	@node_modules/.bin/mocha -r test/internal/register `find test/files -name '*.test.js'`
