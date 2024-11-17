import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import auth from "./routes/auth.route.js";
import pokemon from "./routes/pokemon.route.js";

type Bindings = {
	CORS_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use("*", async (c, next) => {
	const { CORS_ORIGIN } = env(c, "node");
	const middleware = cors({
		origin: CORS_ORIGIN || "*",
	});
	return middleware(c, next);
});

app.route("api/auth", auth);
app.route("api/pokemon", pokemon);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
