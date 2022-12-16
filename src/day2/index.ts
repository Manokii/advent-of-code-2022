import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

type Lines = [string, string][]
type Status = keyof typeof points
type OpponentKeys = keyof typeof opponentShape
type SelfKeys = keyof typeof selfShape
type Result = ReturnType<typeof getPartOneRoundResult>
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

const DEFAULT_ANSWER_DATA = {
  _answer: 0,
  shapeScore: 0,
  statusScore: 0,
  total: 0,
  opponentShapes: { Rock: 0, Paper: 0, Scissors: 0 },
  selfShapes: { Rock: 0, Paper: 0, Scissors: 0 },
}

/**
 * @param arr lines of input
 * @returns [string, string][]
 */
function getRounds(arr: string[]): Lines {
  return arr.reduce<Lines>((acc, curr) => {
    const [opponent, self] = curr.split(" ")
    return [...acc, [opponent, self]]
  }, [])
}

function getPartOneResults(input: Lines) {
  return input.map(([opponent, self]) =>
    getPartOneRoundResult(opponent as OpponentKeys, self as SelfKeys)
  )
}

function getPartTwoResults(input: Lines) {
  return input.map(([opponent, self]) =>
    getPartTwoRoundResult(opponent as OpponentKeys, self as SelfKeys)
  )
}

function getPartOneRoundResult(opponent: OpponentKeys, self: SelfKeys) {
  const shapeScore = shapePoints[selfShape[self]]
  let status = rps(opponentShape[opponent], selfShape[self])
  const result = points[status]
  return {
    status,
    shapeScore,
    statusScore: result,
    total: shapeScore + result,
    shape: { self: selfShape[self], opponent: opponentShape[opponent] },
  }
}

function getPartTwoRoundResult(opponent: OpponentKeys, self: SelfKeys): Result {
  const status = resultIntent[self]
  const shapePlayed = rpsReversed(status, opponentShape[opponent])
  const shapeScore = shapePoints[shapePlayed]
  const result = points[status]

  return {
    status,
    shapeScore,
    statusScore: result,
    total: shapeScore + result,
    shape: { self: shapePlayed, opponent: opponentShape[opponent] },
  }
}

function rps(opponent: Shape, self: Shape): Status {
  if (opponent === self) return "draw"
  if (opponent === "Rock") return self === "Paper" ? "win" : "lose"
  if (opponent === "Paper") return self === "Scissors" ? "win" : "lose"
  if (opponent === "Scissors") return self === "Rock" ? "win" : "lose"
  return "draw"
}

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

function getPartOneData(result: Result[]) {
  return result.reduce(
    (acc, curr) => {
      return Object.assign(acc, {
        _answer: acc._answer + curr.total,
        selfShapes: {
          Rock: acc.selfShapes.Rock + (curr.shape.self === "Rock" ? 1 : 0),
          Paper: acc.selfShapes.Paper + (curr.shape.self === "Paper" ? 1 : 0),
          Scissors: acc.selfShapes.Scissors + (curr.shape.self === "Scissors" ? 1 : 0),
        },
        opponentShapes: {
          Rock: acc.opponentShapes.Rock + (curr.shape.opponent === "Rock" ? 1 : 0),
          Paper: acc.opponentShapes.Paper + (curr.shape.opponent === "Paper" ? 1 : 0),
          Scissors: acc.opponentShapes.Scissors + (curr.shape.opponent === "Scissors" ? 1 : 0),
        },
        shapeScore: acc.shapeScore + curr.shapeScore,
        statusScore: acc.statusScore + curr.statusScore,
        total: acc.total + curr.total,
      })
    },
    { ...DEFAULT_ANSWER_DATA }
  )
}

function getPartTwoData(result: Result[]) {
  return result.reduce(
    (acc, curr) => {
      return Object.assign(acc, {
        _answer: acc._answer + curr.total,
        selfShapes: {
          Rock: acc.selfShapes.Rock + (curr.shape.self === "Rock" ? 1 : 0),
          Paper: acc.selfShapes.Paper + (curr.shape.self === "Paper" ? 1 : 0),
          Scissors: acc.selfShapes.Scissors + (curr.shape.self === "Scissors" ? 1 : 0),
        },
        opponentShapes: {
          Rock: acc.opponentShapes.Rock + (curr.shape.opponent === "Rock" ? 1 : 0),
          Paper: acc.opponentShapes.Paper + (curr.shape.opponent === "Paper" ? 1 : 0),
          Scissors: acc.opponentShapes.Scissors + (curr.shape.opponent === "Scissors" ? 1 : 0),
        },
        shapeScore: acc.shapeScore + curr.shapeScore,
        statusScore: acc.statusScore + curr.statusScore,
        total: acc.total + curr.total,
      })
    },
    { ...DEFAULT_ANSWER_DATA }
  )
}

async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  const rounds = getRounds(input.lines)

  const partOneResult = getPartOneResults(rounds)
  const partOneData = getPartOneData(partOneResult)

  const partTwoResult = getPartTwoResults(rounds)
  const partTwoData = getPartTwoData(partTwoResult)

  await writeAnswer(Object.assign(partOneData, { _input: input.str }), name, 1)
  await writeAnswer(Object.assign(partTwoData, { _input: input.str }), name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day2/input-sample.txt"
const INPUT_FILE = "./src/day2/input.txt"

export function day2() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day2-sample")
  MAIN: solution(INPUT_FILE, "day2")
}
