import request from 'superagent'
import { URL } from 'url'

const createServiceURL = (shutterHost: string, path: string) => {
  return new URL(path, shutterHost).toString()
}

export const createSnapshot = async (shutterHost: string, htmlPath: string, assetPaths: string[]) => {
  const snapshotID = Math.ceil(Math.random() * 10000)

  const req = request
    .post(createServiceURL(shutterHost, `/snapshot/${snapshotID}`))
    .attach('page', htmlPath, { contentType: 'text/html' })

  for (const assetPath of assetPaths) {
    req.attach('files[]', assetPath)
  }

  const response = await req
  return response.body
}

export const retrieveFile = async (shutterHost: string, fileHash: string) => {
  const response = await request
    .get(createServiceURL(shutterHost, `/file/${fileHash}`))
    .responseType('blob')

  return response.body
}

export const retrieveProcessedSnapshot = async (shutterHost: string, snapshotID: string) => {
  const response = await request
    .get(createServiceURL(shutterHost, `/snapshot/${snapshotID}/processed`))

  return response.body
}
