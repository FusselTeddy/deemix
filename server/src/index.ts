import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import type { Arguments } from './types'

import { DeemixServer } from './server'

const isModule = process.mainModule && process.mainModule.parent

if (!isModule) {
	// TODO: Remove type assertion while keeping correct types
	const argv = yargs(hideBin(process.argv)).options({
		port: { type: 'string', default: '6595' },
		host: { type: 'string', default: '127.0.0.1' }
	}).argv as Arguments

	const DEEMIX_SERVER_PORT = process.env.DEEMIX_SERVER_PORT ?? argv.port
	const DEEMIX_HOST = process.env.DEEMIX_HOST ?? argv.host

	const server = new DeemixServer(DEEMIX_HOST, DEEMIX_SERVER_PORT)
	server.init()
}

export { DeemixServer }
