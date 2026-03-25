import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { appRouter } from "./routers/app";
import { createContext } from "./trpc";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(
	"/api/trpc",
	createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

app.listen(port, () => {
	console.log(`API server running on http://localhost:${port}`);
});
