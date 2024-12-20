import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
	const uri =
		process.env.NODE_ENV === "test"
			? "jobly_test"
			: process.env.DATABASE_URL || "jobly";
	console.log("Resolved Database URI:", uri);
	return uri;
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR =
	process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log(
	"BCRYPT_WORK_FACTOR:".yellow,
	BCRYPT_WORK_FACTOR
);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

export {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri,
};
