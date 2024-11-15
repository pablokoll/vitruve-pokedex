import { type Prisma, PrismaClient } from "@prisma/client";
import type { CreatePokemonDto } from "../shared/dto/create-pokemon.dto.ts";
import type { UpdatePokemonDto } from "../shared/dto/update-pokemon.dto.ts";
import type {
	Favorite,
	Pokemon,
	User,
} from "../shared/interfaces/pokemon.interface.js";

const prisma = new PrismaClient();

async function createUser(
	username: string,
	password: string,
): Promise<Partial<User>> {
	const user = await prisma.user.create({
		data: {
			username,
			password,
		},
		select: {
			id: true,
			username: true,
		},
	});
	return user;
}

async function getUserByUsername(username: string): Promise<User | null> {
	if (!username) {
		throw new Error("Username not found");
	}

	const user = await prisma.user.findUnique({
		where: {
			username: username,
		},
	});
	return user;
}

async function findAllPokemon(userId: string): Promise<Pokemon[]> {
	const pokemons = await prisma.pokemon.findMany({
		where: {
			userId,
		},
		include: {
			types: true,
			abilities: true,
			stats: true,
			evolutions: true,
			genders: true,
		},
	});
	return pokemons;
}

async function findPokemon(
	id: string,
	userId: string,
): Promise<Pokemon | null> {
	const pokemon = await prisma.pokemon.findUnique({
		where: { id, userId },
		include: {
			types: true,
			abilities: true,
			stats: true,
			evolutions: true,
			genders: true,
		},
	});

	return pokemon;
}

async function countPokemon(id: string, userId: string): Promise<number> {
	const count = await prisma.pokemon.count({
		where: {
			id,
			userId,
		},
	});
	return count;
}

async function createPokemon(
	createPokemonDto: CreatePokemonDto,
): Promise<Pokemon> {
	const {
		name,
		height,
		weight,
		category,
		abilities,
		evolutions,
		genders,
		sprite,
		types,
		stats,
		userId,
	} = createPokemonDto;

	const newPokemon = await prisma.pokemon.create({
		data: {
			name,
			height,
			weight,
			category,
			sprite,
			userId,
			genders: {
				create: genders?.map((gender: string) => ({ gender })),
			},
			types: {
				create: types.map((type: string) => ({ type })),
			},
			abilities: {
				create: abilities.map((ability: string) => ({ ability })),
			},
			stats: {
				create: stats.map((stat: { statName: string; value: number }) => ({
					statName: stat.statName,
					value: stat.value,
				})),
			},
			evolutions: {
				create: evolutions?.map((evolution: string) => ({ evolution })),
			},
		},
		include: {
			abilities: true,
			evolutions: true,
			genders: true,
			stats: true,
			types: true,
			user: true,
		},
	});

	return newPokemon;
}

async function updatePokemon(
	updatePokemonDto: UpdatePokemonDto,
): Promise<Pokemon> {
	const {
		id,
		name,
		height,
		weight,
		category,
		abilities,
		genders,
		evolutions,
		sprite,
		types,
		stats,
		userId,
	} = updatePokemonDto;

	const data: Prisma.PokemonUpdateInput = {};

	if (name !== undefined) data.name = name;
	if (height !== undefined) data.height = height;
	if (weight !== undefined) data.weight = weight;
	if (category !== undefined) data.category = category;
	if (sprite !== undefined) data.sprite = sprite;

	if (genders !== undefined) {
		data.genders = {
			deleteMany: {},
			create: genders.map((gender: string) => ({ gender })),
		};
	}
	if (types !== undefined) {
		data.types = {
			deleteMany: {},
			create: types.map((type: string) => ({ type })),
		};
	}

	if (abilities !== undefined) {
		data.abilities = {
			deleteMany: {},
			create: abilities.map((ability: string) => ({ ability })),
		};
	}
	if (evolutions !== undefined) {
		data.evolutions = {
			deleteMany: {},
			create: evolutions.map((evolution: string) => ({ evolution })),
		};
	}

	if (stats !== undefined) {
		data.stats = {
			deleteMany: {},
			create: stats.map((stat: { statName: string; value: number }) => ({
				statName: stat.statName,
				value: stat.value,
			})),
		};
	}

	const updatedPokemon = await prisma.pokemon.update({
		where: { id, userId },
		data,
		include: {
			abilities: true,
			evolutions: true,
			genders: true,
			stats: true,
			types: true,
			user: true,
		},
	});

	return updatedPokemon;
}

async function deletePokemon(
	id: string,
	userId: string,
): Promise<{ id: string; name: string; userId: string | null }> {
	const deletedPokemon = await prisma.pokemon.delete({
		where: { id, userId },
		select: {
			id: true,
			name: true,
			userId: true,
		},
	});
	return deletedPokemon;
}

async function findPokemonFavorites(userId: string): Promise<Favorite[]> {
	const favorites = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			favorites: true,
		},
	});
	return favorites?.favorites || [];
}

async function addPokemonFavorite(
	userId: string,
	pokemonId: string,
): Promise<boolean> {
	const result = await prisma.user.update({
		where: { id: userId },
		data: {
			favorites: {
				create: {
					pokemonId,
				},
			},
		},
	});

	if (!result) {
		throw new Error(
			`Failed adding pokemon ${pokemonId} to favorites list of user ${userId}`,
		);
	}
	return true;
}

async function removePokemonFavorite(
	userId: string,
	pokemonId: string,
): Promise<boolean> {
	const result = await prisma.user.update({
		where: { id: userId },
		data: {
			favorites: {
				delete: {
					userId_pokemonId: {
						userId,
						pokemonId,
					},
				},
			},
		},
	});

	if (!result) {
		throw new Error(
			`Failed removing pokemon ${pokemonId} from favorites list of user ${userId}`,
		);
	}
	return true;
}

export {
	addPokemonFavorite,
	countPokemon,
	createPokemon,
	createUser,
	deletePokemon,
	findAllPokemon,
	findPokemon,
	findPokemonFavorites,
	getUserByUsername,
	removePokemonFavorite,
	updatePokemon
};

