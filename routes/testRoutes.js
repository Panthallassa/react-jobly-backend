import express from "express";
import db from "../db.js"; // Adjust the path to your DB client if necessary

const router = express.Router();

/**
 * POST /reset-database
 * Resets the database for testing purposes.
 */
router.post("/reset-database", async (req, res) => {
	try {
		// Clear existing data
		await db.query("DELETE FROM applications;");
		await db.query("DELETE FROM jobs;");
		await db.query("DELETE FROM companies;");
		await db.query("DELETE FROM users;");

		// Seed test data for companies
		await db.query(`
      INSERT INTO companies (handle, name, description, num_employees, logo_url)
      VALUES ('apple', 'Apple', 'Tech giant', 5000, '/logos/apple.png'),
             ('google', 'Google', 'Search engine leader', 10000, '/logos/google.png');
    `);

		// Seed test data for jobs
		await db.query(`
      INSERT INTO jobs (id, title, salary, equity, company_handle)
      VALUES (1, 'Software Engineer', 120000, '0.05', 'apple'),
             (2, 'Data Scientist', 110000, '0.1', 'google');
    `);

		// Seed test data for users
		await db.query(`
      INSERT INTO users (username, password, first_name, last_name, email, is_admin)
      VALUES 
        ('testuser', 'hashedpassword', 'Test', 'User', 'testuser@example.com', false),
        ('adminuser', 'hashedpassword', 'Admin', 'User', 'admin@example.com', true);
    `);

		// Seed test data for applications
		await db.query(`
      INSERT INTO applications (username, job_id)
      VALUES ('testuser', 1);
    `);

		res
			.status(200)
			.send("Test database reset successfully.");
	} catch (err) {
		console.error("Error resetting database:", err);
		res.status(500).send("Failed to reset database.");
	}
});

export default router;
