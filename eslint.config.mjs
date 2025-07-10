// ESLint v9 flat config with modern ES6 imports and defineConfig helper
import { globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
            reportUnusedInlineConfigs: "error",
        },
    },

    // Global ignores first
    globalIgnores(["node_modules/**/*", "**/*.js"]),

    // Base JavaScript configuration for all files
    js.configs.recommended,

    // Custom configuration for TypeScript files
    {
        files: ["**/*.ts"],
        extends: [
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            importPlugin.flatConfigs.errors,
            importPlugin.flatConfigs.warnings,
            importPlugin.flatConfigs.typescript,
        ],
        /*plugins: {
            // We explicitly declare the import plugin here
            import: importPlugin,
        },*/
        languageOptions: {
            // Set parser options for this block
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            // https://github.com/import-js/eslint-import-resolver-typescript#configuration
            "import/parsers": {
                "@typescript-eslint/parser": [".ts"],
            },
            // https://github.com/import-js/eslint-plugin-import?tab=readme-ov-file#importresolver
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },
        rules: {
            // Custom rules from original config - only safe ones for now
            curly: ["error", "all"],
            "no-await-in-loop": "error",
            "no-loss-of-precision": "error",
            "no-promise-executor-return": "error",
            "no-template-curly-in-string": "error",
            "no-unreachable-loop": "error",
            "no-useless-backreference": "error",
            "require-atomic-updates": "error",
            "no-unsafe-optional-chaining": "error",
            "array-callback-return": "error",
            "no-eq-null": "error",
            "require-unicode-regexp": "off",
            "no-empty-character-class": "error",
            "no-useless-escape": "error",
            "no-return-await": "error",
            "no-eval": "error",
            "no-control-regex": "error",
            "no-extend-native": "error",
            "no-misleading-character-class": "error",
            "no-invalid-regexp": "error",
            "prefer-regex-literals": "error",
            "no-regex-spaces": "error",
            "no-extra-bind": "error",
            "no-implied-eval": "error",
            "no-iterator": "error",
            "no-array-constructor": "error",
            "no-prototype-builtins": "error",
            "logical-assignment-operators": "error",
            "no-loop-func": "error",
            "no-multi-str": "error",
            "no-new-wrappers": "error",
            "no-object-constructor": "error",
            "no-nonoctal-decimal-escape": "error",
            "no-octal": "error",
            "no-octal-escape": "error",
            "no-param-reassign": "error",
            "no-proto": "error",
            "no-return-assign": "error",
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-throw-literal": "error",
            "no-unmodified-loop-condition": "error",
            "no-unused-expressions": "error",
            "no-useless-call": "error",
            "no-useless-concat": "error",
            "no-useless-return": "error",
            "no-void": "error",
            "no-shadow": "off",
            "prefer-named-capture-group": "off",
            "prefer-promise-reject-errors": "error",
            "func-name-matching": "error",
            "no-multi-assign": "error",
            "prefer-object-spread": "error",
            "no-duplicate-imports": "error",
            "no-useless-computed-key": "error",
            "no-useless-rename": "error",
            "prefer-arrow-callback": "error",
            "prefer-const": "error",
            "prefer-destructuring": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            "no-var": "error",

            // TypeScript ESLint rules - override with new versions
            "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/consistent-indexed-object-style": "off",
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                {
                    assertionStyle: "never",
                },
            ],
            "@typescript-eslint/no-this-alias": [
                "error",
                {
                    allowedNames: ["outer"],
                },
            ],
            "@typescript-eslint/no-deprecated": "error",
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-unnecessary-template-expression": "error",
            "@typescript-eslint/no-confusing-non-null-assertion": "error",
            "@typescript-eslint/no-confusing-void-expression": "error",
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-invalid-void-type": "off",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-includes": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/prefer-literal-enum-member": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/prefer-string-starts-ends-with": "error",
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/non-nullable-type-assertion-style": "error",
            "@typescript-eslint/no-loss-of-precision": "error",
            "@typescript-eslint/no-redeclare": "error",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/only-throw-error": "error",
            "@typescript-eslint/no-unused-expressions": "error",
            "@typescript-eslint/no-unnecessary-type-constraint": "error",
            "@typescript-eslint/no-unsafe-unary-minus": "error",
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "explicit",
                },
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "default",
                    format: ["camelCase"],
                },
                {
                    selector: "property",
                    format: null,
                    filter: { regex: "^\\d+$", match: true },
                },
                {
                    selector: "import",
                    modifiers: ["default"],
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "variable",
                    modifiers: ["const"],
                    format: ["UPPER_CASE", "camelCase", "PascalCase"],
                    filter: {
                        /* This is just to increase the priority of the rule */
                        regex: ".*",
                        match: true,
                    },
                },
                {
                    selector: "variable",
                    types: ["array", "boolean", "number", "string"],
                    format: ["camelCase"],
                },
                {
                    selector: "variable",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "parameter",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase"],
                },
                {
                    selector: "memberLike",
                    modifiers: ["private"],
                    format: ["camelCase"],
                    leadingUnderscore: "require",
                },
                {
                    selector: "memberLike",
                    modifiers: ["override"],
                    format: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"],
                },
                {
                    selector: "property",
                    format: ["camelCase", "snake_case"],
                },
                {
                    selector: "property",
                    modifiers: ["private"],
                    format: ["camelCase", "snake_case"],
                    leadingUnderscore: "require",
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
            ],

            // Import plugin rules
            "import/no-unresolved": [
                "error",
                {
                    /*"ignore": ["^virtual:icons/*"]*/
                },
            ],
            "import/order": [
                "error",
                {
                    "newlines-between": "always-and-inside-groups",
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
            "import/no-default-export": "error",
            "import/no-duplicates": "error",
            "import/named": "off",
            "import/no-named-default": "error",
            "import/no-namespace": "error",
            "import/no-anonymous-default-export": "error",
            "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
            "import/no-cycle": "error",
            "import/no-dynamic-require": "error",
            "import/no-absolute-path": "error",
            "import/no-useless-path-segments": "error",
            "import/no-self-import": "error",
            "import/no-relative-packages": "error",
            "import/no-webpack-loader-syntax": "error",
            "import/no-deprecated": "error",
            "import/no-empty-named-blocks": "error",
            "import/no-extraneous-dependencies": "error",
            "import/no-unused-modules": "error",
            "import/no-mutable-exports": "error",

            // Custom restrictions from original config
            "no-restricted-syntax": [
                "error",
                {
                    message: "Prefer arrow functions to function expressions.",
                    selector: ":not(MethodDefinition) > FunctionExpression",
                },
                {
                    message: "Prefer arrow functions to function declarations.",
                    selector: "FunctionDeclaration[generator=false]",
                },
            ],
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["./*/*", "../*"],
                            message: "Use @src instead of the relative path import.",
                        },
                    ],
                },
            ],
        },
    },

    // Override for test files
    {
        files: ["**/*.test.ts", "**/*.mock.ts", "src/test/**/*.ts"],
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/consistent-type-assertions": "off",
            "import/no-namespace": "off",
            "no-restricted-syntax": "off",
            "prefer-arrow-callback": "off",
            "@typescript-eslint/naming-convention": "off",
        },
    },

    // Prettier configuration (disable conflicting formatting rules)
    prettierConfig,
);
