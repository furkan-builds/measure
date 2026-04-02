// biome-ignore lint/style/noDefaultExport: jest requires default export
export default {
	preset: "jest-expo",
	testEnvironment: "jsdom",
	testMatch: ["<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}"],
	transformIgnorePatterns: [
		"node_modules/(?!(?:.pnpm/)?(?:react-native|@react-native|expo|@expo|jest-expo))",
	],
};
