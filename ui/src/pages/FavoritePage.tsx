import { IonContent, IonPage, IonText } from "@ionic/react";
import type React from "react";
import useFavorites from "../hooks/useFavorite";
import { useAuth } from "../providers/AuthProvider";
import { containerStyle } from "../styles/styles";

const FavoritePage: React.FC = () => {
	const { auth } = useAuth();
	const { favorites } = useFavorites();

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
					
					{favorites?.map((favorite) => (
						<div key={favorite.id}>
							<p>{favorite.pokemonId}</p>
						</div>
					))}
				</div>
			</IonContent>
		</IonPage>
	);
};

export default FavoritePage;
