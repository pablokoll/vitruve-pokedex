import type { CreatePokemonDto } from "../shared/dto/create-pokemon.dto";
import type { UpdatePokemonDto } from "../shared/dto/update-pokemon.dto";
import type {
	Pokemon,
	PokemonReference,
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

export const fetchAllPokemons = async (): Promise<
	{ name: string; url: string }[]
> => {
	const response = await api.get("/pokemon");
	return response.data;
};

export const fetchPokemonByIds = async (ids: string[]): Promise<Pokemon[]> => {
	const response = await api.get(`/pokemon/list/ids?find=${ids.join(",")}`);
	return response.data;
};

export const fetchPokemonSearchByName = async (
	name: string,
): Promise<Pokemon[]> => {
	const response = await api.get(`/pokemon/search/${name}`);
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
	PokemonReference[]
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

export const addUserPokemon = async (
	newPokemon: CreatePokemonDto,
): Promise<Pokemon> => {
	const response = await api.post("/pokemon/database", newPokemon);
	return response.data;
};

export const updateUserPokemon = async (
	updatePokemon: UpdatePokemonDto,
): Promise<Pokemon> => {
	const response = await api.put("/pokemon/database", updatePokemon);
	return response.data;
};

export const deleteUserPokemon = async (
	id: string,
	name: string,
): Promise<{ message: string }> => {
	const response = await api.delete(`/pokemon/database/${id}`);
	return response.data;
};

export const fetchPokemonTypes = async (): Promise<string[]> => {
	const response = await api.get("/pokemon/types");
	return response.data;
};

export const fetchPokemonAbilities = async (): Promise<string[]> => {
	const response = await api.get("/pokemon/abilities");
	return response.data;
};

export const fetchPokemonGenders = async (): Promise<string[]> => {
	const response = await api.get("/pokemon/genders");
	return response.data;
};
