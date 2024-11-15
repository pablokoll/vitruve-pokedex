import {
	IonButton,
	IonContent,
	IonInput,
	IonInputPasswordToggle,
	IonNote,
	IonPage,
	IonText,
} from "@ionic/react";
import type React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../providers/AuthProvider";
import { containerStyle } from "../styles/styles";

const SigninPage: React.FC = () => {
	const history = useHistory(); 
	const { useSignIn } = useAuth();
	const signin = useSignIn();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({
		username: "",
		password: "",
		auth: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formErrors = { username: "", password: "", auth: "" };

		if (!username) formErrors.username = "Username is required";
		if (!password) formErrors.password = "Password is required";
		setErrors(formErrors);

		if (formErrors.username || formErrors.password) return;

		try {
			signin({username, password});
			history.push("/pokedex");
			setUsername("");
			setPassword("");
		} catch (error) {
			setErrors({
				...formErrors,
				auth: `${error}`,
			});
		}
	};

	return (
		<IonPage>
			<IonContent>
				<div className={containerStyle}>
					<form id="signin-form" onSubmit={handleSubmit}>
						<IonInput
							type="text"
							label="Username"
							labelPlacement="floating"
							counter={true}
							maxlength={20}
							onIonInput={(e) => setUsername(e.detail.value!)}
							value={username}
							className={errors.username ? "input-error" : ""}
						/>
						{errors.username && (
							<IonNote color="danger">{errors.username}</IonNote>
						)}

						<IonInput
							type="password"
							label="Password"
							labelPlacement="floating"
							onIonInput={(e) => setPassword(e.detail.value!)}
							value={password}
							className={errors.password ? "input-error" : ""}
						>
							<IonInputPasswordToggle slot="end" />
						</IonInput>
						{errors.password && (
							<IonNote color="danger">{errors.password}</IonNote>
						)}

						<IonButton form="signin-form" type="submit">
							Sign In
						</IonButton>
						{errors.auth && (
							<IonText color="danger">
								<p>{errors.auth}</p>
							</IonText>
						)}
					</form>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default SigninPage;
