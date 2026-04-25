import type { Root } from "mdast"
import { describe, expect, it } from "vite-plus/test"
import { ansiToHtml, transformAnsiCodeBlocks } from "./remark-ansi.ts"

function makeTree(...children: Root["children"]): Root {
  return { type: "root", children }
}

describe("ansiToHtml", () => {
  it("should return plain text unchanged", () => {
    expect(ansiToHtml("hello world")).toBe("hello world")
  })

  it("should escape HTML characters", () => {
    expect(ansiToHtml("<div>&</div>")).toBe("&lt;div&gt;&amp;&lt;/div&gt;")
  })

  it("should render standard foreground colors", () => {
    const input = "\x1b[31mred text\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="color:#bf616a">red text</span>',
    )
  })

  it("should render bold text", () => {
    const input = "\x1b[1mbold\x1b[0m"
    expect(ansiToHtml(input)).toBe('<span style="font-weight:bold">bold</span>')
  })

  it("should render italic text", () => {
    const input = "\x1b[3mitalic\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="font-style:italic">italic</span>',
    )
  })

  it("should render underline text", () => {
    const input = "\x1b[4munderline\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="text-decoration:underline">underline</span>',
    )
  })

  it("should render dim text", () => {
    const input = "\x1b[2mdim\x1b[0m"
    expect(ansiToHtml(input)).toBe('<span style="opacity:0.7">dim</span>')
  })

  it("should render strikethrough text", () => {
    const input = "\x1b[9mstruck\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="text-decoration:line-through">struck</span>',
    )
  })

  it("should render background colors", () => {
    const input = "\x1b[42mgreen bg\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="background-color:#a3be8c">green bg</span>',
    )
  })

  it("should combine foreground and background", () => {
    const input = "\x1b[31;42mred on green\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="color:#bf616a;background-color:#a3be8c">red on green</span>',
    )
  })

  it("should handle bright foreground colors", () => {
    const input = "\x1b[91mbright red\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="color:#bf616a">bright red</span>',
    )
  })

  it("should handle bright background colors", () => {
    const input = "\x1b[102mbright green bg\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="background-color:#a3be8c">bright green bg</span>',
    )
  })

  it("should handle 256-color foreground", () => {
    const input = "\x1b[38;5;196mcolor\x1b[0m"
    expect(ansiToHtml(input)).toBe('<span style="color:#ff0000">color</span>')
  })

  it("should handle 256-color background", () => {
    const input = "\x1b[48;5;21mbg\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="background-color:#0000ff">bg</span>',
    )
  })

  it("should handle 24-bit RGB foreground", () => {
    const input = "\x1b[38;2;255;128;0mrgb\x1b[0m"
    expect(ansiToHtml(input)).toBe('<span style="color:#ff8000">rgb</span>')
  })

  it("should handle 24-bit RGB background", () => {
    const input = "\x1b[48;2;0;128;255mbg\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="background-color:#0080ff">bg</span>',
    )
  })

  it("should handle reset via empty escape", () => {
    const input = "\x1b[31mred\x1b[mnormal"
    expect(ansiToHtml(input)).toBe(
      '<span style="color:#bf616a">red</span>normal',
    )
  })

  it("should handle multiple segments", () => {
    const input = "start \x1b[32mgreen\x1b[0m middle \x1b[34mblue\x1b[0m end"
    expect(ansiToHtml(input)).toBe(
      'start <span style="color:#a3be8c">green</span> middle <span style="color:#8fa1b3">blue</span> end',
    )
  })

  it("should handle combined bold and color", () => {
    const input = "\x1b[1;33mbold yellow\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="color:#ebcb8b;font-weight:bold">bold yellow</span>',
    )
  })

  it("should handle 256-color grayscale", () => {
    const input = "\x1b[38;5;232mblack\x1b[0m"
    expect(ansiToHtml(input)).toBe('<span style="color:#080808">black</span>')
  })

  it("should reset individual attributes", () => {
    const input = "\x1b[1;3mbold italic\x1b[23mnot italic\x1b[0m"
    expect(ansiToHtml(input)).toBe(
      '<span style="font-weight:bold;font-style:italic">bold italic</span><span style="font-weight:bold">not italic</span>',
    )
  })
})

describe("transformAnsiCodeBlocks", () => {
  function process(tree: Root) {
    transformAnsiCodeBlocks(tree)
    return tree
  }

  it("should convert ansi code block to AnsiCode JSX element", () => {
    const tree = process(
      makeTree({ type: "code", lang: "ansi", value: "\x1b[31mhello\x1b[0m" }),
    )

    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "AnsiCode",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "html",
          value: '<span style="color:#bf616a">hello</span>',
        },
      ],
    })
  })

  it("should ignore non-ansi code blocks", () => {
    const tree = process(
      makeTree({ type: "code", lang: "javascript", value: "const x = 1" }),
    )

    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "code",
      lang: "javascript",
    })
  })

  it("should handle plain text in ansi code block", () => {
    const tree = process(
      makeTree({ type: "code", lang: "ansi", value: "no escapes here" }),
    )

    const node = tree.children[0]
    expect(node).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "AnsiCode",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "html",
          value: "no escapes here",
        },
      ],
    })
  })
})
