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

export const separateIdsByType = (array: string[]) => {
	const { numbers, strings } = array.reduce(
		(acc, item) => {
			if (/^\d+$/.test(item)) {
				const number = Number.parseInt(item, 10);
				acc.numbers.push(number);
			} else {
				acc.strings.push(item);
			}
			return acc;
		},
		{ numbers: [] as number[], strings: [] as string[] },
	);
	return { numbers, strings };
};

export const isUUID = (str: string): boolean =>
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		str,
	);

export const cleanString = (input: string): string => {
	return input.replace(/[\n\f\r\t\v]/g, " ").trim();
};
