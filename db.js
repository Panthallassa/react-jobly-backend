import pkg from "pg";
import { getDatabaseUri } from "./config.js";

const { Pool } = pkg;

let db;

if (process.env.NODE_ENV === "production") {
	db = new Pool({
		connectionString: getDatabaseUri(),
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	db = new Pool({
		connectionString: getDatabaseUri(),
	});
}

export default db;
