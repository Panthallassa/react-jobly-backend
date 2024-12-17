import express from "express";
import cors from "cors";
import { NotFoundError } from "./expressError.js";
import { authenticateJWT } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import companiesRoutes from "./routes/companies.js";
import usersRoutes from "./routes/users.js";
import jobsRoutes from "./routes/jobs.js";
import testRoutes from "./routes/testRoutes.js";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/companies", companiesRoutes);
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
	return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
	if (process.env.NODE_ENV !== "test")
		console.error(err.stack);
	const status = err.status || 500;
	const message = err.message;

	return res.status(status).json({
		error: { message, status },
	});
});

// Test-related routes (only enable in test environment)
if (process.env.NODE_ENV === "test") {
	app.use("/api/test", testRoutes);
}

export default app;
