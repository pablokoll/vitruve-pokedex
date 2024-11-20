import { IonButton, IonRouterLink } from "@ionic/react";
import { useEffect, useState } from "react";
import type { PokemonCardProps } from "../shared/interfaces/pokemon.interface";

const PokemonCard: React.FC<PokemonCardProps> = ({
	pokemon,
	favorites,
	updateFavorite,
}) => {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		if (favorites) {
			const isFavorite = favorites.some(
				(favorite) => favorite.pokemonId === pokemon.id,
			);
			setIsFavorite(isFavorite);
		}
	}, [favorites, pokemon.id]);

	const handleFavoriteClick = (e: React.MouseEvent, pokemonId: string) => {
		e.preventDefault();
		setIsFavorite(!isFavorite);
		updateFavorite({ id: pokemonId });
	};

	return (
		<>
			<IonRouterLink routerLink={`/pokedex/${pokemon.name}`}>
				<div className="pokemon-card">
					<h2>{pokemon.name}</h2>
					<img
						src={
							pokemon.sprite ??
							"https://cdn.dribbble.com/users/6245075/screenshots/16269935/pokeball.png"
						}
						height={150}
						width={150}
						alt={pokemon.name}
					/>
					{pokemon.types?.map((type) => (
						<span key={`${pokemon.name}-${type.id}`}>{type.type}</span>
					))}
					<p>id: {pokemon.id}</p>
				</div>
			</IonRouterLink>
			<IonButton
				color={isFavorite ? "danger" : "medium"}
				onClick={(event) => handleFavoriteClick(event, pokemon.id)}
			>
				{isFavorite ? "Unfavorite" : "Favorite"}
			</IonButton>
		</>
	);
};

export default PokemonCard;
