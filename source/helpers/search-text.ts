/** Strip markdown syntax to extract plain searchable text */
export function extractSearchText(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---\n*/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/:::\w+[\s\S]*?:::/g, "")
    .replace(/::\w+(?:\[.*?\])?(?:\{.*?\})?/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/#{1,6}\s*/g, "")
    .replace(/[*_~`>|]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim()
}
