const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

async function main() {
	const ctx = await esbuild.context({
		entryPoints: {
			"extension": "src/extension.ts",
			"duckdb": "src/duckdb.ts",
			"duckdb-node-eh.worker": "node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-eh.worker.cjs",
		  },
		bundle: true,
		format: 'cjs',
		// disable minification. If enable "Error: Cannot find module 'vscode'" error occurs
		// minify: production,
		sourcemap: !production,
		outdir: "dist",
		sourcesContent: false,
		platform: 'node',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
		loader: {
			".wasm": "file",
		},
		define: { 'import.meta.url': '_importMetaUrl' },
		banner: {
			js: "const _importMetaUrl=require('url').pathToFileURL(__filename)",
		},
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
