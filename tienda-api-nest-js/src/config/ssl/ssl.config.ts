import { readFileSync } from 'fs'
import { resolve } from 'path'

export function getSSLOptions() {
  const key = readFileSync(resolve(process.env.SSL_KEY))
  const cert = readFileSync(resolve(process.env.SSL_CERT))

  return { key, cert }
}
