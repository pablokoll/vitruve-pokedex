import {
	type InfiniteData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { fetchPokemonByIds } from "../api/pokemon";
import type {
	Pokemon,
	PokemonFavorite,
} from "../shared/interfaces/pokemon.interface";

interface UseFetchPokemonsResult {
	favoritePokemons: Pokemon[] | undefined;
}

export const useFetchPokemons = (
	pokemonsReferences: PokemonFavorite[],
): UseFetchPokemonsResult => {
	const queryClient = useQueryClient();

	const favoritePokemonIds = pokemonsReferences?.map((fav) => fav.pokemonId) || [];

	const { data: favoritePokemons } = useQuery<Pokemon[]>({
		queryKey: ["favoritePokemons", favoritePokemonIds],
		queryFn: async () => {
			const cachedPokemons: Pokemon[] = [];
			const missingIds: string[] = [];

			const cachedData = queryClient.getQueryData<InfiniteData<Pokemon[]>>([
				"pokemons",
				"infinite",
			]);
			const allCachedPokemons: Pokemon[] =
				cachedData?.pages?.flat() || [];

			for (const id of favoritePokemonIds) {
				const cachedPokemon = allCachedPokemons.find(
					(pokemon) => pokemon.id === id,
				);
				if (cachedPokemon) {
					cachedPokemons.push(cachedPokemon);
				} else {
					missingIds.push(id);
				}
			}

			const fetchedPokemons = missingIds.length
				? await fetchPokemonByIds(missingIds)
				: [];

			return [...cachedPokemons, ...fetchedPokemons];
		},
		enabled: favoritePokemonIds.length > 0,
	});

	return {
		favoritePokemons,
	};
};
