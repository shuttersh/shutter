import request from 'superagent'
import { URL } from 'url'
import { File } from './file'

const createServiceURL = (path: string) => {
  const shutterAPIHost = process.env.SHUTTER_API || 'https://api.shutter.sh/'
  return new URL(path, shutterAPIHost).toString()
}

export interface Labels {
  'ci'?: 'true',
  'package:name'?: string,
  'repo:branch'?: string,
  'repo:commitmsg'?: string,
  'repo:origin'?: string,
  'repo:pullreq'?: string,
  'repo:revision'?: string,
  'repo:tag'?: string
}

export interface SnapshotCreationOptions {
  expectation?: File | null,
  diffOptions?: DiffOptions,
  labels?: Labels,
  renderOptions?: RenderOptions
}

export interface DiffOptions {
  autoCrop?: boolean,
  relativeThreshold?: number
}

export interface RenderOptions {
  autoCrop?: boolean,
  omitBackground?: boolean
}

export const createSnapshot = async (authToken: string, page: File, pageAssets: File[], options: SnapshotCreationOptions = {}) => {
  const req = request
    .post(createServiceURL(`/snapshot`))
    .set('Authorization', `Bearer ${authToken}`)
    .attach('page', await page.getContent(), {
      contentType: page.contentType || 'text/html',
      filename: page.fileName || 'index.html'
    })

  if (options.expectation) {
    req.attach('expectation', await options.expectation.getContent(), {
      contentType: options.expectation.contentType || 'image/png',
      filename: options.expectation.fileName || 'expectation.png'
    })
  }
  if (options.diffOptions) {
    req.field('diffOptions', JSON.stringify(options.diffOptions))
  }
  if (options.renderOptions) {
    req.field('renderOptions', JSON.stringify(options.renderOptions))
  }
  if (options.labels) {
    req.field('labels', JSON.stringify(options.labels))
  }

  for (const asset of pageAssets) {
    if (!asset.fileName) throw new Error(`Additional asset lacks filename (index ${pageAssets.indexOf(asset)})`)

    req.attach('files[]', await asset.getContent(), {
      contentType: asset.contentType || undefined,
      filename: asset.fileName
    })
  }

  const response = await req
  return response.body
}

export const retrieveFile = async (fileHash: string) => {
  const response = await request
    .get(createServiceURL(`/file/${fileHash}`))
    .responseType('blob')

  return response.body as Buffer
}

export const retrieveProcessedSnapshot = async (snapshotID: string) => {
  const response = await request
    .get(createServiceURL(`/snapshot/${snapshotID}/processed`))

  return response.body
}
