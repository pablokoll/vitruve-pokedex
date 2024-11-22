import { IonButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import CustomForm from "../components/Forms/CustomForm";
import useDeletePokemon from "../hooks/useDeletePokemon";
import useEditPokemon from "../hooks/useEditPokemon";
import usePokemon from "../hooks/usePokemon";
import usePokemonsNavigate from "../hooks/usePokemonsNavigate";
import { useAuth } from "../providers/AuthProvider";
import type { UpdatePokemonDto } from "../shared/dto/update-pokemon.dto";
import type { Field } from "../shared/interfaces/form.interface";
import type { CustomField } from "../shared/types/field.type";
import { containerStyle } from "../styles/styles";

const PokemonDetails: React.FC = () => {
	const { auth } = useAuth();
	const { pokemonName } = useParams<{ pokemonName: string }>();
	const { pokemon } = usePokemon(pokemonName);
	const { pokemonNavigation } = usePokemonsNavigate(pokemonName);
	const { editPokemon, isSuccess, isPending, isError, error } =
		useEditPokemon();
	const {
		deletePokemon,
		isPending: isDeleting,
		isError: isDeleteError,
		isSuccess: isDeleteSuccess,
		error: deleteError,
	} = useDeletePokemon();
	const history = useHistory();

	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Record<string, CustomField>>({});

	const handleButtonSubmit = (e: React.MouseEvent) => {
		e.preventDefault();
		const updatedPokemon = {
			...formData,
			height: Number(formData?.height),
			weight: Number(formData?.weight),
			id: pokemon?.id,
		} as UpdatePokemonDto;
		editPokemon(updatedPokemon);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const updatedPokemon = {
			...formData,
			height: Number(formData?.height),
			weight: Number(formData?.weight),
		} as UpdatePokemonDto;
		editPokemon(updatedPokemon);
	};

	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};

	useEffect(() => {
		if (pokemon) {
			const initialFormData: Record<string, CustomField> = {
				id: pokemon.id,
				name: pokemon.name,
				height: pokemon.height,
				weight: pokemon.weight,
				category: pokemon.category,
				description: pokemon.description,
				types: pokemon.types.map((type) => type.type),
				abilities: pokemon.abilities.map((ability) => ability.ability),
				genders: pokemon.genders.map((gender) => gender.gender),
				statsValues: pokemon.stats.map((stat) => stat.value),
				statsName: pokemon.stats.map((stat) => stat.statName),
			};
			setFormData(initialFormData);
		}
	}, [pokemon]);

	useEffect(() => {
		if (isSuccess) {
			toggleEdit();
			history.push(`/pokedex/${formData?.name}`);
		}
	}, [isSuccess]);

	useEffect(() => {
		if (isDeleteSuccess) {
			history.push("/pokedex");
		}
	}, [isDeleteSuccess]);

	return (
		<IonPage>
			<IonContent>
				<IonButtons>
					<IonButton routerLink="/pokedex">Back to Pokedex</IonButton>
				</IonButtons>

				<IonButtons hidden={!!Number(pokemon?.id)}>
					<IonButton
						onClick={isEditing ? (e) => handleButtonSubmit(e) : toggleEdit}
					>
						{isEditing ? "Save" : "Edit"}
					</IonButton>
					<IonButton
						onClick={() =>
							deletePokemon({ id: pokemon?.id as string, name: pokemonName })
						}
					>
						Delete
					</IonButton>
				</IonButtons>

				<IonButtons>
					<IonButton
						routerLink={`/pokedex/${pokemonNavigation?.prevPokemonName}`}
					>
						Prev
					</IonButton>
					<IonButton
						routerLink={`/pokedex/${pokemonNavigation?.nextPokemonName}`}
					>
						Next
					</IonButton>
				</IonButtons>
				<div className={containerStyle}>
					{pokemon && (
						<>
							<p>id: {pokemon.id}</p>
							{isEditing ? (
								<CustomForm
									fields={fields}
									formData={formData}
									setFormData={setFormData}
									handleFormSubmit={handleFormSubmit}
									hookResult={{ isPending, isError, error }}
									buttonName="Save"
								/>
							) : (
								<>
									<h1>{formData?.name}</h1>
									<img
										src={
											pokemon.sprite ??
											"https://cdn.dribbble.com/users/6245075/screenshots/16269935/pokeball.png"
										}
										alt={pokemon.name}
										height={150}
										width={150}
									/>
									<p>Height: {formData?.height}</p>
									<p>Weight: {formData?.weight}</p>
									<p>Category: {formData?.category}</p>
									<p>Description: {formData?.description}</p>
									<div>
										Genders:{" "}
										{(formData?.genders as string[])?.map((gender) => (
											<span key={gender}>{gender} </span>
										))}
									</div>
									<div>
										Types:{" "}
										{(formData?.types as string[])?.map((type) => (
											<span key={type}>{type} </span>
										))}
									</div>
									<div>
										Abilities:{" "}
										{(formData?.abilities as string[])?.map((abilities) => (
											<span key={abilities}>{abilities} </span>
										))}
									</div>
									<div>
										Stats:{" "}
										{(formData?.statsName as string[])?.map((stat, i) => (
											<div key={stat}>
												<span> {stat} </span>
												<span>{(formData?.statsValues as number[])[i]} </span>
											</div>
										))}
									</div>
								</>
							)}
						</>
					)}
				</div>
			</IonContent>
		</IonPage>
	);
};

export default PokemonDetails;

const fields: Field[] = [
	{
		label: "Name",
		type: "text",
		required: false,
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
		required: false,
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
		required: false,
		props: {
			name: "height",
			placeholder: "Pokemon height",
			labelPlacement: "floating",
			inputmode: "decimal",
			errorText: "Error height",
		},
	},
	{
		label: "Weight",
		type: "number",
		required: false,
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
		required: false,
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
		required: false,
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
		required: false,
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
		required: false,
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
		required: false,
		props: {
			name: "stats",
			placeholder: "Pokemon stats",
			labelPlacement: "floating",
		},
	},
];
