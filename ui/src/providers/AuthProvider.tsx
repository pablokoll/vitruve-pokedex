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
	useState,
} from "react";
import { useHistory } from "react-router";
import { api } from "../api/api";
import { me, signin, signup } from "../api/auth";
import { AUTH_LOCAL_STORAGE_KEY, AUTH_QUERY_KEY } from "../constants";
import type {
	AuthResponse,
	AuthUser,
} from "../shared/interfaces/auth.interface";

interface UserForm {
	username: string;
	password: string;
}

interface AuthContextType {
	auth: AuthResponse | null;
	isAuthenticated: boolean;
	setAuth: (authData: AuthResponse | null) => void;
	useSignUp: () => UseMutateFunction<AuthResponse, unknown, UserForm, unknown>;
	useSignIn: () => UseMutateFunction<AuthResponse, unknown, UserForm, unknown>;
	useSignOut: () => () => void;
	useUser: () => AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const authStorage = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
	const [auth, setAuth_] = useState(
		authStorage ? JSON.parse(authStorage) : null,
	);

	const setAuth = (auth: AuthResponse | null) => {
		setAuth_(auth);
	};

	const useSignUp = (): UseMutateFunction<
		AuthResponse,
		Error,
		UserForm,
		unknown
	> => {
		const queryClient = useQueryClient();
		const navigate = useHistory();

		const { mutate: signUpMutation } = useMutation<
			AuthResponse,
			Error,
			UserForm,
			unknown
		>({
			mutationFn: ({ username, password }: UserForm) =>
				signup(username, password),
			onSuccess: (data: AuthResponse) => {
				queryClient.setQueryData([AUTH_QUERY_KEY], data);
				setAuth(data);
				navigate.push("/");
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
		const queryClient = useQueryClient();
		const navigate = useHistory();

		const { mutate: signInMutation } = useMutation<
			AuthResponse,
			Error,
			UserForm,
			unknown
		>({
			mutationFn: ({ username, password }: UserForm) =>
				signin(username, password),
			onSuccess: (data: AuthResponse) => {
				queryClient.setQueryData([AUTH_QUERY_KEY], data);
				setAuth(data);
				navigate.push("/");
			},
			onError: (error: Error) => {
				console.error(`Error signing up: ${error.message}`);
			},
		});

		return signInMutation;
	};

	const useSignOut = (): (() => void) => {
		const queryClient = useQueryClient();
		const navigate = useHistory();

		const onSignOut = useCallback(() => {
			queryClient.setQueryData([AUTH_QUERY_KEY], null);
			setAuth(null);
			navigate.push(navigate.location);
		}, [navigate, queryClient]);

		return onSignOut;
	};

	const useUser = (): AuthUser | null => {
		const { data: user } = useQuery<AuthUser | null>({
			queryKey: [AUTH_QUERY_KEY],
			queryFn: async (): Promise<AuthUser | null> => me(),
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			initialData: auth,
		});

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (auth.token) {
				api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
				localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(auth));
			} else {
				api.defaults.headers.common.Authorization = null;
				localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
			}
		}, [auth, user]);

		return user ?? null;
	};

	useEffect(() => {
		if (auth?.token) {
			api.defaults.headers.common.Authorization = `Bearer  ${auth.token}`;
			localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(auth));
		} else {
			api.defaults.headers.common.Authorization = null
			localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
		}
	}, [auth]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const contextValue = useMemo(
		() => ({
			auth,
			setAuth,
			isAuthenticated: !!auth,
			useSignUp,
			useSignIn,
			useSignOut,
			useUser,
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
