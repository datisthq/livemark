import { basename, dirname, join } from "node:path"
import {
  coverageConfigDefaults,
  defaultClientConditions,
  defaultServerConditions,
  defineConfig,
} from "vite-plus"

const ignorePatterns = ["**/generated/**", "**.gen.**"]

export default defineConfig({
  // Workspace packages load from their TypeScript, not their unbuilt `build/`
  resolve: { conditions: ["source", ...defaultClientConditions] },
  ssr: { resolve: { conditions: ["source", ...defaultServerConditions] } },
  fmt: {
    semi: false,
    printWidth: 90,
    arrowParens: "avoid",
    ignorePatterns: [...ignorePatterns, "CHANGELOG.md"],
  },
  lint: {
    ignorePatterns,
    options: {
      typeAware: false,
      typeCheck: false,
    },
  },
  test: {
    include: ["**/*.unit.(ts|tsx)"],
    exclude: [
      "**/node_modules/**",
      "**/build/**",
      "**/.worktrees/**",
      "**/.target/**",
      "**/.livemark/.*/**",
    ],
    env: { NODE_OPTIONS: "--no-warnings --conditions=source" },
    pool: "forks",
    // One fork per core re-imports every module in each, for no wall-time gain: import
    // time already dwarfs test time. Half the cores leaves the machine usable.
    maxWorkers: "50%",
    testTimeout: 60 * 1000,
    passWithNoTests: true,
    silent: "passed-only",
    coverage: {
      // Off so the run before landing stays cheap; `pnpm measure:coverage` opts in.
      enabled: false,
      reporter: ["html", "json"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/@*",
        "**/build/**",
        "**/compile/**",
        "**/coverage/**",
        "**/entrypoints/**",
        "**/examples/**",
        "**/messages.js",
        "**/program.ts",
        "**/index.ts",
      ],
    },
    resolveSnapshotPath: (testPath: string, snapExtension: string) => {
      return (
        join(dirname(testPath), "fixtures", "generated", basename(testPath)) +
        snapExtension
      )
    },
  },
})
