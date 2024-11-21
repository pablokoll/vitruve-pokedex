import {
	type UseMutateFunction,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from "react";
import { api } from "../api/api";
import { me, signin, signup } from "../api/auth";
import { AUTH_QUERY_KEY } from "../constants";
import type { AuthResponse } from "../shared/interfaces/auth.interface";

interface UserForm {
	username: string;
	password: string;
}

interface AuthContextType {
	auth: AuthResponse | null | undefined;
	isAuthenticated: boolean;
	useSignUp: () => UseMutateFunction<AuthResponse, unknown, UserForm, unknown>;
	useSignIn: () => UseMutateFunction<AuthResponse, unknown, UserForm, unknown>;
	useSignOut: () => () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const queryClient = useQueryClient();

	const { data: auth, isLoading, isFetching, isPending, status } = useQuery<AuthResponse | null>({
		queryKey: [AUTH_QUERY_KEY],
		queryFn: me,
		staleTime: Number.POSITIVE_INFINITY,
	});
	const useSignUp = (): UseMutateFunction<
		AuthResponse,
		Error,
		UserForm,
		unknown
	> => {
		const { mutate: signUpMutation } = useMutation<
			AuthResponse,
			Error,
			UserForm,
			unknown
		>({
			mutationFn: ({ username, password }: UserForm) =>
				signup(username, password),
			onSuccess: (data: AuthResponse) => {
				localStorage.setItem("token", data.token);
				api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

				document.dispatchEvent(new Event("userAuthenticated"));
				queryClient.setQueryData([AUTH_QUERY_KEY], data);
			},
			onError: (error: Error) => {
				console.error(`Error signing up: ${error.message}`);
			},
		});

		return signUpMutation;
	};

	const useSignIn = (): UseMutateFunction<
		AuthResponse,
		Error,
		UserForm,
		unknown
	> => {
		const { mutate: signInMutation } = useMutation<
			AuthResponse,
			Error,
			UserForm,
			unknown
		>({
			mutationFn: ({ username, password }: UserForm) =>
				signin(username, password),
			onSuccess: (data: AuthResponse) => {
				localStorage.setItem("token", data.token);
				api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

				document.dispatchEvent(new Event("userAuthenticated"));
				queryClient.setQueryData([AUTH_QUERY_KEY], data);
			},
			onError: (error: Error) => {
				console.error(`Error signing in: ${error.message}`);
			},
		});

		return signInMutation;
	};

	const useSignOut = (): (() => void) => {
		const onSignOut = useCallback(() => {
			api.defaults.headers.common.Authorization = null;
			queryClient.setQueryData([AUTH_QUERY_KEY], null)
			localStorage.removeItem("token");
			document.dispatchEvent(new Event("userNotAuthenticated"));
		}, []);

		return onSignOut;
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			api.defaults.headers.common.Authorization = `Bearer ${token}`;
			queryClient.setQueryData([AUTH_QUERY_KEY], { token });
		}
	}, [auth]);

	const contextValue = useMemo(
		() => ({
			auth,
			isAuthenticated: !!auth && !isLoading,
			useSignUp,
			useSignIn,
			useSignOut,
		}),
		[auth],
	);

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth should be used only in AuthProvider");
	}
	return context;
};

export default AuthProvider;
