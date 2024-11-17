import type {
	Pokemon,
	PokemonFavorite,
} from "../shared/interfaces/pokemon.interface";
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

export const fetchPokemonByIds = async (
	ids: string[],
): Promise<Pokemon[]> => {
	const response = await api.get(`/pokemon/list/ids?find=${ids.join(",")}`);
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

export const fetchUserPokemonsFavorites = async (): Promise<
	PokemonFavorite[]
> => {
	const response = await api.get("/pokemon/database/favorites");
	return response.data;
};

export const toggleUserFavoritePokemon = async (
	id: string,
	action?: "add",
): Promise<{ message: string }> => {
	let path = `/pokemon/database/favorite/${id}`;
	if (action) {
		path = path.concat(`?action=${action}`);
	}
	const response = await api.patch(path);
	return response.data;
};

export const fetchUserPokemons = async (): Promise<Pokemon[]> => {
	const response = await api.get("/pokemon/database");
	return response.data;
};

export const fetchUserPokemonById = async (id: string): Promise<Pokemon[]> => {
	const response = await api.get(`/pokemon/database/${id}`);
	return response.data;
};

export const addPokemonToUser = async (): Promise<Pokemon> => {
	const response = await api.post("/pokemon/database");
	return response.data;
};

export const updateUserPokemon = async (): Promise<Pokemon> => {
	const response = await api.put("/pokemon/database");
	return response.data;
};
