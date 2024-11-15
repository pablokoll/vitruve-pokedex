import bcrypt from "bcrypt";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { sign } from "hono/jwt";
import { bearerAuthMiddleware } from "../middlewares/auth.middleware.js";
import { createUser, getUserByUsername } from "../services/database.service.js";
import type { Bindings, Variables } from "../shared/types/app.type.js";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.post("/signup", async (c) => {
	const { username, password } = await c.req.json();

	if (!username || !password || password.length < 8) {
		return c.json({ error: "Invalid username or password format" }, 400);
	}
	const user = await getUserByUsername(username, {id: true});
	if (user) {
		return c.json({ error: "User already exists" }, 400);
	}
	const hashedPassword = await bcrypt.hash(password, 12);
	const { JWT_SECRET } = env(c, "node");
	const userCreated = await createUser(username, hashedPassword);
	const accessToken = await sign({ username }, JWT_SECRET);

	return c.json({ user: userCreated, token: accessToken });
});

app.post("/signin", async (c) => {
	const { username, password } = await c.req.json();
	const user = await getUserByUsername(username, {id: true, username: true, password: true});

	if (!(user && (await bcrypt.compare(password, user.password as string)))) {
		return c.json({ error: "Invalid credentials" }, 401);
	}

	const { JWT_SECRET } = env(c, "node");

	const accessToken = await sign({ username }, JWT_SECRET);
	return c.json({
		user: { id: user.id, username: user.username },
		token: accessToken,
	});
});

app.use("/*", bearerAuthMiddleware);

app.get("/me", async (c) => {
	const username = c.get("username");
	const user = await getUserByUsername(username, {id: true, username: true});
	return c.json({ user });
});

export default app;
