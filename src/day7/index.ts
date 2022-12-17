import { readInput } from "utils/readInput"
import { writeAnswer } from "utils/writeAnswer"

type Dir = { name: string; files: File[]; size: number; childDirectories: string[]; path: string }
type DirMap = Map<string, Dir>
type File = { name: string; fileSize: number; completePath: string[]; dir: string[] }
type FileMap = Map<string[], File>
const defaultDir: Dir = { name: "", files: [], size: 0, childDirectories: [], path: "" }

function sequence(input: string[]) {
  let cwd: string[] = ["~"]
  const dirs: DirMap = new Map()
  const files: FileMap = new Map<string[], File>()

  for (const [i, line] of input.entries()) {
    if (!line.startsWith("$")) continue
    const [, command, arg] = line.split(" ")
    switch (command) {
      case "cd":
        cd(arg, cwd, dirs)
      case "ls":
        ls(cwd, files, dirs, input.slice(i + 1))
    }
  }

  return { files, dirs }
}

function ls(cwd: string[], files: FileMap, dirs: DirMap, input: string[]) {
  for (const line of input) {
    if (line.startsWith("$")) break
    if (line.startsWith("dir")) {
      const [, arg] = line.split(" ")
      const nestedDir = [...cwd, arg]
      const nestedPath = nestedDir.join("/")

      for (const [i, d] of cwd.entries()) {
        const path = cwd.slice(0, i + 1).join("/")
        const parent = dirs.get(path) || { ...defaultDir, name: d }
        dirs.set(path, { ...parent, childDirectories: [...parent.childDirectories, nestedPath] })
      }
      continue
    }

    const [sizeStr, name] = line.split(" ")
    const size = Number(sizeStr)
    const completePath = [...cwd, name]
    const newCwd = [...cwd]

    const file = { name, fileSize: size, completePath, dir: newCwd }
    files.set(completePath, file)

    const dirPath = newCwd.join("/")
    const dir = dirs.get(dirPath) || defaultDir
    dirs.set(dirPath, { ...dir, files: [...dir.files, file], size: dir.size + size })
  }
}

function cd(arg: string, cwd: string[], dirs: DirMap) {
  switch (arg) {
    case "/": {
      const path = "~"
      dirs.set(path, { ...(dirs.get(path) || defaultDir), name: "~", path })
      return ["~"]
    }
    case "..": {
      cwd.pop()
      return cwd
    }
    default: {
      cwd.push(arg)
      const path = cwd.join("/")
      dirs.set(path, { ...(dirs.get(path) || defaultDir), name: arg, path: cwd.join("/") })
      return cwd
    }
  }
}

function getPartOneAnswer(dirs: DirMap) {
  return [...dirs.values()].reduce((acc, curr) => {
    const MAX_SIZE = 100_000

    const childrenSize = curr.childDirectories.reduce((acc, curr) => {
      const dir = dirs.get(curr)
      return acc + (dir?.size || 0)
    }, 0)

    const dirSize = curr.size + childrenSize
    if (dirSize > MAX_SIZE) return acc
    return acc + dirSize
  }, 0)
}

function getPartTwoAnswer(files: FileMap, dirMap: DirMap) {
  const diskSize = 70_000_000
  const spaceNeeded = 30_000_000

  const used = [...files.values()].reduce((acc, curr) => {
    return acc + curr.fileSize
  }, 0)

  const freeSpace = diskSize - used
  const spaceNeedToBeFreed = spaceNeeded - freeSpace

  const dirs = [...dirMap.values()].reduce<Map<string, number>>((acc, curr) => {
    const path = curr.path
    const size = acc.get(path) || 0

    const childrenSize = curr.childDirectories.reduce((acc, curr) => {
      const dir = dirMap.get(curr)
      return acc + (dir?.size || 0)
    }, 0)

    return acc.set(path, size + curr.size + childrenSize)
  }, new Map())

  const eligible = [...dirs.values()].filter((val) => val > spaceNeedToBeFreed)
  return Math.min(...eligible)
}

// ===================================
async function solution(inputPath: string, name: string) {
  const input = await readInput(inputPath, false)
  const { files, dirs } = sequence(input.lines)
  const partOne = getPartOneAnswer(dirs)
  const partTwo = getPartTwoAnswer(files, dirs)
  await writeAnswer(partOne, name, 1)
  await writeAnswer(partTwo, name, 2)
}

const INPUT_FILE_SAMPLE = "./src/day7/input-sample.txt"
const INPUT_FILE = "./src/day7/input.txt"

export function day7() {
  SAMPLE: solution(INPUT_FILE_SAMPLE, "day7-sample")
  MAIN: solution(INPUT_FILE, "day7")
}
