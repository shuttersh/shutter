export interface CollectedMetadata {
  'package:name'?: string,
  'repo:branch'?: string,
  'repo:commitmsg'?: string,
  'repo:origin'?: string,
  'repo:pullreq'?: string,
  'repo:revision'?: string,
  'repo:tag'?: string
}

export interface Collector {
  name: string,
  testEnvironment (dirPath: string): Promise<boolean>,
  collect (dirPath: string): Promise<CollectedMetadata>
}
