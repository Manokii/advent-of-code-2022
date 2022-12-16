import { readFile } from "node:fs/promises"

export async function readInput(path: string) {
  const file = await readFile(path)
  const str = file.toString().trim()
  const input = str.split("\n")
  return { str, lines: input }
}
