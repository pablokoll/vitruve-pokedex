export interface Field {
	label: string;
	type:
		| "date"
		| "datetime-local"
		| "email"
		| "month"
		| "number"
		| "password"
		| "search"
		| "tel"
		| "text"
		| "time"
		| "url"
		| "week"
		| "select"
		| "textarea"
        | "custom";
	required: boolean;
	requiredOptions?: FieldRequiredOptions;
	props: {
		name: string;
		placeholder: string;
		labelPlacement: "end" | "fixed" | "floating" | "stacked" | "start";
		options?: string[];
		counter?: boolean;
		multiple?: boolean;
		helperText?: string;
		errorText?: string;
		fill?: "outline" | "solid" | undefined;
		inputmode?:
			| "decimal"
			| "email"
			| "none"
			| "numeric"
			| "search"
			| "tel"
			| "text"
			| "url";
	};
}

export interface FieldRequiredOptions {
	minlength?: number;
	maxlength?: number;
	min?: number;
	max?: number;
    pattern?: string;
}
