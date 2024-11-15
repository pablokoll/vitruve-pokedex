import type {
    PokemonAbility,
    PokemonGender,
    PokemonStat,
    PokemonType,
    Favorite as PrismaFavorite,
    Pokemon as PrismaPokemon,
    PokemonEvolution as PrismaPokemonEvolution,
    User as PrismaUser,
} from "@prisma/client";

export interface Pokemon extends PrismaPokemon {
	abilities: PokemonAbility[];
	types: PokemonType[];
	stats: PokemonStat[];
	evolutions: PokemonEvolution[] | [];
    genders: PokemonGender[]
}

export interface Favorite extends PrismaFavorite {}

export interface User extends PrismaUser {
    favorites: Favorite[];
    pokemons: Pokemon[];
}

export interface PokemonEvolution extends PrismaPokemonEvolution {}
