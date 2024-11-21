import {
	IonInput,
	IonInputPasswordToggle,
	IonSelect,
	IonSelectOption,
	IonTextarea,
} from "@ionic/react";
import { caretDownSharp } from "ionicons/icons";
import type React from "react";
import type { Field } from "../shared/interfaces/form.interface";
import type { CustomField } from "../shared/types/field.type";
import InputStats from "./InputStats";

interface CustomInputProps {
	field: Field;
	value: CustomField;
	onChange: (name: string, value: CustomField) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
	field,
	value,
	onChange,
}) => {
	const { label, required, requiredOptions, type, props } = field;
	const { name, placeholder, options, ...restProps } = props;

	const handleChange = (e: CustomEvent) => {
		onChange(name, e.detail.value);
	};

	return (
		<>
			{type === "text" || type === "number" || type === "url" ? (
				<IonInput
					id={name}
					name={name}
					label={label}
					value={value as string}
					type={type}
					required={required}
					placeholder={placeholder}
					onIonChange={handleChange}
					{...requiredOptions}
					{...restProps}
				/>
			) : type === "password" ? (
				<IonInput
					autocomplete="new-password"
					id={name}
					name={name}
					label={label}
					value={value as string}
					type={type}
					required={required}
					placeholder={placeholder}
					onIonChange={handleChange}
					{...requiredOptions}
					{...restProps}
				>
					<IonInputPasswordToggle slot="end" />
				</IonInput>
			) : type === "textarea" ? (
				<IonTextarea
					{...requiredOptions}
					id={name}
					name={name}
					label={label}
					value={value as string}
					required={required}
					placeholder={placeholder}
					onIonChange={handleChange}
					{...restProps}
				/>
			) : type === "select" ? (
				<IonSelect
					id={name}
					name={name}
					label={label}
					value={value}
					className="always-flip"
					toggleIcon={caretDownSharp}
					onIonChange={handleChange}
					placeholder={placeholder}
					interface="popover"
					onKeyUpCapture={(e) => {
						e.key === "Enter";
					}}
					{...requiredOptions}
					{...restProps}
				>
					{options?.map((option) => (
						<IonSelectOption key={option} value={option}>
							{option}
						</IonSelectOption>
					))}
				</IonSelect>
			) : type === "custom" && name === "stats" ? (
				<InputStats onChange={onChange} />
			) : null}

			{/* {error && <IonText color="danger">{error}</IonText>} */}
		</>
	);
};

export default CustomInput;
