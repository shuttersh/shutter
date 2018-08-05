interface EnvVars {
  [varName: string]: string
}

export async function withEnvironment (envVars: EnvVars, callback: () => any) {
  const originalEnv = process.env

  try {
    process.env = Object.assign({}, process.env, envVars)
    return await callback()
  } finally {
    process.env = originalEnv
  }
}
