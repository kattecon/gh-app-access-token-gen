APP_DEPS_FILES := package-lock.json Makefile $(shell find src -type f -regex '.*\.ts$$')
RELEASE_FILE := release.tar.gz
RELEASE_STATIC_CONTENT := .github/workflows/build.yaml action.yaml LICENSE README.md

.PHONY: clean distclean build

# Disable implicit rules
.SUFFIXES:

all: build

build: dist/index.js

release-file: ${RELEASE_FILE}

dist/index.js: ${APP_DEPS_FILES} temp/prepare-done package.json
	@npm run build \
		&& tr -d '\r' < dist/index.js > dist/index-unix.js \
		&& mv dist/index-unix.js dist/index.js

lint:
	@npm run lint

${RELEASE_FILE}: dist/index.js ${RELEASE_STATIC_CONTENT} 
	@tar -cf release.tar dist ${RELEASE_STATIC_CONTENT} && rm -f release.tar.gz && gzip release.tar

temp/temp-created:
	@mkdir -p temp && touch temp/temp-created

temp/prepare-done: temp/temp-created Makefile package-lock.json
	@npm ci && touch temp/prepare-done

clean:
	@rm -rf dist ${RELEASE_FILE}

distclean: clean
	@rm -rf temp
