import request from 'superagent'
import { URL } from 'url'

const createServiceURL = (shutterHost: string, path: string) => {
  return new URL(path, shutterHost).toString()
}

interface TestcaseCreationParams {
  testRunID: string,
  name: string
}

export const createTestcase = async (shutterHost: string, params: TestcaseCreationParams, htmlPath: string, assetPaths: string[]) => {
  const testCaseID = Math.ceil(Math.random() * 10000)

  const metadata = {
    name: params.name
  }

  const req = request
    .post(createServiceURL(shutterHost, `/testrun/${params.testRunID}/testcase/${testCaseID}`))
    .field('meta', JSON.stringify(metadata))
    .attach('page', htmlPath, { contentType: 'text/html' })

  for (const assetPath of assetPaths) {
    req.attach('files[]', assetPath)
  }

  const response = await req
  return response.body
}

export const retrieveTestcase = async (shutterHost: string, id: string) => {
  const response = await request
    .get(createServiceURL(shutterHost, `/testcase/${id}`))

  return response.body
}
