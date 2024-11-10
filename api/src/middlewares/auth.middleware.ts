import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { verify } from "hono/jwt";

export const bearerAuthMiddleware = bearerAuth({
	verifyToken: async (token, c) => {
		if (!token) {
			return false;
		}
		const { JWT_SECRET } = env(c, "node");
		const verified = await verify(token, JWT_SECRET);
		if (!verified?.username) {
			return false;
		}
		c.set("username", verified.username);
		return true;
	},
});
