import type { Context } from "hono";
import { getUserByUsername } from "../services/database.service.js";

export const getContextUserId = async (c: Context) => {
	const username = c.get("username");
	const user = await getUserByUsername(username);
	if (!user) {
		throw new Error('User not found');
	}
	return user.id;
};
