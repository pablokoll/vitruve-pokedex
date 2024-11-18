import { IonButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useParams } from "react-router";
import usePokemon from "../hooks/usePokemon";
import usePokemonsNavigate from "../hooks/usePokemonsNavigate";
import { containerStyle } from "../styles/styles";

const PokemonPage: React.FC = () => {
	const { pokemonName } = useParams<{ pokemonName: string }>();
	const { pokemon } = usePokemon(pokemonName);
	const { isLoading, pokemonNavigation } = usePokemonsNavigate(pokemonName);

	return (
		<IonPage>
			<IonContent>
				<IonButtons>
					<IonButton routerLink="/pokedex">Back to Pokedex</IonButton>
				</IonButtons>
				<IonButtons>
					<IonButton
						routerLink={`/pokedex/${pokemonNavigation?.prevPokemonName}`}
					>
						Prev
					</IonButton>
					<IonButton
						routerLink={`/pokedex/${pokemonNavigation?.nextPokemonName}`}
					>
						Next
					</IonButton>
				</IonButtons>
				<div className={containerStyle}>
					{pokemon && (
						<>
							<p>id: {pokemon.id}</p>
							<h1>{pokemon.name}</h1>
							<img src={pokemon.sprite} alt={pokemon.name} />
							<p>height: {pokemon.height}</p>
							<p>weight: {pokemon.weight}</p>
							<p>category: {pokemon.category}</p>
							{pokemon.types?.map((type) => (
								<span key={type.id}>{type.type}</span>
							))}
							{pokemon.stats?.map((stat) => (
								<p key={stat.id}>
									{stat.statName}: {stat.value}
								</p>
							))}
							{pokemon.abilities?.map((ability) => (
								<p key={ability.id}>{ability.ability}</p>
							))}
							{pokemon.evolutions?.map((evolution) => (
								<div key={evolution.id}>
									<p>
										{evolution.evolution} - id: {evolution.id}
									</p>
									<p>{evolution.pokemon?.id}</p>
								</div>
							))}
							{pokemon.genders?.map((gender) => (
								<p key={gender.id}>{gender.gender}</p>
							))}
						</>
					)}
				</div>
			</IonContent>
		</IonPage>
	);
};

export default PokemonPage;
