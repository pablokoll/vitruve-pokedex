import { IonButton, IonRouterLink } from "@ionic/react";
import { useState } from "react";
import type { PokemonCardProps } from "../shared/interfaces/pokemon.interface";

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
	const [isFavorite, setIsFavorite] = useState(pokemon.isFavorite);

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsFavorite(!isFavorite);
	};

	return (
		<>
			<IonRouterLink routerLink={`/pokedex/${pokemon.id}`}>
				<div className="pokemon-card">
					<h2>{pokemon.name}</h2>
					<img src={pokemon.sprite} alt={pokemon.name} />
					{pokemon.types.map((type) => (
						<span key={type.id}>{type.type}</span>
					))}
					<p>id: {pokemon.id}</p>
				</div>
			</IonRouterLink>
			<IonButton
				color={isFavorite ? "danger" : "medium"}
				onClick={handleFavoriteClick}
			>
				{isFavorite ? "Unfavorite" : "Favorite"}
			</IonButton>
		</>
	);
};

export default PokemonCard;
