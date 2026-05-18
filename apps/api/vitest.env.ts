// Shared test environment variables used by vitest config and global setup.
// Kept in one place so the test database URL isn't duplicated.
const testEnv = {
	DATABASE_URL: "postgresql://measure:measure@localhost:5432/measure_test",
	JWT_SECRET: "test-secret-do-not-use-in-production",
};

export { testEnv };
