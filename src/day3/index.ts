import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

const priorityTable = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function getCommonItem(rucksack: string[]) {
  const rucksackTuple = rucksack.map((str) => str.split(""))
  const common = rucksackTuple[0].filter((letter) =>
    rucksackTuple.every((str) => str.includes(letter))
  )

  return common[0] || ""
}

const getPriority = (item: string) => priorityTable.indexOf(item) + 1

function splitString(str: string) {
  const half = Math.ceil(str.length / 2)
  return [str.slice(0, half), str.slice(half)]
}

function getPartOneAnswer(lines: string[]) {
  return lines.reduce((acc, curr) => {
    const rucksack = splitString(curr)
    const commonItem = getCommonItem(rucksack)
    const priorityScore = getPriority(commonItem)
    return acc + priorityScore
  }, 0)
}

function group(lines: string[], chunkSize: number = 3) {
  return lines.reduce<string[][]>((all, one, i) => {
    const ch = Math.floor(i / chunkSize)
    const chunk = all[ch] || []
    all[ch] = chunk.concat(one)
    return all
  }, [])
}

function getPartTwoAnswer(groups: string[][]) {
  return groups.reduce((acc, curr) => {
    const commonItem = getCommonItem(curr)
    const priorityScore = getPriority(commonItem)
    return acc + priorityScore
  }, 0)
}

// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  const groups = group(input.lines)
  await writeAnswer(getPartOneAnswer(input.lines), name, 1)
  await writeAnswer(getPartTwoAnswer(groups), name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day3/input-sample.txt"
const INPUT_FILE = "./src/day3/input.txt"

export function day3() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day3-sample")
  MAIN: solution(INPUT_FILE, "day3")
}
