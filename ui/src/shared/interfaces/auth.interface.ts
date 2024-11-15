export interface AuthResponse {
    user: AuthUser;
    token: string;
}

export interface AuthUser {
    user: {
        id: string;
        username: string;
    }
}