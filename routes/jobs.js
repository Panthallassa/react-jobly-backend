import jsonschema from "jsonschema";
import express from "express";

import { BadRequestError } from "../expressError.js";
import { ensureAdmin } from "../middleware/auth.js";
import Job from "../models/job.js";

import jobNewSchema from "../schemas/jobNew.json" assert { type: "json" };
import jobUpdateSchema from "../schemas/jobUpdate.json" assert { type: "json" };
import jobSearchSchema from "../schemas/jobSearch.json" assert { type: "json" };

const router = express.Router({ mergeParams: true });

/** POST / { job } => { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */
router.post(
	"/",
	ensureAdmin,
	async function (req, res, next) {
		try {
			const validator = jsonschema.validate(
				req.body,
				jobNewSchema
			);
			if (!validator.valid) {
				const errs = validator.errors.map((e) => e.stack);
				throw new BadRequestError(errs);
			}

			const job = await Job.create(req.body);
			return res.status(201).json({ job });
		} catch (err) {
			return next(err);
		}
	}
);

/** GET / =>
 *   { jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...] }
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */
router.get("/", async function (req, res, next) {
	const q = req.query;
	// Convert query strings into appropriate types
	if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
	q.hasEquity = q.hasEquity === "true";

	try {
		const validator = jsonschema.validate(
			q,
			jobSearchSchema
		);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const jobs = await Job.findAll(q);
		return res.json({ jobs });
	} catch (err) {
		return next(err);
	}
});

/** GET /[jobId] => { job }
 *
 * Returns { id, title, salary, equity, company }
 *   where company is { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: none
 */
router.get("/:id", async function (req, res, next) {
	try {
		const job = await Job.get(req.params.id);
		return res.json({ job });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[jobId]  { fld1, fld2, ... } => { job }
 *
 * Data can include: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */
router.patch(
	"/:id",
	ensureAdmin,
	async function (req, res, next) {
		try {
			const validator = jsonschema.validate(
				req.body,
				jobUpdateSchema
			);
			if (!validator.valid) {
				const errs = validator.errors.map((e) => e.stack);
				throw new BadRequestError(errs);
			}

			const job = await Job.update(req.params.id, req.body);
			return res.json({ job });
		} catch (err) {
			return next(err);
		}
	}
);

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 */
router.delete(
	"/:id",
	ensureAdmin,
	async function (req, res, next) {
		try {
			await Job.remove(req.params.id);
			return res.json({ deleted: +req.params.id });
		} catch (err) {
			return next(err);
		}
	}
);

export default router;
