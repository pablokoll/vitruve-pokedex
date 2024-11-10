export interface CreatePokemonDto {
	name: string;
	height?: number;
	weight?: number;
	category?: string;
	abilities: string[];
	genders?: string[];
	evolutions?: string[];
	sprite?: string;
	types: string[];
	stats: PokemonStatDto[];
	userId: string;
}

export interface PokemonStatDto {
	statName: string;
	value: number;
}
