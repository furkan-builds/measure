import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { appRouter } from "./routers/app";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(cors());
app.use(
	"/api/trpc",
	createExpressMiddleware({
		router: appRouter,
	}),
);

app.listen(port, () => {
	console.log(`API server running on http://localhost:${port}`);
});
