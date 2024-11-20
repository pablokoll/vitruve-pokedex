import type { Context, Next } from "hono";
import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { jwt, verify } from "hono/jwt";

export const bearerAuthMiddleware = bearerAuth({
	verifyToken: async (token, c) => {
		if (!token) {
			return false;
		}
		const { JWT_SECRET } = env(c, "node");
		const verified = await verify(token, JWT_SECRET).catch(() => null);
		if (!verified?.username) {
			return false;
		}
		c.set("username", verified.username);
		return true;
	},
	invalidTokenMessage: "Invalid token",
	noAuthenticationHeaderMessage: "No authentication header",
});

export const jwtUserMiddleware = async (c: Context, next: Next) => {
	const { JWT_SECRET } = env(c, "node");
	const token = c.req.header("Authorization")?.split("  ")[1];

	if (token) {
		try {
			const jwtMiddleware = jwt({
				secret: JWT_SECRET,
			});
			const verified = await verify(token, JWT_SECRET).catch(() => null);
			if (verified?.username) {
				c.set("username", verified.username);
			}
			await jwtMiddleware(c, next);
		} catch (err) {
			console.error("JWT error:", err);
			await next();
		}
	} else {
		await next();
	}
};
