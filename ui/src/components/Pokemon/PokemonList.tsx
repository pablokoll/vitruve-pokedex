import { IonCol, IonGrid, IonRow } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import { css } from "../../../styled-system/css";
import type {
	Pokemon,
	PokemonListProps
} from "../../shared/interfaces/pokemon.interface";
import PokemonCard from "./PokemonCard";

const PokemonList: React.FC<PokemonListProps> = ({
	pokemonList,
	favorites,
	updateFavorite
}) => {
	const [pokemons, setPokemons] = useState<Pokemon[]>(pokemonList);

	useEffect(() => {
		setPokemons(pokemonList);
	}, [pokemonList]);

	return (
		<IonGrid fixed={true} className={css({ height: "100vh" })}>
			<IonRow class="ion-justify-content-start ion-align-items-center">
				{pokemons.map((pokemon) => (
					<IonCol
						class="ion-padding"
						key={`${pokemon.name}-${pokemon.id}`}
						sizeXs="12"
						sizeSm="6"
						sizeMd="4"
						sizeLg="3"
						sizeXl="2"
					>
						<PokemonCard
							pokemon={pokemon}
							favorites={favorites ? favorites : []}
							updateFavorite={updateFavorite}
						/>
					</IonCol>
				))}
			</IonRow>
		</IonGrid>
	);
};

export default PokemonList;
