import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

type RowData = ReturnType<typeof getVisibility>

let rows: number[][] = []

function parseRows(input: string[]) {
  return input.map((row) => row.split("").map(Number))
}

function getVisibility(row: number, col: number) {
  const left = rows[row].slice(0, col)
  const right = rows[row].slice(col + 1, rows[row].length)
  const top = rows.slice(0, row).map((row) => row[col])
  const bottom = rows.slice(row + 1, rows.length).map((row) => row[col])

  const value = rows[row][col]

  function lt(val: number) {
    return val < value
  }

  const leftVisible = left.every(lt),
    rightVisible = right.every(lt),
    topVisible = top.every(lt),
    bottomVisible = bottom.every(lt)

  const visibility = {
    left: leftVisible,
    right: rightVisible,
    top: topVisible,
    bottom: bottomVisible,
  }

  const isEdge = row === 0 || col === 0 || col === rows[0]?.length - 1 || row === rows.length - 1
  const visible = leftVisible || rightVisible || topVisible || bottomVisible || isEdge
  const trees = { left, right, top, bottom }

  const scenicScore = calcScenicScore(trees, value)

  return { visibility, trees, visible, scenicScore, isEdge, value, row, col }
}

function calcScenicScore(trees: RowData["trees"], treeHeight: number) {
  const top = calcDirectionalScore(trees.top, treeHeight, true)
  const left = calcDirectionalScore(trees.left, treeHeight, true)
  const right = calcDirectionalScore(trees.right, treeHeight)
  const bottom = calcDirectionalScore(trees.bottom, treeHeight)
  const score = top * left * right * bottom
  return score
}

function calcDirectionalScore(trees: number[], treeHeight: number, reversed = false) {
  let score = 0
  const newTrees = reversed ? [...trees].reverse() : trees

  for (let i = 0; i < trees.length; i++) {
    score = score + 1
    if (newTrees[i] >= treeHeight) break
  }

  return score
}

function getData() {
  const data: RowData[] = []

  rows.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      data.push(getVisibility(rowIndex, colIndex))
    })
  })

  return data
}

function getPartOneAnswer(data: RowData[]) {
  return data.filter((row) => row.visible).length
}

function getPartTwoAnswer(data: RowData[]) {
  return data.reduce((acc, row) => {
    if (row.scenicScore > acc) return row.scenicScore
    return acc
  }, 0)
}

// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  rows = parseRows(input.lines)
  const data = getData()
  const partOne = getPartOneAnswer(data)
  const partTwo = getPartTwoAnswer(data)
  await writeAnswer(partOne, name, 1)
  await writeAnswer(partTwo, name, 2)
}
const INPUT_FILE_SAMPLE = "./src/day8/input-sample.txt"
const INPUT_FILE = "./src/day8/input.txt"

export function day8() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day8-sample")
  MAIN: solution(INPUT_FILE, "day8")
}
