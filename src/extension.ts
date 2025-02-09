import * as vscode from "vscode";
const duckdb = require(`${"./duckdb"}`) as typeof import("./duckdb");


export const activate = async (context: vscode.ExtensionContext) => {
	const dbPromise = duckdb.initDb(context);

	const disposable = vscode.commands.registerCommand('simple-duckdb-example.helloDuckDBWASM', async () => {
		vscode.window.showInformationMessage("duckdb-wasm is activating...");
		const db = await dbPromise;
		vscode.window.showInformationMessage("duckdb-wasm is activated...");

		// try simple command for example
		const c = await db.connect();
		const query = "select 'quack' as duck";
		const result = await c.query(query);

		vscode.window.showInformationMessage(`query ${query} return ${result}`);
	});
};

// TODO need deactivate?

// export const deactivate = async () => {
//   const db = await dbPromise;
//   await db.terminate();
// };