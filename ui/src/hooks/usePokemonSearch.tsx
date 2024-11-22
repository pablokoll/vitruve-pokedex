import { useQuery } from "@tanstack/react-query";
import { fetchPokemonSearchByName } from "../api/pokemon";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

const usePokemonSearch = (name: string) => {
	return useQuery<Pokemon[], Error>({
		queryKey: ["pokemonSearch", name],
		queryFn: () => fetchPokemonSearchByName(name),
		enabled: !!name,
	});
};

export default usePokemonSearch;
