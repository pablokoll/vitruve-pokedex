import {
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonPage,
} from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { fetchPokemonList } from "../api/pokemon";
import PokemonList from "../components/PokemonList";
import SearchBar from "../components/SearchBar";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

const PokedexPage: React.FC = () => {
	const limit = 12;
	const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
	const [visiblePokemons, setVisiblePokemons] = useState<Pokemon[]>([]);

	const {
		data,
		fetchNextPage,
		isFetching,
		hasNextPage,
		isError,
		error,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["pokemons", "infinite"],
		queryFn: ({ pageParam = 0 }) => fetchPokemonList(limit, pageParam),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage === undefined) return undefined;
			if (Array.isArray(lastPage)) {
				return lastPage.length === limit ? allPages.length * limit : undefined;
			}
		},
		initialPageParam: 0,
		staleTime: Number.POSITIVE_INFINITY,
	});

	useEffect(() => {
		if (data) {
			const newPokemons = data.pages.flat();
			setAllPokemons(newPokemons);
			if (!isFetchingNextPage) {
				setVisiblePokemons((prevVisiblePokemons) => [
					...prevVisiblePokemons,
					...newPokemons.slice(
						prevVisiblePokemons.length,
						prevVisiblePokemons.length + limit,
					),
				]);
			}
		}
	}, [data, isFetchingNextPage]);

	const handleInfiniteScroll = (ev: { target: { complete: () => void } }) => {
		const isLastPage = allPokemons.length === visiblePokemons.length;
		if (hasNextPage && !isFetching && isLastPage) {
			fetchNextPage();
		} else {
			const newVisiblePokemons = allPokemons.slice(
				0,
				visiblePokemons.length + limit,
			);
			setVisiblePokemons(newVisiblePokemons);
		}
		setTimeout(() => ev.target.complete(), 500);
	};

	return (
		<IonPage>
			<IonContent>
				{isError && <p>Error: {(error as Error).message}</p>}
				<SearchBar />
				{visiblePokemons.length ? (
					<PokemonList pokemonList={visiblePokemons} key={visiblePokemons.length} />
				) : null}
				<IonInfiniteScroll
					onIonInfinite={handleInfiniteScroll}
					threshold="100px"
					disabled={!hasNextPage}
				>
					<IonInfiniteScrollContent
						loadingSpinner="bubbles"
						loadingText="Loading more Pokemons..."
					/>
				</IonInfiniteScroll>
			</IonContent>
		</IonPage>
	);
};

export default PokedexPage;
