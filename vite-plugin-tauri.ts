import TauriCli from '@tauri-apps/cli';
import { exec, type ExecOptionsWithStringEncoding } from 'child_process';
import type { AddressInfo, Server } from 'net';
import { join, relative } from 'path';
import type { Plugin, ResolvedConfig } from 'vite';

interface BuildOptions {
    debug?: boolean;
    verbose?: boolean;
    target?: string;
    features?: string[];
    bundles?: string[];
    runner?: string;
}

interface DevOptions {
    exitOnPanic?: boolean;
    features?: string[];
    runner?: string;
    release?: boolean;
    target?: string;
}

interface PluginOptions {
    tauriProjectDir?: string;
    build?: BuildOptions;
    dev?: DevOptions;
}

export default function tauriPlugin(options?: PluginOptions): Plugin {
    let config: ResolvedConfig;
    // let server: ViteDevServer;
    let listeningHTTPServer: Promise<Server>;

    return {
        name: 'tauri',
        config() {
            // prevent user from opening browser
            return {
                server: {
                    open: false
                }
            };
        },
        configureServer(server) {
            listeningHTTPServer = new Promise((resolve, reject) => {
                const { httpServer } = server;
                if (httpServer === null) {
                    reject(new Error("Couldn't access httpServer :("));
                    return;
                }

                httpServer.addListener('listening', () => {
                    resolve(httpServer);
                });
            });
        },
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        async buildStart() {
            if (config.command === 'serve') {
                listeningHTTPServer.then(httpServer => {
                    const devPath = getServerURL(httpServer, config);

                    const cliArgs: string[] = [];

                    if (options?.dev?.exitOnPanic) cliArgs.push('--exit-on-panic');

                    if (options?.dev?.features !== undefined) {
                        cliArgs.push('--features', options.dev.features.join(','));
                    }

                    if (options?.dev?.runner !== undefined) {
                        cliArgs.push('--runner', options.dev.runner);
                    }

                    if (options?.dev?.release) cliArgs.push('--release');

                    if (options?.dev?.target !== undefined) {
                        cliArgs.push('--target', options.dev.target);
                    }
                    return TauriCli.run(
                        [
                            'dev',
                            '--config',
                            JSON.stringify({
                                build: { devPath }
                            }),
                            ...cliArgs
                        ],
                        undefined
                    );
                });
            }
        },
        async writeBundle() {
            // relative path from tauri project dir to web-assets dir
            const distDir = relative(
                join(__dirname, options?.tauriProjectDir ?? './src-tauri'), // absolute path to tauri project dir
                join(config.root, config.build.outDir) // absolute path to web assets dir
            );

            const cliArgs: string[] = [];

            if (options?.build?.debug) cliArgs.push('--debug');

            if (options?.build?.verbose) cliArgs.push('--verbose');

            if (options?.build?.target !== undefined) {
                cliArgs.push('--target', options.build.target);
            }

            if (options?.build?.features !== undefined) {
                cliArgs.push('--features', options.build.features.join(','));
            }

            if (options?.build?.bundles !== undefined) {
                cliArgs.push('--bundles', options.build.bundles.join(','));
            }

            if (options?.build?.runner !== undefined) {
                cliArgs.push('--runner', options.build.runner);
            }

            await TauriCli.run(
                [
                    'build',
                    '--config',
                    JSON.stringify({
                        build: { distDir }
                    }),
                    ...cliArgs
                ],
                undefined
            );
        }
    };
}

function getServerURL(server: Server, config: ResolvedConfig): string {
    const address = server.address();
    const isAddressInfo = (x: null | AddressInfo | string): x is AddressInfo => x !== null && typeof x !== 'string';
    if (!isAddressInfo(address)) {
        throw new Error("Couldn't obtain address :(");
    }

    const hostname = resolveHostname(config.server.host);
    const protocol = config.server.https ? 'https' : 'http';
    const port = address.port;
    const base = config.base;

    if (hostname.host === '127.0.0.1') {
        return `${protocol}://${hostname.name}:${port}${base}`;
    } else {
        let host: string;

        if (address.family === 'IPv6' && address.address === '::') {
            host = '::1';
        } else if (address.family === 'IPv4' && address.address === '0.0.0.0') {
            host = '127.0.0.1';
        } else {
            host = address.address;
        }

        if (address.family === 'IPv6') {
            host = `[${host}]`;
        }

        return `${protocol}://${host}:${port}${base}`;
    }
}

function resolveHostname(optionsHost: string | boolean | undefined): {
    host: string | undefined;
    name: string;
} {
    let host: string | undefined;
    if (optionsHost === undefined || optionsHost === false) {
        // Use a secure default
        host = '127.0.0.1';
    } else if (optionsHost === true) {
        // If passed --host in the CLI without arguments
        host = undefined; // undefined typically means 0.0.0.0 or :: (listen on all IPs)
    } else {
        host = optionsHost;
    }

    // Set host name to localhost when possible, unless the user explicitly asked for '127.0.0.1'
    const name =
        (optionsHost !== '127.0.0.1' && host === '127.0.0.1') ||
        host === '0.0.0.0' ||
        host === '::' ||
        host === undefined
            ? 'localhost'
            : host;

    return { host, name };
}

async function execCmd(
    cmd: string,
    args: string[],
    options: Omit<ExecOptionsWithStringEncoding, 'encoding'> = {}
): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(`${cmd} ${args.join(' ')}`, { ...options, encoding: 'utf-8' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Failed to execute cmd ${cmd} with args: ${args.join(' ')}. reason: ${error}`);
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}
