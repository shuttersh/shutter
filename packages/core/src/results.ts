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
  expectationFilePath: string,
  match: boolean,
  similarity: number,
  snapshotID: string,
  snapshotSetID: string,
  testName: string
}

const mkdirp = (dirPath: string) => new Promise((resolve, reject) => mkdirpCallback(dirPath, error => error ? reject(error) : resolve()))

export const createInspectionURL = (result: TestResult) => {
  return new URL(`/snapshot-set/${result.snapshotSetID}`, 'https://shutter.sh/').toString()
}

export const syncSnapshot = async (test: TestCase, updateSnapshots: boolean) => {
  const snapshot = await test.processedSnapshotPromise
  const { match, rendered } = snapshot.result

  if (test.expectationFileNotPresent || (!match && updateSnapshots)) {
    const renderedContent = await retrieveFile(rendered)
    await mkdirp(path.dirname(test.expectationFilePath))
    await writeFile(test.expectationFilePath, renderedContent)
  }
}

export const createResultData = async (test: TestCase): Promise<TestResult> => {
  const snapshot = await test.processedSnapshotPromise
  const { match, similarity } = snapshot.result

  return {
    expectationFileNotPresent: test.expectationFileNotPresent,
    expectationFilePath: test.expectationFilePath,
    match,
    similarity,
    snapshotID: snapshot.id,
    snapshotSetID: snapshot.snapshotSetId,
    testName: test.testName
  }
}

export const formatTestResultsOverview = (results: TestResult[]) => {
  return results
    .map(result => {
      return result.match
        ? `  ✔ ${result.testName}`
        : `  ✖ ${result.testName} (similarity ${(result.similarity * 100).toFixed(2)}%)`
    })
    .join('\n')
}

export const formatSuccessMessage = (results: TestResult[]) => {
  return `Shutter ran ${results.length} tests ✔`
}
