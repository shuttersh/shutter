interface EnvVars {
  [varName: string]: string
}

export async function withEnvironment (envVars: EnvVars, callback: () => any) {
  try {
    Object.assign(process.env, envVars)
    return await callback()
  } finally {
    for (const varName of Object.keys(envVars)) {
      delete process.env[varName]
    }
  }
}
