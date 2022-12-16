import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

type Lines = string[][]
type Status = keyof typeof points
type OpponentKeys = keyof typeof opponentShape
type SelfKeys = keyof typeof selfShape
type Shape = typeof selfShape["X" | "Y" | "Z"]

const points = {
  lose: 0,
  draw: 3,
  win: 6,
} as const

const shapePoints = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
}

const resultIntent = {
  X: "lose",
  Y: "draw",
  Z: "win",
} as const

const opponentShape = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
} as const

const selfShape = {
  X: "Rock",
  Y: "Paper",
  Z: "Scissors",
} as const

/**
 * @param arr lines of input
 * @returns [string, string][]
 */
function getRounds(arr: string[]): Lines {
  return arr.map((curr) => curr.split(" "))
}

function getPartOneAnswer(input: Lines) {
  const result = input.map((line) => {
    const [opponent, self] = line as [OpponentKeys, SelfKeys]
    const shapeScore = shapePoints[selfShape[self]]
    let status = rps(opponentShape[opponent], selfShape[self])
    const result = points[status]
    return shapeScore + result
  })
  return getAnswer(result)
}

function getPartTwoAnswer(input: Lines) {
  const result = input.map((line) => {
    const [opponent, self] = line as [OpponentKeys, SelfKeys]
    const status = resultIntent[self]
    const shapePlayed = rpsReversed(status, opponentShape[opponent])
    const shapeScore = shapePoints[shapePlayed]
    const result = points[status]
    return shapeScore + result
  })
  return getAnswer(result)
}

// Rock Paper Scissor
function rps(opponent: Shape, self: Shape): Status {
  if (opponent === self) return "draw"
  if (opponent === "Rock") return self === "Paper" ? "win" : "lose"
  if (opponent === "Paper") return self === "Scissors" ? "win" : "lose"
  if (opponent === "Scissors") return self === "Rock" ? "win" : "lose"
  return "draw"
}

// RPS but you play the shape of intended result against the opponent
function rpsReversed(intendedResult: Status, opponent: Shape): Shape {
  if (intendedResult === "draw") return opponent
  if (intendedResult === "win") {
    if (opponent === "Rock") return "Paper"
    if (opponent === "Paper") return "Scissors"
    return "Rock"
  }
  if (intendedResult === "lose") {
    if (opponent === "Rock") return "Scissors"
    if (opponent === "Paper") return "Rock"
    return "Paper"
  }
  return "Rock"
}

function getAnswer(result: number[]) {
  return result.reduce((acc, curr) => {
    return acc + curr
  }, 0)
}

async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  const rounds = getRounds(input.lines)

  const partOneAnswer = getPartOneAnswer(rounds)
  const partTwoAnswer = getPartTwoAnswer(rounds)

  await writeAnswer(partOneAnswer, name, 1)
  await writeAnswer(partTwoAnswer, name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day2/input-sample.txt"
const INPUT_FILE = "./src/day2/input.txt"

export function day2() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day2-sample")
  MAIN: solution(INPUT_FILE, "day2")
}
