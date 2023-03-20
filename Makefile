APP_DEPS_FILES := package-lock.json Makefile $(shell find src -type f -regex '.*\.ts$$')

.PHONY: clean distclean build

# Disable implicit rules
.SUFFIXES:

all: build

build: dist/index.js

dist/index.js: ${APP_DEPS_FILES} temp/prepare-done
	@npm run build

lint:
	@npm run lint

temp/temp-created:
	@mkdir -p temp && touch temp/temp-created

temp/prepare-done: temp/temp-created Makefile package-lock.json
	@npm ci && touch temp/prepare-done
