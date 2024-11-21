import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useAbilities } from "../hooks/useAbilities";
import useAddPokemon from "../hooks/useAddPokemon";
import { useTypes } from "../hooks/useTypes";
import type {
	CreatePokemonDto,
	PokemonStatDto,
} from "../shared/dto/create-pokemon.dto";
import type { Field } from "../shared/interfaces/form.interface";
import type { CustomField } from "../shared/types/field.type";
import CustomForm from "./CustomForm";

const AddPokemonModal = ({
	dismiss,
}: {
	dismiss: (data?: CustomField, role?: string) => void;
}) => {
	const [formData, setFormData] = useState<Record<string, CustomField>>({
		statsNames: [
			"HP",
			"Attack",
			"Defense",
			"Special Attack",
			"Special Defense",
			"Speed",
		],
		statsValues: [1, 1, 1, 1, 1, 1],
	});
	const { types } = useTypes();
	const { abilities } = useAbilities();

	const { addPokemon, isSuccess, isPending, isError, error } = useAddPokemon();

	const handleAddPokemon = () => {
		if (!Object.entries(formData).length) {
			return;
		}

		const requiredFields = [
			"name",
			"category",
			"height",
			"weight",
			"sprite",
			"types",
			"genders",
			"abilities",
		];
		const missingFields = requiredFields.filter((field) => !formData[field]);
		if (missingFields.length > 0) {
			console.error(`Missing fields: ${missingFields.join(", ")}`);
			return;
		}
		const newPokemon: CreatePokemonDto = {
			name: formData.name as string,
			category: formData.category as string,
			description: formData.description as string,
			sprite: formData.sprite as string,
			height: Number.parseFloat(formData.height as string),
			weight: Number.parseFloat(formData.weight as string),
			types: formData.types as string[],
			genders: formData.genders as string[],
			abilities: formData.abilities as string[],
			stats: (formData.statsNames as string[]).map((statName, index) => ({
				statName,
				value: (formData.statsValues as number[])[index],
			})) as PokemonStatDto[],
		};

		addPokemon(newPokemon);
	};
	const typeIndex = fields.findIndex((field) => field.props.name === "types");
	fields[typeIndex].props.options = types || [];
	const abilitiesIndex = fields.findIndex(
		(field) => field.props.name === "abilities",
	);
	fields[abilitiesIndex].props.options = abilities || [];

	useEffect(() => {
		if (isSuccess) {
			dismiss(null, "success");
		}
	});

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton color="medium" onClick={() => dismiss(null, "cancel")}>
							Cancel
						</IonButton>
					</IonButtons>
					<IonTitle className="ion-text-center">New Pokemon</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<CustomForm
					fields={fields}
					formData={formData}
					setFormData={setFormData}
					handleFormSubmit={handleAddPokemon}
					hookResult={{ isPending, isError, error }}
					buttonName="Add Pokemon"
				/>
			</IonContent>
		</IonPage>
	);
};

export default AddPokemonModal;

const fields: Field[] = [
	{
		label: "Name",
		type: "text",
		required: true,
		requiredOptions: {
			maxlength: 20,
			minlength: 3,
		},
		props: {
			name: "name",
			placeholder: "Pokemon name",
			labelPlacement: "floating",
			inputmode: "text",
			errorText: "Error name",
		},
	},
	{
		label: "Category",
		type: "text",
		required: true,
		requiredOptions: {
			maxlength: 20,
			minlength: 5,
		},
		props: {
			name: "category",
			placeholder: "Pokemon category",
			labelPlacement: "floating",
			inputmode: "text",
			errorText: "Error category",
		},
	},
	{
		label: "Height",
		type: "number",
		required: true,
		requiredOptions: {
			min: 1,
			max: 100,
		},
		props: {
			name: "height",
			placeholder: "Pokemon height",
			labelPlacement: "floating",
			inputmode: "numeric",
			errorText: "Error height",
		},
	},
	{
		label: "Weight",
		type: "number",
		required: true,
		props: {
			name: "weight",
			placeholder: "Pokemon weight",
			labelPlacement: "floating",
			inputmode: "numeric",
			errorText: "Error weight",
		},
	},
	{
		label: "Sprite",
		type: "url",
		required: true,
		requiredOptions: {
			pattern: "^(https?://)?([w-]+.)+[w-]+(:d+)?(/.*)?$",
		},
		props: {
			name: "sprite",
			placeholder: "Pokemon image url",
			labelPlacement: "floating",
			inputmode: "url",
			errorText: "Error url",
		},
	},
	{
		label: "Description",
		type: "textarea",
		required: false,
		requiredOptions: {
			maxlength: 200,
			minlength: 5,
		},
		props: {
			name: "description",
			placeholder: "Pokemon description",
			labelPlacement: "floating",
			inputmode: "text",
			errorText: "Error description",
		},
	},
	{
		label: "Genders",
		type: "select",
		required: true,
		props: {
			name: "genders",
			placeholder: "Pokemon genders",
			labelPlacement: "floating",
			inputmode: "text",
			multiple: true,
			errorText: "Error gender",
			options: ["Male", "Female"],
		},
	},
	{
		label: "Types",
		type: "select",
		required: true,
		requiredOptions: {
			max: 2,
			min: 1,
		},
		props: {
			name: "types",
			placeholder: "Select the types of the pokemon",
			labelPlacement: "floating",
			multiple: true,
			options: [],
			inputmode: "text",
			errorText: "Error types",
		},
	},
	{
		label: "Abilities",
		type: "select",
		required: true,
		requiredOptions: {
			max: 3,
			min: 1,
		},
		props: {
			name: "abilities",
			placeholder: "Pokemon abilities",
			labelPlacement: "floating",
			inputmode: "text",
			errorText: "Error abilities",
			options: [],
			multiple: true,
		},
	},
	{
		label: "Stats",
		type: "custom",
		required: true,
		props: {
			name: "stats",
			placeholder: "Pokemon stats",
			labelPlacement: "floating",
		},
	},
];
