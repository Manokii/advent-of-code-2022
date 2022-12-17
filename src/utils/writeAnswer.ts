import { existsSync, mkdirSync } from "node:fs"
import { writeFile } from "node:fs/promises"

export async function writeAnswer(data: any, name: string, part: number = 0) {
  const answersDirectory = "./answers"

  if (!existsSync(answersDirectory)) {
    mkdirSync(answersDirectory)
  }
  const outputPath = `${answersDirectory}/${name}${!!part ? `-part-${part}` : ""}.json`
  const json = JSON.stringify(data, null, 2)
  await writeFile(outputPath, json, { flag: "w" })
}
