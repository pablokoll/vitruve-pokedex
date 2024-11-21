import axios, { type AxiosResponse } from "axios";
import type {
	EvolutionChainResponseData,
	GenderResponseData,
	PokemonResponseData,
	PokemonsResponseData,
	SpeciesResponseData,
} from "../shared/interfaces/pokeapi.interface.js";
import type { Pokemon } from "../shared/interfaces/pokemon.interface.js";
import {
	extractEvolutionChain,
	mapPokemonsApi,
} from "../utils/pokeapi.mapper.js";
export type { Pokemon } from "../shared/interfaces/pokemon.interface.js";

const apiUrl = "https://pokeapi.co/api/v2";

async function findAllPokemonApi(
	limit = 50,
	offset = 0,
): Promise<PokemonsResponseData> {
	const url = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`;
	const response: AxiosResponse<PokemonsResponseData> = await axios.get(url);

	return response.data;
}

async function findPokemonIdApi(
	pokemon: string | number,
): Promise<PokemonResponseData> {
	const url = `${apiUrl}/pokemon/${pokemon}`;
	const response: AxiosResponse<PokemonResponseData> = await axios.get(url);

	return response.data;
}

async function findPokemonGenderApi(): Promise<GenderResponseData[]> {
	const url = `${apiUrl}/gender`;
	const genders = [1, 2, 3];
	const gendersPromises = genders.map((g) => axios.get(`${url}/${g}`));
	const pokemonsGender = await Promise.all(gendersPromises);
	return pokemonsGender.map((response) => response.data);
}

async function findPokemonSpeciesApi(
	pokemonsId: number[],
): Promise<SpeciesResponseData[]> {
	const url = `${apiUrl}/pokemon-species`;
	const speciesPromises = pokemonsId.map((s) => axios.get(`${url}/${s}`));
	const pokemonSpecies = await Promise.allSettled(speciesPromises);

	return pokemonSpecies
		.map((response) => {
			if (response.status === "fulfilled") {
				return response.value.data;
			}
			return null;
		})
		.filter((s) => s !== null) as SpeciesResponseData[];
}

async function findPokemonEvolutionChain(species: SpeciesResponseData[]) {
	const evolutionsChainsUrl = species.map((s) => s.evolution_chain.url);
	const evolutionsChainsUrlSet = new Set(evolutionsChainsUrl);
	const evolutionsChains: AxiosResponse<EvolutionChainResponseData>[] =
		await Promise.all(
			Array.from(evolutionsChainsUrlSet).map((url) => axios.get(url)),
		);

	return evolutionsChains.map((response) => {
		const chainData = response.data.chain;
		return extractEvolutionChain(chainData);
	});
}

async function findPokemonCharacteristicsApi(
	pokemonDetails: PokemonResponseData[],
): Promise<Pokemon[]> {
	const pokemonGenders = await findPokemonGenderApi();
	const pokemonSpecies = await findPokemonSpeciesApi(
		pokemonDetails.map((p) => p.id),
	);

	const pokemonEvolutions = await findPokemonEvolutionChain(pokemonSpecies);

	const pokemons = mapPokemonsApi(
		pokemonDetails,
		pokemonGenders,
		pokemonSpecies,
		pokemonEvolutions,
	);
	return pokemons;
}

async function findPokemonListWithDetailsApi(
	limit = 50,
	offset = 0,
): Promise<Pokemon[]> {
	const pokemonListData = await findAllPokemonApi(limit, offset);
	const pokemonDetailsPromises = pokemonListData.results.map((pokemon) =>
		findPokemonIdApi(pokemon.name),
	);
	const pokemonDetails = await Promise.all(pokemonDetailsPromises);

	const pokemons = await findPokemonCharacteristicsApi(pokemonDetails);

	return pokemons;
}

async function findPokemonIdsWithDetailsApi(ids: number[]) {
	const pokemonDetailsPromises = ids.map((id) => findPokemonIdApi(id));
	const pokemonDetails = await Promise.all(pokemonDetailsPromises);

	const pokemons = await findPokemonCharacteristicsApi(pokemonDetails);
	return pokemons;
}

async function findPokemonSearchByNameApi(name: string) {
	const allPokemons = await findAllPokemonApi(-1);
	const pokemonsFind = allPokemons.results.filter((pokemon) => {
		return pokemon.name.includes(name);
	});

	if (pokemonsFind.length === 0) {
		return [];
	}
	const pokemonDetailsPromises = pokemonsFind.map((pokemon) =>
		findPokemonIdApi(pokemon.name),
	);
	const pokemonDetails = await Promise.all(pokemonDetailsPromises);
	const pokemons = await findPokemonCharacteristicsApi(pokemonDetails);
	return pokemons;
}

async function findPokemonIdWithDetailsApi(id: string) {
	const pokemonDetails = await findPokemonIdApi(id);
	const pokemons = await findPokemonCharacteristicsApi([pokemonDetails]);
	return pokemons[0];
}

async function findPokemonTypes() {
	const url = `${apiUrl}/type?limit=30`;
	const response = await axios.get(url);
	return response.data.results
		.map((type: { name: string; url: string }) => type.name)
		.sort((a: string, b: string) => a.localeCompare(b));
}

async function findPokemonAbilities() {
	const url = `${apiUrl}/ability?limit=400`;
	const response = await axios.get(url);
	return response.data.results.map(
		(type: { name: string; url: string }) => type.name,
	).sort((a: string, b: string) => a.localeCompare(b));
}

export {
	findAllPokemonApi,
	findPokemonAbilities,
	findPokemonGenderApi,
	findPokemonIdApi,
	findPokemonIdsWithDetailsApi,
	findPokemonIdWithDetailsApi,
	findPokemonListWithDetailsApi,
	findPokemonSearchByNameApi,
	findPokemonSpeciesApi,
	findPokemonTypes
};

