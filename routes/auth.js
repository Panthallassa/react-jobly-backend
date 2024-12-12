import jsonschema from "jsonschema";
import express from "express";
import User from "../models/user.js";
import { createToken } from "../helpers/tokens.js";
import userAuthSchema from "../schemas/userAuth.json" assert { type: "json" };
import userRegisterSchema from "../schemas/userRegister.json" assert { type: "json" };
import { BadRequestError } from "../expressError.js";

const router = express.Router();

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/token", async function (req, res, next) {
	try {
		const validator = jsonschema.validate(
			req.body,
			userAuthSchema
		);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const { username, password } = req.body;
		const user = await User.authenticate(
			username,
			password
		);
		const token = createToken(user);
		return res.json({ token });
	} catch (err) {
		return next(err);
	}
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/register", async function (req, res, next) {
	try {
		const validator = jsonschema.validate(
			req.body,
			userRegisterSchema
		);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const newUser = await User.register({
			...req.body,
			isAdmin: false,
		});
		const token = createToken(newUser);
		return res.status(201).json({ token });
	} catch (err) {
		return next(err);
	}
});

export default router;
