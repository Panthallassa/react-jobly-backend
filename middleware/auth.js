import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { UnauthorizedError } from "../expressError.js";

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
	try {
		const authHeader =
			req.headers && req.headers.authorization;
		console.log("Authorization Header:", authHeader);
		if (authHeader) {
			const token = authHeader
				.replace(/^[Bb]earer /, "")
				.trim();
			console.log("Extracted Token:", token);
			try {
				res.locals.user = jwt.verify(token, SECRET_KEY);
			} catch (err) {
				console.error("Invalid Token:", err.message);
				return next();
			}
		}
		console.log("res.locals.user:", res.locals.user);
		return next();
	} catch (err) {
		return next();
	}
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
	try {
		if (!res.locals.user) throw new UnauthorizedError();
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to use when they must be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
	try {
		if (!res.locals.user || !res.locals.user.isAdmin) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
	try {
		const user = res.locals.user;
		if (
			!(
				user &&
				(user.isAdmin ||
					user.username === req.params.username)
			)
		) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

export {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdmin,
};
