APP_DEPS_FILES := package-lock.json Makefile $(shell find src -type f -regex '.*\.ts$$')
RELEASE_FILE := release.tar.gz
RELEASE_STATIC_CONTENT := .github/workflows/build.yaml .github/CODEOWNERS action.yaml LICENSE README.md

.PHONY: clean distclean build

# Disable implicit rules
.SUFFIXES:

all: build

build: dist/index.mjs

release-file: ${RELEASE_FILE}

dist/index.mjs: ${APP_DEPS_FILES} temp/prepare-done package.json
	@npm run build \
		&& tr -d '\r' < dist/index.mjs > dist/index-unix.mjs \
		&& mv dist/index-unix.mjs dist/index.mjs

lint:
	@npm run lint

${RELEASE_FILE}: dist/index.mjs ${RELEASE_STATIC_CONTENT} 
	@tar -cf release.tar dist ${RELEASE_STATIC_CONTENT} && rm -f release.tar.gz && gzip release.tar

temp/temp-created:
	@mkdir -p temp && touch temp/temp-created

temp/prepare-done: temp/temp-created Makefile package-lock.json
	@npm ci && touch temp/prepare-done

clean:
	@rm -rf dist ${RELEASE_FILE}

distclean: clean
	@rm -rf temp
