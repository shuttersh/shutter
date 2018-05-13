import { writeFile } from 'mz/fs'
import mkdirpCallback from 'mkdirp'
import * as path from 'path'
import { retrieveFile } from '@shutter/api'
import { URL } from 'url'

export interface TestCase {
  testName: string,
  expectationFilePath: string,
  expectationFileNotPresent: boolean,
  processedSnapshotPromise: Promise<any>
}

export interface TestResult {
  expectationFileNotPresent: boolean,
  match: boolean,
  similarity: number,
  snapshotID: string,
  testName: string
}

const mkdirp = (dirPath: string) => new Promise((resolve, reject) => mkdirpCallback(dirPath, error => error ? reject(error) : resolve()))

const createInspectionURL = (snapshotID: string) => {
  const shutterAppHost = process.env.SHUTTER_APP || 'https://app.shutter.sh/'
  return new URL(`/snapshot/${snapshotID}`, shutterAppHost).toString()
}

export const createResultData = async (test: TestCase): Promise<TestResult> => {
  const snapshot = await test.processedSnapshotPromise
  const { match, rendered, similarity } = snapshot.result

  if (test.expectationFileNotPresent) {
    const renderedContent = await retrieveFile(rendered)
    await mkdirp(path.dirname(test.expectationFilePath))
    await writeFile(test.expectationFilePath, renderedContent)
  }

  return {
    expectationFileNotPresent: test.expectationFileNotPresent,
    match,
    similarity,
    snapshotID: snapshot.id,
    testName: test.testName
  }
}

export const formatTestResultsOverview = (results: TestResult[]) => {
  const formattedTestcases = results
    .map(result => {
      return result.match
        ? `  ✔ ${result.testName}`
        : `  ✖ ${result.testName}\n     Similarity ${(result.similarity * 100).toFixed(2)}% - ${createInspectionURL(result.snapshotID)}`
    })
    .join('\n')

  return `Shutter tests failed. Tests:\n${formattedTestcases}`
}

export const formatSuccessMessage = (results: TestResult[]) => {
  return `Shutter ran ${results.length} tests ✔`
}
