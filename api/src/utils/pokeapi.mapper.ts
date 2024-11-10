import type {
	Pokemon,
	PokemonAbility,
	PokemonEvolution,
	PokemonStat,
	PokemonType,
} from "@prisma/client";
import type {
	Chain,
	GenderResponseData,
	PokemonResponseData,
	SpeciesResponseData,
} from "../shared/interfaces/pokeapi.interface.js";

interface PokemonPrisma extends Pokemon {
	abilities: PokemonAbility[];
	types: PokemonType[];
	stats: PokemonStat[];
	evolutions: PokemonEvolution[];
}

function assignPokemonGender(
	pokemonName: string,
	pokemonGenders: GenderResponseData[],
): string[] {
	const gender = pokemonGenders.filter((gender) => {
		return gender.pokemon_species_details.some(
			(specie) => specie.pokemon_species.name === pokemonName,
		);
	});

	return gender.map((gender) => gender.name);
}

function assignCategory(
	pokemonName: string,
	pokemonSpecies: SpeciesResponseData[],
): string {
	const specie = pokemonSpecies.find((specie) => {
		if (specie.name === pokemonName) {
			return specie;
		}
	});

	const category = specie?.genera.find((genus) => {
		if (genus.language.name === "en") {
			return genus;
		}
	});

	return `${category?.genus.replace(" Pokémon", "")}`;
}

function groupByEvolutionChain(
	pokemon: PokemonResponseData,
	evolutions: string[][],
): PokemonEvolution[] {
	const evolutionIndex = evolutions.findIndex((evolution) =>
		evolution.includes(pokemon.name),
	);
	return evolutions[evolutionIndex].map((evolution, index) => {
		return {
			id: index,
			evolution,
			pokemonId: pokemon.id.toString(),
		};
	});
}

function mapPokemonsApi(
	pokemons: PokemonResponseData[],
	genders: GenderResponseData[],
	species: SpeciesResponseData[],
	evolutions: string[][],
): PokemonPrisma[] {
	return pokemons.map((pokemon) => {
		const pokemonId = pokemon.id.toString();

		return {
			id: pokemonId,
			name: pokemon.name,
			height: pokemon.height,
			weight: pokemon.weight,
			category: assignCategory(pokemon.name, species),
			sprite: pokemon.sprites.front_default,
			gender: assignPokemonGender(pokemon.name, genders),
			abilities: pokemon.abilities.map((a) => {
				return {
					id: a.slot,
					ability: a.ability.name,
					pokemonId,
				};
			}),
			types: pokemon.types.map((t) => {
				return {
					id: t.slot,
					type: t.type.name,
					pokemonId,
				};
			}),
			stats: pokemon.stats.map((s, i) => {
				return {
					id: i,
					pokemonId,
					statName: s.stat.name,
					value: s.base_stat,
				};
			}),
			evolutions: groupByEvolutionChain(pokemon, evolutions),
			userId: null,
		};
	});
}

function extractEvolutionChain(chain: Chain): string[] {
	const evolutionChain: string[] = [];

	const currentSpecies = chain.species.name;
	evolutionChain.push(currentSpecies);

	for (const nextEvolution of chain.evolves_to) {
		evolutionChain.push(...extractEvolutionChain(nextEvolution));
	}

	return evolutionChain;
}

export { extractEvolutionChain, mapPokemonsApi };
