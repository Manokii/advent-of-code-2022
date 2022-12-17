import { readFile } from "node:fs/promises"

export async function readInput(path: string, trim = true) {
  const file = await readFile(path)
  const str = trim ? file.toString().trim() : file.toString()
  const input = str.split("\n")
  return { str, lines: input }
}
