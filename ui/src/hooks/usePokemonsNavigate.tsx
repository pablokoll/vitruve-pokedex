import {
	type InfiniteData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { fetchAllPokemons } from "../api/pokemon";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

interface PokemonNavigation {
	prevPokemonName: string | null;
	nextPokemonName: string | null;
}

interface usePokemonsNavigateResult {
	pokemonNavigation: PokemonNavigation | undefined;
	isLoading: boolean;
}

export const usePokemonsNavigate = (
	pokemonName: string,
): usePokemonsNavigateResult => {
	const queryClient = useQueryClient();

	const { data: pokemonNavigation, isLoading } = useQuery<PokemonNavigation>({
		queryKey: ["pokemon", "navigate", pokemonName],
		queryFn: async () => {
			const getAllCachedPokemons = (): string[] => {
				const infiniteCache = queryClient.getQueryData<InfiniteData<Pokemon[]>>(
					["pokemons", "infinite"],
				);
				if (infiniteCache) {
					const pokemonNames = infiniteCache.pages
						.flat()
						.map((pokemon) => pokemon.name);
					if (validateNavigation(pokemonNames, pokemonName)) {
						return infiniteCache.pages.flat().map((pokemon) => pokemon.name);
					}
				}

				const navigateCache = queryClient.getQueryData<string[]>([
					"pokemons",
					"navigate",
				]);
				if (navigateCache && validateNavigation(navigateCache, pokemonName)) {
					return navigateCache;
				}

				return [];
			};

			const allPokemons = getAllCachedPokemons();

			if (allPokemons.length === 0) {
				const fetchedPokemons = await fetchAllPokemons();
				const pokemonNames = fetchedPokemons.map((pokemon) => pokemon.name);
				queryClient.setQueryData(["pokemons", "navigate"], pokemonNames);
				return calculateNavigation(pokemonNames, pokemonName);
			}

			return calculateNavigation(allPokemons, pokemonName);
		},
		enabled: pokemonName !== "",
	});

	return {
		pokemonNavigation,
		isLoading,
	};
};

const validateNavigation = (
	allPokemons: string[],
	pokemonName: string,
): boolean => {
	const currentIndex = allPokemons.findIndex((name) => name === pokemonName);

	if (currentIndex === -1) {
		return false;
	}

	const prevPokemon = currentIndex > 0 ? allPokemons[currentIndex - 1] : null;
	const nextPokemon =
		currentIndex < allPokemons.length - 1
			? allPokemons[currentIndex + 1]
			: null;
	if (prevPokemon === null || nextPokemon === null) {
		return false;
	}
	return true;
};

const calculateNavigation = (
	allPokemons: string[],
	pokemonName: string,
): PokemonNavigation => {
	const currentIndex = allPokemons.findIndex((name) => name === pokemonName);
	const prevPokemon = allPokemons[currentIndex - 1]
		? allPokemons[currentIndex - 1]
		: allPokemons[allPokemons.length - 1];
	const nextPokemon = allPokemons[currentIndex + 1]
		? allPokemons[currentIndex + 1]
		: allPokemons[0];
	return {
		prevPokemonName: prevPokemon,
		nextPokemonName: nextPokemon,
	};
};

export default usePokemonsNavigate;
