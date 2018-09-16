export { createFileFromBuffer, File } from '@shutter/api'
export { TestResult } from './results'
export * from './shutter'
export { createShutter as default } from './shutter'

import * as metacache from './metacache/index'
export { metacache }

import * as shutterrc from './shutterrc'
export { shutterrc }
