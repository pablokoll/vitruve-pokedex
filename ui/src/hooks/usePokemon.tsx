import {
	type InfiniteData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { fetchPokemonById } from "../api/pokemon";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

interface usePokemonResult {
	pokemon: Pokemon | undefined;
}   

export const usePokemon = (pokemonName: string): usePokemonResult => {
	const queryClient = useQueryClient();
	const { data: pokemon } = useQuery<Pokemon>({
		queryKey: ["pokemon", pokemonName],
		queryFn: async () => {
			const cachedData = queryClient.getQueryData<InfiniteData<Pokemon[]>>([
				"pokemons",
				"infinite",
			]);
			const allCachedPokemons: Pokemon[] = cachedData?.pages?.flat() || [];
			const cachedPokemon = allCachedPokemons.find(
				(pokemon) => pokemon.name === pokemonName,
			);
			if (cachedPokemon) {
				return cachedPokemon;
			}

			return await fetchPokemonById(pokemonName)
		},
		enabled: pokemonName.length > 0,
	});

	return {
		pokemon,
	};
};

export default usePokemon;