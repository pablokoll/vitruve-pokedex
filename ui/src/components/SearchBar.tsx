import { IonSearchbar as IonSearchBar } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import usePokemonSearch from "../hooks/usePokemonSearch";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

interface SearchBarProps {
	setSearchPokemons: (pokemons: Pokemon[]) => void;
	setIsSearching: (isSearching: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	setSearchPokemons,
	setIsSearching,
}) => {
	const [query, setQuery] = useState<string>("");

	const { data: pokemons, isFetching, isError } = usePokemonSearch(query);

	useEffect(() => {
		if (pokemons && query) {
			setSearchPokemons(pokemons);
			setIsSearching(true);
		} else {
			setSearchPokemons([]);
			setIsSearching(false);
		}
	}, [pokemons, query, setSearchPokemons, setIsSearching]);

	const handleSearchInput = (ev: CustomEvent) => {
		const value = ev.detail.value;
		setQuery(value || "");
		setIsSearching(!!value);
	};

	return (
		<>
			<IonSearchBar
				onIonInput={handleSearchInput}
				debounce={200}
				placeholder="Search Pokémon by name..."
			/>
			{isFetching && <p>Loading...</p>}
			{isError && <p>Error fetching Pokémon. Try again later.</p>}
		</>
	);
};

export default SearchBar;
