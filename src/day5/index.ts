import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

type ReduceData = { arr: string[][]; index: number }

function parseInput(lines: string[]) {
  const data = lines.reduce<ReduceData>(
    (acc, curr) => {
      if (curr === "") return Object.assign(acc, { index: acc.index + 1 })
      const newArr = acc.arr
      newArr[acc.index] = [...(newArr[acc.index] ?? []), curr]
      return Object.assign(acc, { arr: newArr })
    },
    { arr: [], index: 0 }
  )

  const [stacks, instructions] = data.arr
  return { stacks, instructions }
}

const getStacks = (stack: string[]) => {
  const stackNumbersIndex = stack.length - 1
  const stackNumbers = stack[stackNumbersIndex].split("")

  return stackNumbers.reduce<Map<string, string[]>>((acc, curr, i) => {
    if (curr.trim() === "") return acc

    const data = stack.reduce<string[]>((itemStack, row, ii) => {
      if (ii === stackNumbersIndex) return itemStack
      const item = (row[i] || "").trim()
      return item ? [...itemStack, item] : itemStack
    }, [])

    return acc.set(curr, data.reverse())
  }, new Map<string, string[]>())
}

function parseStep(step: string) {
  const regex = /move (\d+) from (\d+) to (\d+)/
  const [, move, from, to] = step.match(regex) || []
  return { move: Number(move), from, to }
}

function parseSteps(steps: string[]) {
  return steps.map(parseStep)
}

function getAnswer(
  stacks: Map<string, string[]>,
  steps: ReturnType<typeof parseSteps>,
  reverse = true
) {
  const copy = new Map(stacks)
  steps.forEach(({ move, from, to }) => {
    const fromStack = [...(copy.get(from) || [])]
    const targetStack = [...(copy.get(to) || [])]
    const toMove = fromStack.splice(fromStack.length - move, move)
    if (reverse) toMove.reverse()
    copy.set(to, targetStack.concat(toMove))
    copy.set(from, fromStack)
  })

  return [...copy.values()].map((stack) => stack.join("").at(-1)).join("")
}

// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath, false)
  const data = parseInput(input.lines)
  const stacks = getStacks(data.stacks)
  const steps = parseSteps(data.instructions)
  const partOne = getAnswer(stacks, steps)
  const partTwo = getAnswer(stacks, steps, false)
  await writeAnswer(partOne, name, 1)
  await writeAnswer(partTwo, name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day5/input-sample.txt"
const INPUT_FILE = "./src/day5/input.txt"

export function day5() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day5-sample")
  MAIN: solution(INPUT_FILE, "day5")
}
