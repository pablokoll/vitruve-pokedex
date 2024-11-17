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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const separateIdsByType = (array: any[]) => {
	const { numbers, strings } = array.reduce(
		(acc, item) => {
		  if (/^\d+$/.test(item)) {
			acc.numbers.push(item);
		  } else {
			acc.strings.push(item);
		  }
		  return acc;
		},
		{ numbers: [], strings: [] }
	  );
	return { numbers, strings };
};
