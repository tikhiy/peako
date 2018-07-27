NAME := peako

all:
	node_modules/browserify/bin/cmd.js -o build/$(NAME).js $(NAME).js
	node_modules/uglify-js/bin/uglifyjs build/$(NAME).js -o build/$(NAME).min.js -cm
