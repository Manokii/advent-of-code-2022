import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

function parseInput(input: string[]) {
  return input.map((row) => {
    const [dir, dist] = row.split(" ")
    return [dir as Dir, Number(dist)] as const
  })
}

const gridSize = 40

// =======
type Dir = "R" | "L" | "U" | "D"
type Coords = [number, number]
let knots: Coords[] = []
const d: Record<Dir, Coords> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
}

function touching(x1: number, y1: number, x2: number, y2: number) {
  return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1
}

function move(dx: number, dy: number) {
  knots[0][0] += dx
  knots[0][1] += dy

  for (let i = 0; i < knots.length; i++) {
    const [hx, hy] = knots[i]
    if (!knots[i + 1]) continue
    let [tx, ty] = knots[i + 1]
    let move_x = 0
    let move_y = 0

    if (!touching(hx, hy, tx, ty)) {
      move_x = hx === tx ? 0 : (hx - tx) / Math.abs(hx - tx)
      move_y = hy === ty ? 0 : (hy - ty) / Math.abs(hy - ty)
    }

    knots[i + 1] = [tx + move_x, ty + move_y]
  }
}

function drawGrid() {
  const grid = new Array<string>(gridSize).fill(new Array(gridSize).fill(".").join(""))

  for (let [i, [x, y]] of knots.entries()) {
    const newRow = grid[y].split("")
    newRow[x] = newRow[x] !== "." ? newRow[x] : i.toString()
    grid[y] = newRow.join("")
  }

  return grid.join("\n")
}

function getAnswer(input: ReturnType<typeof parseInput>, knotCount: number) {
  knots = new Array(knotCount).fill([gridSize / 2, gridSize / 2])
  const tailVisits: Coords[] = []
  // console.log(drawGrid())

  for (let [dir, dist] of input) {
    const [dx, dy] = d[dir]
    // console.log("\nMOVE", dir, dist)

    for (let i = 0; i < dist; i++) {
      move(dx, dy)
      const tail = knots[knots.length - 1]
      const [tx, ty] = tail
      if (!tailVisits.some(([x, y]) => x === tx && y === ty)) {
        tailVisits.push(tail)
      }
    }
    // console.log(drawGrid())
  }

  return tailVisits.length
}

// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  const partOne = getAnswer(parseInput(input.lines), 2)
  const partTwo = getAnswer(parseInput(input.lines), 10)

  await writeAnswer(partOne, name, 1)
  await writeAnswer(partTwo, name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day9/input-sample.txt"
const INPUT_FILE_SAMPLE2 = "./src/day9/input-sample2.txt"
const INPUT_FILE = "./src/day9/input.txt"

export function day9() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day9-sample")
  SAMPLE2: solution(INPUT_FILE_SAMPLE2, "day9-sample2")
  MAIN: solution(INPUT_FILE, "day9")
}
