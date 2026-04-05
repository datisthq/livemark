import type { List, ListItem, Paragraph, Text } from "mdast"
import { describe, expect, it } from "vite-plus/test"
import { parseList } from "./remark-filetree.ts"

function text(value: string): Text {
  return { type: "text", value }
}

function paragraph(...children: Text[]): Paragraph {
  return { type: "paragraph", children }
}

function listItem(...children: (Paragraph | List)[]): ListItem {
  return { type: "listItem", children, spread: false }
}

function list(...children: ListItem[]): List {
  return { type: "list", children, ordered: false, spread: false }
}

describe("parseList", () => {
  it("should parse flat file entries", () => {
    const input = list(
      listItem(paragraph(text("package.json"))),
      listItem(paragraph(text("tsconfig.json"))),
    )

    expect(parseList(input)).toEqual([
      { name: "package.json", isDir: false },
      { name: "tsconfig.json", isDir: false },
    ])
  })

  it("should detect directories by trailing slash", () => {
    const input = list(
      listItem(paragraph(text("src/"))),
      listItem(paragraph(text("README.md"))),
    )

    expect(parseList(input)).toEqual([
      { name: "src", isDir: true },
      { name: "README.md", isDir: false },
    ])
  })

  it("should parse nested directory structures", () => {
    const input = list(
      listItem(
        paragraph(text("src/")),
        list(
          listItem(paragraph(text("index.ts"))),
          listItem(
            paragraph(text("components/")),
            list(listItem(paragraph(text("Button.tsx")))),
          ),
        ),
      ),
    )

    expect(parseList(input)).toEqual([
      {
        name: "src",
        isDir: true,
        children: [
          { name: "index.ts", isDir: false },
          {
            name: "components",
            isDir: true,
            children: [{ name: "Button.tsx", isDir: false }],
          },
        ],
      },
    ])
  })

  it("should skip list items without text content", () => {
    const emptyItem: ListItem = {
      type: "listItem",
      children: [],
      spread: false,
    }
    const input = list(emptyItem, listItem(paragraph(text("file.ts"))))

    expect(parseList(input)).toEqual([{ name: "file.ts", isDir: false }])
  })

  it("should trim whitespace from names", () => {
    const input = list(listItem(paragraph(text("  file.ts  "))))

    expect(parseList(input)).toEqual([{ name: "file.ts", isDir: false }])
  })

  it("should handle deeply nested structures", () => {
    const input = list(
      listItem(
        paragraph(text("a/")),
        list(
          listItem(
            paragraph(text("b/")),
            list(
              listItem(
                paragraph(text("c/")),
                list(listItem(paragraph(text("deep.ts")))),
              ),
            ),
          ),
        ),
      ),
    )

    expect(parseList(input)).toEqual([
      {
        name: "a",
        isDir: true,
        children: [
          {
            name: "b",
            isDir: true,
            children: [
              {
                name: "c",
                isDir: true,
                children: [{ name: "deep.ts", isDir: false }],
              },
            ],
          },
        ],
      },
    ])
  })

  it("should return undefined children for directories without nested list", () => {
    const input = list(listItem(paragraph(text("empty-dir/"))))

    expect(parseList(input)).toEqual([{ name: "empty-dir", isDir: true }])
  })
})
