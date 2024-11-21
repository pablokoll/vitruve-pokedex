export interface CreatePokemonDto {
	name: string;
	height?: number;
	weight?: number;
	category?: string;
	description?: string;
	abilities: string[];
	genders?: string[];	
	evolutions?: string[];
	sprite?: string;
	types: string[];
	stats: PokemonStatDto[];
}

export interface PokemonStatDto {
	statName: string;
	value: number;
}
