import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { containerStyle } from "../styles/styles";

const SignupPage: React.FC = () => {
	const { useSignUp } = useAuth();
	const signUp = useSignUp();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
			signUp({ username, password }, {onError: (error) => {
				setError("Failed to register user. Please try again.");	
			}});
		
	};

	return (
		<IonPage>
			<IonContent>
				<div className={containerStyle}>
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="username">Username:</label>
							<input
								type="text"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<button type="submit">Signup</button>
						{error && <p>{error}</p>}
					</form>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default SignupPage;
