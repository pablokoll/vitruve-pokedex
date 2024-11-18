import type { PokemonGender } from "@prisma/client";
import type {
	Chain,
	GenderResponseData,
	PokemonResponseData,
	SpeciesResponseData,
} from "../shared/interfaces/pokeapi.interface.js";
import type {
	Pokemon,
	PokemonEvolution,
} from "../shared/interfaces/pokemon.interface.js";
import { cleanString } from "./helpers.js";

function assignPokemonGender(
	pokemonName: string,
	pokemonId: string,
	pokemonGenders: GenderResponseData[],
): PokemonGender[] {
	const genders = pokemonGenders.filter((gender) => {
		return gender.pokemon_species_details.some(
			(specie) => specie.pokemon_species.name === pokemonName,
		);
	});

	return genders.map((gender) => {
		return {
			id: gender.id,
			gender: gender.name,
			pokemonId: pokemonId,
		};
	});
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

function assignDescription(
	pokemonName: string,
	pokemonSpecies: SpeciesResponseData[],
): string {
	const specie = pokemonSpecies.find((specie) => {
		if (specie.name === pokemonName) {
			return specie;
		}
	});

	const description = specie?.flavor_text_entries.find((flavor) => {
		if (flavor.language.name === "en") {
			return flavor;
		}
	});

	return cleanString(`${description?.flavor_text}`);
}

function groupByEvolutionChain(
	pokemon: PokemonResponseData,
	evolutions: string[][],
): PokemonEvolution[] {
	const evolutionIndex = evolutions.findIndex((evolution) =>
		evolution.includes(pokemon.name),
	);
	if (evolutionIndex === -1) {
		return [];
	}
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
): Pokemon[] {
	return pokemons.map((pokemon) => {
		const pokemonId = pokemon.id.toString();
		return {
			id: pokemonId,
			name: pokemon.name,
			height: pokemon.height,
			weight: pokemon.weight,
			category: assignCategory(pokemon.name, species),
			description: assignDescription(pokemon.name, species),
			sprite: pokemon.sprites.front_default,
			genders: assignPokemonGender(pokemon.name, pokemonId, genders),
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
		if (nextEvolution) {
			evolutionChain.push(...extractEvolutionChain(nextEvolution));
		}
	}

	return evolutionChain;
}

export { extractEvolutionChain, mapPokemonsApi };
