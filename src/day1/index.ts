import { readInput } from "../utils/readInput"
import { writeAnswer } from "../utils/writeAnswer"

const INPUT_FILE_SAMPLE = "./src/day1/input-sample.txt"
const INPUT_FILE = "./src/day1/input.txt"

type ReduceData = { arr: number[][]; index: number }

function splitByEmptyString(arr: string[]) {
  const defaultValue: ReduceData = { arr: [], index: 0 }

  function reducer(acc: ReduceData, curr: string) {
    if (curr === "") return Object.assign(acc, { index: acc.index + 1 })
    const newArr = acc.arr
    newArr[acc.index] = [...(newArr[acc.index] ?? []), Number(curr)]
    return Object.assign(acc, { arr: newArr })
  }

  const data = arr.reduce<ReduceData>(reducer, defaultValue)
  return data.arr
}

function arrSum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0)
}

function sumPerArr(data: number[][]) {
  return data.map((arr) => arrSum(arr))
}

async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath)
  const elfCalories = splitByEmptyString(input.lines)
  const asc = sumPerArr(elfCalories).sort((a, b) => a - b)
  const top3Index = asc.length - 3
  const top3 = asc.slice(top3Index)
  const answer = arrSum(top3)

  const finalAnswer = {
    _answer: answer,
    top3sum: answer,
    top3,
    top3Index,
    asc,
    _input: input.str,
  }
  await writeAnswer(finalAnswer, name)
}

export async function day1() {
  SAMPLE_OUTPUT: await solution(INPUT_FILE_SAMPLE, "day1-sample")
  MAIN_OUTPUT: await solution(INPUT_FILE, "day1")
}
