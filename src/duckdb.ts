import {join} from 'path';
import * as vscode from "vscode";
import * as duckdb from "@duckdb/duckdb-wasm";
import Worker from "web-worker";


export const initDb = async (ctx: vscode.ExtensionContext) => {
	const logger = new duckdb.ConsoleLogger();

    const distPath = join(ctx.extensionPath, 'dist');
    const bundle = {
        mainModule: join(distPath, 'duckdb-eh.wasm'),
        mainWorker: join(distPath, 'duckdb-node-eh.worker.js')
    };
    // Without type option, an error "ReferenceError: require is not defined" will be thrown (in console)
    const worker = new Worker(bundle.mainWorker, { type: "module" });
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.mainWorker);
    return db;
};