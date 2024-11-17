import type { UseMutationResult } from "@tanstack/react-query";

export interface PokemonListProps {
	pokemonList: Pokemon[];
}

export interface PokemonCardProps {
	pokemon: Pokemon;
	favorites: PokemonFavorite[];
	updateFavorite: UseMutationResult<
		{ message: string },
		Error,
		{ id: string; action?: "add" },
		unknown
	>["mutate"];
}

export interface PokemonFavorite {
	id: number;
	userId: string;
	pokemonId: string;
}

export interface Pokemon {
	id: string;
	name: string;
	height?: number;
	weight?: number;
	category?: string;
	sprite?: string;
	userId?: string;
	user?: User;

	types: PokemonType[];
	abilities: PokemonAbility[];
	evolutions: PokemonEvolution[];
	stats: PokemonStat[];
	genders: PokemonGender[];

	isFavorite?: boolean;
}

export interface PokemonType {
	id: number;
	type: string;
	pokemonId: string;
	pokemon?: Pokemon;
}

export interface PokemonAbility {
	id: number;
	ability: string;
	pokemonId: string;
	pokemon?: Pokemon;
}

export interface PokemonStat {
	id: number;
	statName: string;
	value: number;
	pokemonId: string;
	pokemon?: Pokemon;
}

export interface PokemonEvolution {
	id: number;
	evolution: string;
	pokemonId: string;
	pokemon?: Pokemon;
}

export interface PokemonGender {
	id: number;
	gender: string;
	pokemonId: string;
	pokemon?: Pokemon;
}

export interface User {
	id: string;
	username: string;
	password: string;
	pokemons: Pokemon[];
	favorites: Favorite[];
}

export interface Favorite {
	id: number;
	userId: string;
	pokemonId: string;
	user?: User;
	pokemon?: Pokemon;
}
