import {
	type InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { addUserPokemon } from "../api/pokemon";
import type { CreatePokemonDto } from "../shared/dto/create-pokemon.dto";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

// TODO: Implement the new pokemon into the list without connection
const mapPokemonCreate = (newPokemon: CreatePokemonDto): Pokemon => {
	const pokemonId = new Date().toISOString();
	return {
		id: pokemonId,
		name: newPokemon.name,
		types: newPokemon.types.map((type, index) => ({
			id: index,
			type,
			pokemonId,
		})),
		abilities: newPokemon.abilities.map((ability, index) => ({
			id: index,
			ability,
			pokemonId,
		})),
		height: newPokemon.height,
		weight: newPokemon.weight,
		category: newPokemon.category,
		description: newPokemon.description,
		genders:
			newPokemon.genders?.map((gender, index) => ({
				id: index,
				gender,
				pokemonId,
			})) ?? [],
		sprite: newPokemon.sprite,
		stats: newPokemon.stats.map((stat, index) => ({
			id: index,
			statName: stat.statName,
			value: stat.value,
			pokemonId,
		})),
		evolutions: [],
	};
};

interface UseAddPokemonResult {
	addPokemon: (newPokemon: CreatePokemonDto) => void;
	isSuccess: boolean;
	isPending: boolean;
	isError: boolean;
	error: AxiosError | null;
}

const useAddPokemon = (): UseAddPokemonResult => {
	const queryClient = useQueryClient();

	const { mutate, isSuccess, isPending, isError, error } = useMutation<
		Pokemon,
		AxiosError,
		CreatePokemonDto,
		{ prevPokemons: InfiniteData<Pokemon[]> | undefined }
	>({
		mutationFn: (newPokemon) => addUserPokemon(newPokemon),

		onMutate: async (newPokemon) => {
			await queryClient.cancelQueries({ queryKey: ["pokemons", "infinite"] });

			const prevPokemons = queryClient.getQueryData<InfiniteData<Pokemon[]>>([
				"pokemons",
				"infinite",
			]);

			return { prevPokemons, newPokemon };
		},

		onError: (error, variables, context) => {
			if (context?.prevPokemons) {
				queryClient.setQueryData(
					["pokemons", "infinite"],
					context.prevPokemons,
				);
			}

			if (error.response?.statusText === "Network Error") {
				const retryListener = () => {
					mutate(variables);
					document.removeEventListener("networkRecovered", retryListener);
				};

				document.addEventListener("networkRecovered", retryListener);
			}
		},

		onSuccess: (newPokemon) => {
			queryClient.invalidateQueries({ queryKey: ["pokemons", "infinite"] });
		},
	});

	return {
		addPokemon: mutate,
		isSuccess,
		isPending,
		isError,
		error,
	};
};

export default useAddPokemon;
