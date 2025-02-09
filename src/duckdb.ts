import {join} from 'path';

import * as duckdb from "@duckdb/duckdb-wasm";
import Worker from "web-worker";


export const initDb = async (ctx: any) => {
	const logger = new duckdb.ConsoleLogger();

    const distPath = join(ctx.extensionPath, 'dist');
    console.log(distPath);
    const bundle = {
        mainModule: join(distPath, 'duckdb-eh.wasm'),
        mainWorker: join(distPath, 'duckdb-node-eh.worker.js')
    };

    const url = new URL(`file://${join(__dirname, "./duckdb-node-eh.worker.js")}`).toString();
    console.log(url);
	const worker = new Worker(
		url!,  { type: "module" }
	);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, url);

    const c = await db.connect();
    const result = c.query('select 1 as c');
    console.log(result);

    return db;
};