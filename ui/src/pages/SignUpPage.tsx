import {
	IonContent,
	IonPage
} from "@ionic/react";
import type React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import CustomForm from "../components/Forms/CustomForm";
import { useAuth } from "../providers/AuthProvider";
import type { Field } from "../shared/interfaces/form.interface";
import type { CustomField } from "../shared/types/field.type";
import { containerStyle } from "../styles/styles";

const SignUp: React.FC = () => {
	const history = useHistory();
	const { useSignUp } = useAuth();
	const signup = useSignUp();
	const [formData, setFormData] = useState<Record<string, CustomField>>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		signup({
			username: formData.username as string,
			password: formData.password as string,
		});
		history.push("/pokedex");
	};

	return (
		<IonPage>
			<IonContent>
				<div className={containerStyle}>
					<CustomForm
						formData={formData}
						setFormData={setFormData}
						handleFormSubmit={handleSubmit}
						buttonName="Sign Up"
						fields={fields}
					/>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default SignUp;

const fields: Field[] = [
	{
		label: "Username",
		type: "text",
		required: true,
		requiredOptions: {
			maxlength: 20,
			minlength: 3,
		},
		props: {
			name: "username",
			placeholder: "Username",
			labelPlacement: "floating",
			inputmode: "text",
			errorText: "Error username",
		},
	},
	{
		label: "Password",
		type: "password",
		required: true,
		requiredOptions: {
			maxlength: 20,
			minlength: 8,
		},
		props: {
			name: "password",
			placeholder: "Password",
			labelPlacement: "floating",
			inputmode: "text",
			errorText: "Error password",
		},
	},
];
