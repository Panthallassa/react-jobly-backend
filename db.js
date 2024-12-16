import pkg from "pg";
import { getDatabaseUri } from "./config.js";

const { Client } = pkg;

let db;

if (process.env.NODE_ENV === "production") {
	db = new Client({
		connectionString: getDatabaseUri(),
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	db = new Client({
		connectionString: getDatabaseUri(),
		ssl: process.env.DATABASE_URL
			? { rejectUnauthorized: false }
			: undefined, // Only apply SSL if DATABASE_URL is defined
	});
}

db.connect();

db.connect((err) => {
	if (err) {
		console.error("Error connecting to the database:", err);
		process.exit(1); // Exit the process if the database connection fails
	} else {
		console.log("Successfully connected to the database.");
	}
});

export default db;
