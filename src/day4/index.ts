import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

function getAnswer(input: string[]) {
  return input.reduce(
    (acc, row) => {
      const ranges = row.split(",")
      const tupleRanges = ranges.map((range) => range.split("-").map(Number))
      const [r1, r2] = tupleRanges

      const withinIncrement = compareRanges(r1, r2) || compareRanges(r2, r1) ? 1 : 0
      const incrementIntersect = compareRanges(r1, r2, true) || compareRanges(r2, r1, true) ? 1 : 0

      const within = acc.within + withinIncrement
      const intersect = acc.intersect + incrementIntersect
      return { within, intersect }
    },
    { within: 0, intersect: 0 }
  )
}

/**
 * Compares two ranges
 * if intersect is true, it will return true if the ranges intersect
 * if intersect is false, it will return true if the ranges first range is within the second range
 *
 * @param {number[]} target
 * @param {number[]} range
 * @param {boolean} intersect
 * @returns boolean
 */
function compareRanges(target: number[], range: number[], intersect: boolean = false) {
  const [minTarget, maxTarget] = target

  if (intersect) {
    return isWithinRange(minTarget, range) || isWithinRange(maxTarget, range)
  }

  return isWithinRange(minTarget, range) && isWithinRange(maxTarget, range)
}

function isWithinRange(target: number, range: number[]) {
  const [min, max] = range
  return target >= min && target <= max
}

// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  const { intersect, within } = getAnswer(input.lines)
  await writeAnswer(within, name, 1)
  await writeAnswer(intersect, name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day4/input-sample.txt"
const INPUT_FILE = "./src/day4/input.txt"

export function day4() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day4-sample")
  MAIN: solution(INPUT_FILE, "day4")
}
