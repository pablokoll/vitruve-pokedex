import {
	type InfiniteData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { fetchPokemonByIds } from "../api/pokemon";
import type {
	Pokemon,
	PokemonReference,
} from "../shared/interfaces/pokemon.interface";

interface usePokemonsResult {
	pokemons: Pokemon[] | undefined;
}

export const usePokemons = (
	pokemonsReferences: PokemonReference[],
): usePokemonsResult => {	
	const queryClient = useQueryClient();
	const pokemonIds = pokemonsReferences?.map((pokemon) => pokemon.pokemonId) || [];
	const { data: pokemons } = useQuery<Pokemon[]>({
		queryKey: ["pokemons", pokemonIds],
		queryFn: async () => {
			const cachedPokemons: Pokemon[] = [];
			const missingIds: string[] = [];

			const cachedData = queryClient.getQueryData<InfiniteData<Pokemon[]>>([
				"pokemons",
				"infinite",
			]);
			const allCachedPokemons: Pokemon[] =
				cachedData?.pages?.flat() || [];

			for (const pokemonId of pokemonIds) {
				const cachedPokemon = allCachedPokemons.find(
					(pokemon) => pokemon.id === pokemonId,
				);
				if (cachedPokemon) {
					cachedPokemons.push(cachedPokemon);
				} else {
					missingIds.push(pokemonId);
				}
			}

			const fetchedPokemons = missingIds.length
				? await fetchPokemonByIds(missingIds)
				: [];

			return [...cachedPokemons, ...fetchedPokemons];
		},
		enabled: pokemonIds.length > 0,
	});

	return {
		pokemons,
	};
};
