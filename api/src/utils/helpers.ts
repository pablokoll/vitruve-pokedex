import type { Context } from "hono";
import { getUserByUsername } from "../services/database.service.js";

export const getContextUserId = async (c: Context): Promise<string> => {
	const username = c.get("username");
	const user = await getUserByUsername(username, { id: true });
	if (!user) {
		throw new Error("User not found");
	}
	return user.id as string;
};
