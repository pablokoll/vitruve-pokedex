import { IonContent, IonPage, IonText } from "@ionic/react";
import type React from "react";
import PokemonList from "../components/PokemonList";
import useFavorites from "../hooks/useFavorites";
import { usePokemons } from "../hooks/usePokemons";
import { useAuth } from "../providers/AuthProvider";
import { containerStyle } from "../styles/styles";

const FavoritePage: React.FC = () => {
	const { auth } = useAuth();
	const { favorites } = useFavorites();
	const { pokemons } = usePokemons(favorites || []);

	if (!auth?.user) {
		return (
			<IonPage>
				<IonContent>
					<div className={containerStyle}>
						<p>Login to save your favorites pokemons</p>
					</div>
				</IonContent>
			</IonPage>
		);
	}

	return (
		<IonPage>
			<IonContent>
				<div className={containerStyle}>
					<IonText>Favorites</IonText>
					{pokemons ? (
						<PokemonList pokemonList={pokemons} key={pokemons.length}/>
					) : null}
				</div>
			</IonContent>
		</IonPage>
	);
};

export default FavoritePage;
