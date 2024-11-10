import type { CreatePokemonDto } from "./create-pokemon.dto.js";

export interface UpdatePokemonDto extends Partial<CreatePokemonDto> {
	id: string;
}
