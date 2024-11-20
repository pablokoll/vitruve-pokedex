import {
	IonButton,
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonPage,
	useIonModal,
} from "@ionic/react";
import type { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import type React from "react";
import { useEffect, useState } from "react";
import { css } from "../../styled-system/css";
import AddPokemonModal from "../components/AddPokemonModal";
import PokemonList from "../components/PokemonList";
import SearchBar from "../components/SearchBar";
import useFavorites from "../hooks/useFavorites";
import usePokemonsInfinite from "../hooks/usePokemonsInfinite";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";
import { containerStyle } from "../styles/styles";

const PokedexPage: React.FC = () => {
	const limit = 12;
	const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
	const [visiblePokemons, setVisiblePokemons] = useState<Pokemon[]>([]);
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [searchPokemons, setSearchPokemons] = useState<Pokemon[]>([]);
	const { favorites, updateFavorite } = useFavorites();
	const {
		data,
		fetchNextPage,
		isFetching,
		hasNextPage,
		isError,
		error,
		isFetchingNextPage,
	} = usePokemonsInfinite(limit);

	const [present, dismiss] = useIonModal(AddPokemonModal, {
		dismiss: (data: string, role: string) => dismiss(data, role),
	});

	function openModal() {
		present({
			onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
				if (ev.detail.role === "confirm") {
					console.log("Pokemon created: ", ev.detail.data);
				}
			},
			breakpoints: [1],
			showBackdrop: false,
			focusTrap: true,
			keyboardClose: true,
		});
	}

	useEffect(() => {
		if (data) {
			const newPokemons = data.pages.flat();
			setAllPokemons(newPokemons);
			if (!isFetchingNextPage) {
				setVisiblePokemons((prevVisiblePokemons) => {
					if(prevVisiblePokemons[0]?.id !== newPokemons[0]?.id) {
						return newPokemons.slice(0, limit);
					}
					return [
						...prevVisiblePokemons,
						...newPokemons.slice(
							prevVisiblePokemons.length,
							prevVisiblePokemons.length + limit,
						),
					];
				});
			}
		}
	}, [data]);

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
				<div className={containerStyle}>
					{isError && <p>Error: {(error as Error).message}</p>}
					<SearchBar
						setSearchPokemons={setSearchPokemons}
						setIsSearching={setIsSearching}
					/>
					<IonButton expand="block" onClick={() => openModal()}>
						Open
					</IonButton>
					{isSearching ? (
						<PokemonList
							key={`searched-${searchPokemons.length}`}
							pokemonList={searchPokemons}
							favorites={favorites}
							updateFavorite={updateFavorite}
						/>
					) : visiblePokemons.length ? (
						<PokemonList
							key={`visibles-${visiblePokemons.length}`}
							pokemonList={visiblePokemons}
							favorites={favorites}
							updateFavorite={updateFavorite}
						/>
					) : null}
					<div className={css({ flexGrow: 1 })} />
					<IonInfiniteScroll
						onIonInfinite={handleInfiniteScroll}
						disabled={!hasNextPage || isSearching}
					>
						<IonInfiniteScrollContent
							loadingSpinner="bubbles"
							loadingText="Loading more Pokemons..."
						/>
					</IonInfiniteScroll>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default PokedexPage;
