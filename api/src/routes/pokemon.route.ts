import { Hono } from "hono";
import {
	bearerAuthMiddleware,
	jwtUserMiddleware,
} from "../middlewares/auth.middleware.js";
import {
	addPokemonFavorite,
	countAllPokemons,
	countPokemon,
	createPokemon,
	deletePokemon,
	findAllPokemon,
	findPokemon,
	findPokemonFavorites,
	removePokemonFavorite,
	updatePokemon,
} from "../services/database.service.js";
import {
	findAllPokemonApi,
	findPokemonIdApi,
	findPokemonIdsWithDetailsApi,
	findPokemonListWithDetailsApi,
} from "../services/pokemon.service.js";
import type { Pokemon } from "../shared/interfaces/pokemon.interface.js";
import type { Variables } from "../shared/types/app.type.js";
import { getContextUserId, separateIdsByType } from "../utils/helpers.js";

const app = new Hono<{ Variables: Variables }>();

// Database
app.use("/database/*", bearerAuthMiddleware);

app.get("/database/favorites", async (c) => {
	const userId = await getContextUserId(c);

	if (!userId) {
		return c.json({ error: "User not found" }, 404);
	}

	const favorites = await findPokemonFavorites(userId);
	return c.json(favorites);
});

app.patch("database/favorite/:id", async (c) => {
	const pokemonId = c.req.param("id");
	const action = c.req.query("action");
	const userId = await getContextUserId(c);

	if (!pokemonId) {
		return c.json({ error: "Pokémon ID is required" }, 400);
	}

	const favorites = await findPokemonFavorites(userId);
	const isFavorite = favorites.some(
		(pokemon) => pokemon.pokemonId === pokemonId,
	);
	if (action === "add" && isFavorite) {
		return c.json({ message: "Pokémon already in favorites" });
	}
	if (isFavorite) {
		await removePokemonFavorite(userId, pokemonId);
		return c.json({ message: "Pokémon removed from favorites" });
	}
	await addPokemonFavorite(userId, pokemonId);
	return c.json({ message: "Pokémon added to favorites" });
});

app.get("/database", async (c) => {
	const userId = await getContextUserId(c);
	const pokemons = await findAllPokemon(userId);
	return c.json(pokemons);
});

app.get("/database/:id", async (c) => {
	const { id } = c.req.param();
	const userId = await getContextUserId(c);

	const pokemon = await findPokemon(id, userId);

	if (!pokemon) {
		return c.json({ error: "Pokémon not found" }, 404);
	}

	return c.json(pokemon);
});

app.post("/database", async (c) => {
	const pokemon = await c.req.json();
	const userId = await getContextUserId(c);
	pokemon.userId = userId;

	const newPokemon = await createPokemon(pokemon);
	return c.json(newPokemon);
});

app.put("/database", async (c) => {
	const pokemon = await c.req.json();
	const userId = await getContextUserId(c);

	if (!pokemon.id) {
		return c.json({ error: "Pokémon ID is required" }, 400);
	}
	const check = await countPokemon(pokemon.id, userId);

	if (!check) {
		return c.json({ error: "Pokémon not exists" }, 404);
	}

	pokemon.userId = userId;
	const updatedPokemon = await updatePokemon(pokemon);

	return c.json(updatedPokemon);
});

app.delete("/database/:id", async (c) => {
	const { id } = c.req.param();
	const userId = await getContextUserId(c);

	const check = await countPokemon(id, userId);

	if (!check) {
		return c.json({ error: "Pokémon not exists" }, 404);
	}

	await deletePokemon(id, userId);

	return c.json({ message: "Pokémon deleted successfully" });
});

app.use("/*", jwtUserMiddleware);

// Poke api
app.get("/", async (c) => {
	const limit = c.req.query("limit") ? Number(c.req.query("limit")) : undefined;
	const offset = c.req.query("offset")
		? Number(c.req.query("offset"))
		: undefined;
	const pokemons = await findAllPokemonApi(limit, offset);
	return c.json(pokemons.results);
});

app.get("/list", async (c) => {
	const limit = c.req.query("limit") ? Number(c.req.query("limit")) : 12;
	const offset = c.req.query("offset") ? Number(c.req.query("offset")) : 0;

	const pokemons: Pokemon[] = [];
	let totalDatabasePokemons = 0;

	if (c.get("username")) {
		const userId = await getContextUserId(c);
		totalDatabasePokemons = await countAllPokemons(userId);

		const dbSkip = Math.min(offset, totalDatabasePokemons);
		const dbTake = Math.min(limit, totalDatabasePokemons - dbSkip);

		if (dbTake > 0) {
			const pokemonsDatabase = await findAllPokemon(userId, {
				skip: dbSkip,
				take: dbTake,
			});
			pokemons.push(...pokemonsDatabase);
		}
	}

	const remainingOffset = Math.max(0, offset - totalDatabasePokemons);
	const remainingLimit = Math.max(0, limit - pokemons.length);

	if (remainingLimit > 0) {
		const pokemonsApi = await findPokemonListWithDetailsApi(
			remainingLimit,
			remainingOffset,
		);
		pokemons.push(...pokemonsApi);
	}

	return c.json(pokemons);
});

app.get("/list/ids", async (c) => {
	const query = c.req.query("find")?.split(",");
	if (!query?.length) {
		return c.json({ error: "Pokémon IDs are required" }, 400);
	}
	const pokemons = [];
	const { numbers, strings } = separateIdsByType(query);
	if (strings.length && c.get("username")) {
		const userId = await getContextUserId(c);
		const pokemonsDatabase = await findAllPokemon(userId, { ids: strings });
		pokemons.push(...pokemonsDatabase);
	}
	if (numbers.length) {
		const pokemonsApi = await findPokemonIdsWithDetailsApi(numbers);
		pokemons.push(...pokemonsApi);
	}
	return c.json(pokemons);
});

app.get("/:pokemon", async (c) => {
	const param = c.req.param("pokemon");
	const pokemon = await findPokemonIdApi(param);
	if (!pokemon) {
		return c.json(`Pokemon ${param} not found`, 404);
	}
	return c.json(pokemon);
});

export default app;
