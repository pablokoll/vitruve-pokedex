import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonChip,
	IonImg,
	IonLabel,
	IonRouterLink
} from "@ionic/react";
import { useEffect, useState } from "react";
import type { PokemonCardProps } from "../../shared/interfaces/pokemon.interface";

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
		<IonCard>
			<IonRouterLink routerLink={`/pokedex/${pokemon.name}`}>
				<IonImg
					src={
						pokemon.sprite ??
						"https://cdn.dribbble.com/users/6245075/screenshots/16269935/pokeball.png"
					}
					alt={pokemon.name}
					className="w-full h-48 object-contain bg-gray-100"
				/>
				<IonCardHeader>
					<IonCardSubtitle className="text-center">{pokemon.id}</IonCardSubtitle>
					<IonCardTitle className="text-center">{pokemon.name}</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<div className="flex justify-center mb-4">
					{pokemon.types.map((type) => (
						<IonChip key={type.type} color="primary">
							<IonLabel>{type.type}</IonLabel>
						</IonChip>
					))}
					</div>
				</IonCardContent>
			</IonRouterLink>
			<IonButton
				color={isFavorite ? "danger" : "medium"}
				onClick={(event) => handleFavoriteClick(event, pokemon.id)}
			>
				{isFavorite ? "Unfavorite" : "Favorite"}
			</IonButton>
		</IonCard>
	);
};

export default PokemonCard;
