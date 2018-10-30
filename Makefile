lint:
	@node_modules/.bin/eslint .

lint--fix:
	@node_modules/.bin/eslint . --fix

all:
	@node_modules/.bin/browserify -o dist/peako.js peako.js -x qs -d

min: all
	@node_modules/.bin/uglifyjs -cmo dist/peako.min.js dist/peako.js

gzip: min
	@gzip dist/peako.min.js --stdout > dist/peako.min.js.gz

test:
	@node_modules/.bin/mocha -r test/internal/register `find test/files -name '*.test.js'`
