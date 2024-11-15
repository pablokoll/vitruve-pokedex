import axios, { type AxiosResponse } from "axios";
import type {
	EvolutionChainResponseData,
	GenderResponseData,
	PokemonResponseData,
	PokemonsResponseData,
	SpeciesResponseData,
} from "../shared/interfaces/pokeapi.interface.js";
import {
	extractEvolutionChain,
	mapPokemonsApi,
} from "../utils/pokeapi.mapper.js";

const apiUrl = "https://pokeapi.co/api/v2";

async function findAllPokemonApi(
	limit = 50,
	offset = 0,
): Promise<PokemonsResponseData> {
	const url = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`;
	const response: AxiosResponse<PokemonsResponseData> = await axios.get(url);

	return response.data;
}

async function findPokemonDetailsApi(
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
	const pokemonSpecies = await Promise.all(speciesPromises);

	return pokemonSpecies.map((response) => response.data);
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

async function findPokemonListWithDetailsApi(limit = 50, offset = 0) {
	const pokemonListData = await findAllPokemonApi(limit, offset);
	const pokemonDetailsPromises = pokemonListData.results.map((pokemon) =>
		findPokemonDetailsApi(pokemon.name),
	);
	const pokemonDetails = await Promise.all(pokemonDetailsPromises);

	const pokemonGenders = await findPokemonGenderApi();
	const pokemonSpecies = await findPokemonSpeciesApi(
		pokemonDetails.map((p) => p.id),
	);
	const pokemonEvolutions = await findPokemonEvolutionChain(pokemonSpecies);

	const pokemons = mapPokemonsApi(
		pokemonDetails,
		pokemonGenders,
		pokemonSpecies,
        pokemonEvolutions
	);

	return pokemons;
}

export {
	findAllPokemonApi,
	findPokemonDetailsApi,
	findPokemonGenderApi,
	findPokemonListWithDetailsApi,
	findPokemonSpeciesApi
};

