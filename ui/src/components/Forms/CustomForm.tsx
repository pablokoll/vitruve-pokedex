import { IonButton } from "@ionic/react";
import type { AxiosError } from "axios";
import type React from "react";
import type { FormEvent } from "react";
import type { Field } from "../../shared/interfaces/form.interface";
import type { CustomField } from "../../shared/types/field.type";
import CustomInput from "./CustomInput";

interface CustomFormProps {
	fields: Field[];
	formData: Record<string, CustomField>;
	setFormData: (
		value: React.SetStateAction<Record<string, CustomField>>,
	) => void;
	handleFormSubmit: (e: FormEvent) => void;
	hookResult?: {
		isPending: boolean;
		isError: boolean;
		error: AxiosError | null;
	};
	buttonName: string;
}

const CustomForm: React.FC<CustomFormProps> = ({
	fields,
	formData,
	setFormData,
	handleFormSubmit,
	hookResult,
	buttonName,
}) => {
	const handleChange = (name: string, value: CustomField) => {
		setFormData((prevState: Record<string, CustomField>) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		handleFormSubmit(e);
	};

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			{fields.map((field) => (
				<CustomInput
					key={field.label}
					field={field}
					value={formData[field.props.name] || ""}
					onChange={handleChange}
				/>
			))}
			<IonButton expand="full" type="submit" disabled={hookResult?.isPending}>
				{hookResult?.isPending ? `${buttonName}..` : `${buttonName}`}
			</IonButton>
			{hookResult?.isError && (
				<>
					{" "}
					<p>Error submitting form. Please try again.</p>
					<p>{hookResult?.error?.response?.data as string}</p>
				</>
			)}
		</form>
	);
};

export default CustomForm;
