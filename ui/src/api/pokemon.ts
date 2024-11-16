import type { Pokemon } from "../shared/interfaces/pokemon.interface";
import { api } from "./api";

export const fetchPokemonList = async (
	limit: number,
	offset: number,
): Promise<Pokemon[]> => {
	const response = await api.get("/pokemon/list", {
		params: { limit, offset },
	});
	return response.data;
};

export const fetchPokemonById = async (id: string): Promise<Pokemon> => {
	const response = await api.get(`/pokemon/${id}`);
	return response.data;
};

export const fetchPokemonByName = async (name: string): Promise<Pokemon> => {
	const response = await api.get(`/pokemon/${name}`);
	return response.data;
};

export const fetchPokemonsFavorites = async (): Promise<Pokemon[]> => {
	const response = await api.get("/pokemon/database/favorites");
	return response.data;
};

export const toggleFavoritePokemon = async (id: string): Promise<Pokemon> => {
	const response = await api.patch(`/pokemon/database/favorite/${id}`);
	return response.data;
};

export const fetchPokemonsFromUser = async (): Promise<Pokemon[]> => {
	const response = await api.get("/pokemon/database");
	return response.data;
};

export const fetchPokemonByIdFromUser = async (
	id: string,
): Promise<Pokemon[]> => {
	const response = await api.get(`/pokemon/database/${id}`);
	return response.data;
};

export const addPokemonToUser = async (): Promise<Pokemon> => {
	const response = await api.post("/pokemon/database");
	return response.data;
};

export const updatePokemonFromUser = async (): Promise<Pokemon> => {
	const response = await api.put("/pokemon/database");
	return response.data;
};
