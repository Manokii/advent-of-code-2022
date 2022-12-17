import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

const getSignal = (input: string, characterCount: number) => {
  let signalMarker = 0
  for (let i = 0; i < input.length; i++) {
    const chars = input.slice(i, i + characterCount)
    if (!isAllUnique(chars)) continue
    signalMarker = i + characterCount
    break
  }

  return signalMarker
}

function isAllUnique(str: string) {
  return !/(.).*\1/.test(str)
}

function getAnswer(input: string[], characterCount: number) {
  return input.map((line) => getSignal(line, characterCount))
}
// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath, false)
  const partOne = getAnswer(input.lines, 4)
  const partTwo = getAnswer(input.lines, 14)
  await writeAnswer(partOne, name, 1)
  await writeAnswer(partTwo, name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day6/input-sample.txt"
const INPUT_FILE = "./src/day6/input.txt"

export function day6() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day6-sample")
  MAIN: solution(INPUT_FILE, "day6")
}
