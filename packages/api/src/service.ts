import request from 'superagent'
import { URL } from 'url'
import { File } from './file'

const createServiceURL = (path: string) => {
  const shutterAPIHost = process.env.SHUTTER_API || 'https://api.shutter.sh/'
  return new URL(path, shutterAPIHost).toString()
}

export const createSnapshot = async (page: File, pageAssets: File[]) => {
  const req = request
    .post(createServiceURL(`/snapshot`))
    .attach('page', await page.getContent(), {
      contentType: page.contentType || undefined,
      filename: page.fileName || 'index.html'
    })

  for (const asset of pageAssets) {
    req.attach('files[]', await asset.getContent(), {
      contentType: page.contentType || undefined,
      filename: page.fileName || 'index.html'
    })
  }

  const response = await req
  return response.body
}

export const retrieveFile = async (fileHash: string) => {
  const response = await request
    .get(createServiceURL(`/file/${fileHash}`))
    .responseType('blob')

  return response.body
}

export const retrieveProcessedSnapshot = async (snapshotID: string) => {
  const response = await request
    .get(createServiceURL(`/snapshot/${snapshotID}/processed`))

  return response.body
}
