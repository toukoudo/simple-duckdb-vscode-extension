import * as vscode from "vscode";
const duckdb = require(`${"./duckdb"}`) as typeof import("./duckdb");

export const activate = async (context: vscode.ExtensionContext) => {
	const dbPromise = duckdb.initDb(context);

	const disposable = vscode.commands.registerCommand('simple-duckdb-example.helloWorld', async () => {
		vscode.window.showInformationMessage("duckdb-wasm is activating...");
		const db = await dbPromise;
		vscode.window.showInformationMessage("duckdb-wasm is activated...");
    });
};

// export const deactivate = async () => {
//   const db = await dbPromise;
//   await db.terminate();
// };