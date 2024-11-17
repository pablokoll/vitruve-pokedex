import { IonCol, IonGrid, IonRow } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import { css } from "../../styled-system/css";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";
import PokemonCard from "./PokemonCard";

interface PokemonListProps {
	pokemonList: Pokemon[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemonList }) => {
	const [pokemons, setPokemons] = useState<Pokemon[]>(pokemonList);
	
	useEffect(() => {
		setPokemons(pokemonList);
	}, [pokemonList]);

	return (
		<>
			<IonGrid
				className={css({
					width: "100%",
					display: "flex",
					flexDirection: "column",
				})}
			>
				{Array.from({ length: Math.ceil(pokemons.length / 3) }).map(
					(_, rowIndex) => (
						<IonRow
							className={css({ width: "100%" })}
							key={`row-${rowIndex}-${pokemons[rowIndex * 3]?.id}`}
						>
							{pokemons.slice(rowIndex * 3, rowIndex * 3 + 3).map((pokemon) => (
								<IonCol key={pokemon.id} size="4">
									<PokemonCard pokemon={pokemon} />
								</IonCol>
							))}
						</IonRow>
					),
				)}
			</IonGrid>
		</>
	);
};

export default PokemonList;
