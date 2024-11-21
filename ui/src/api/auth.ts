import type { AuthResponse } from "../shared/interfaces/auth.interface";
import { api } from "./api";

export const signup = async (
	username: string,
	password: string,
): Promise<AuthResponse> => {
	const response = await api.post("/auth/signup", {
		username,
		password,
	});
	return response.data;
};

export const signin = async (
	username: string,
	password: string,
): Promise<AuthResponse> => {
	const response = await api.post("/auth/signin", {
		username,
		password,
	});
	return response.data;
};

export const me = async (): Promise<AuthResponse | null> => {
	try {
		const response = await api.get("/auth/me");
		return response.data;
	} catch (error) {
		return null;
	}
};
