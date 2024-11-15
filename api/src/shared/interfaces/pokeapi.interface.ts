export interface PokemonsResponseData {
	count: number;
	next: string | null;
	previous: string | null;
	results: PokemonData[];
}

export interface PokemonData {
	name: string;
	url: string;
}

export interface PokemonResponseData {
	abilities: Ability[];
	base_experience: number;
	cries: Cries;
	forms: Form[];
	game_indices: Index[];
	height: number;
	held_items: unknown[];
	id: number;
	is_default: boolean;
	location_area_encounters: string;
	moves: Mfe[];
	name: string;
	order: number;
	past_abilities: unknown[];
	past_types: unknown[];
	species: Species;
	sprites: Sprites;
	stats: Stat[];
	types: Type[];
	weight: number;
}

export interface Ability {
	ability: Ability2;
	is_hidden: boolean;
	slot: number;
}

export interface Ability2 {
	name: string;
	url: string;
}

export interface Cries {
	latest: string;
	legacy: string;
}

export interface Form {
	name: string;
	url: string;
}

export interface Index {
	game_index: number;
	version: Version;
}

export interface Version {
	name: string;
	url: string;
}

export interface Mfe {
	move: Move;
	version_group_details: VersionGroupDetail[];
}

export interface Move {
	name: string;
	url: string;
}

export interface VersionGroupDetail {
	level_learned_at: number;
	move_learn_method: MoveLearnMethod;
	version_group: VersionGroup;
}

export interface MoveLearnMethod {
	name: string;
	url: string;
}

export interface VersionGroup {
	name: string;
	url: string;
}

export interface Species {
	name: string;
	url: string;
}

export interface Sprites {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
	other: Other;
	versions: Versions;
}

export interface Other {
	dream_world: DreamWorld;
	home: Home;
	"official-artwork": OfficialArtwork;
	showdown: Showdown;
}

export interface DreamWorld {
	front_default: string;
	front_female: unknown;
}

export interface Home {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface OfficialArtwork {
	front_default: string;
	front_shiny: string;
}

export interface Showdown {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface Versions {
	"generation-i": GenerationI;
	"generation-ii": GenerationIi;
	"generation-iii": GenerationIii;
	"generation-iv": GenerationIv;
	"generation-v": GenerationV;
	"generation-vi": GenerationVi;
	"generation-vii": GenerationVii;
	"generation-viii": GenerationViii;
}

export interface GenerationI {
	"red-blue": RedBlue;
	yellow: Yellow;
}

export interface RedBlue {
	back_default: string;
	back_gray: string;
	back_transparent: string;
	front_default: string;
	front_gray: string;
	front_transparent: string;
}

export interface Yellow {
	back_default: string;
	back_gray: string;
	back_transparent: string;
	front_default: string;
	front_gray: string;
	front_transparent: string;
}

export interface GenerationIi {
	crystal: Crystal;
	gold: Gold;
	silver: Silver;
}

export interface Crystal {
	back_default: string;
	back_shiny: string;
	back_shiny_transparent: string;
	back_transparent: string;
	front_default: string;
	front_shiny: string;
	front_shiny_transparent: string;
	front_transparent: string;
}

export interface Gold {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
	front_transparent: string;
}

export interface Silver {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
	front_transparent: string;
}

export interface GenerationIii {
	emerald: Emerald;
	"firered-leafgreen": FireredLeafgreen;
	"ruby-sapphire": RubySapphire;
}

export interface Emerald {
	front_default: string;
	front_shiny: string;
}

export interface FireredLeafgreen {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
}

export interface RubySapphire {
	back_default: string;
	back_shiny: string;
	front_default: string;
	front_shiny: string;
}

export interface GenerationIv {
	"diamond-pearl": DiamondPearl;
	"heartgold-soulsilver": HeartgoldSoulsilver;
	platinum: Platinum;
}

export interface DiamondPearl {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface HeartgoldSoulsilver {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface Platinum {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface GenerationV {
	"black-white": BlackWhite;
}

export interface BlackWhite {
	animated: Animated;
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface Animated {
	back_default: string;
	back_female: unknown;
	back_shiny: string;
	back_shiny_female: unknown;
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface GenerationVi {
	"omegaruby-alphasapphire": OmegarubyAlphasapphire;
	"x-y": XY;
}

export interface OmegarubyAlphasapphire {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface XY {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface GenerationVii {
	icons: Icons;
	"ultra-sun-ultra-moon": UltraSunUltraMoon;
}

export interface Icons {
	front_default: string;
	front_female: unknown;
}

export interface UltraSunUltraMoon {
	front_default: string;
	front_female: unknown;
	front_shiny: string;
	front_shiny_female: unknown;
}

export interface GenerationViii {
	icons: Icons2;
}

export interface Icons2 {
	front_default: string;
	front_female: unknown;
}

export interface Stat {
	base_stat: number;
	effort: number;
	stat: Stat2;
}

export interface Stat2 {
	name: string;
	url: string;
}

export interface Type {
	slot: number;
	type: Type2;
}

export interface Type2 {
	name: string;
	url: string;
}

export interface GenderResponseData {
	id: number
	name: string
	pokemon_species_details: PokemonSpeciesDetail[]
	required_for_evolution: unknown[]
  }
  
  export interface PokemonSpeciesDetail {
	pokemon_species: PokemonSpecies
	rate: number
  }
  
  export interface PokemonSpecies {
	name: string
	url: string
  }
  
  export interface SpeciesResponseData {
	base_happiness: number
	capture_rate: number
	color: Color
	egg_groups: EggGroup[]
	evolution_chain: EvolutionChain
	evolves_from_species: unknown
	flavor_text_entries: FlavorTextEntry[]
	form_descriptions: unknown[]
	forms_switchable: boolean
	gender_rate: number
	genera: Genera[]
	generation: Generation
	growth_rate: GrowthRate
	habitat: Habitat
	has_gender_differences: boolean
	hatch_counter: number
	id: number
	is_baby: boolean
	is_legendary: boolean
	is_mythical: boolean
	name: string
	names: Name[]
	order: number
	pal_park_encounters: PalParkEncounter[]
	pokedex_numbers: PokedexNumber[]
	shape: Shape
	varieties: Variety[]
  }
  
  export interface Color {
	name: string
	url: string
  }
  
  export interface EggGroup {
	name: string
	url: string
  }
  
  export interface EvolutionChain {
	url: string
  }
  
  export interface FlavorTextEntry {
	flavor_text: string
	language: Language
	version: Version
  }
  
  export interface Language {
	name: string
	url: string
  }
  
  export interface Version {
	name: string
	url: string
  }
  
  export interface Genera {
	genus: string
	language: Language2
  }
  
  export interface Language2 {
	name: string
	url: string
  }
  
  export interface Generation {
	name: string
	url: string
  }
  
  export interface GrowthRate {
	name: string
	url: string
  }
  
  export interface Habitat {
	name: string
	url: string
  }
  
  export interface Name {
	language: Language3
	name: string
  }
  
  export interface Language3 {
	name: string
	url: string
  }
  
  export interface PalParkEncounter {
	area: Area
	base_score: number
	rate: number
  }
  
  export interface Area {
	name: string
	url: string
  }
  
  export interface PokedexNumber {
	entry_number: number
	pokedex: Pokedex
  }
  
  export interface Pokedex {
	name: string
	url: string
  }
  
  export interface Shape {
	name: string
	url: string
  }
  
  export interface Variety {
	is_default: boolean
	pokemon: Pokemon
  }
  
  export interface Pokemon {
	name: string
	url: string
  }
  
  export interface EvolutionChainResponseData {
	baby_trigger_item: unknown
	chain: Chain
	id: number
  }
  
  export interface Chain {
	evolution_details: EvolutionDetail[]
	evolves_to: Chain[]
	is_baby: boolean
	species: Species3
  }
  
  export interface EvolutionDetail {
	gender: string
	held_item: string
	item: string
	known_move: string
	known_move_type: string
	location: string
	min_affection: string
	min_beauty: string
	min_happiness: string
	min_level: number
	needs_overworld_rain: boolean
	party_species: string
	party_type: string
	relative_physical_stats: string
	time_of_day: string
	trade_species: string
	trigger: Trigger
	turn_upside_down: boolean
  }
  
  export interface Trigger {
	name: string
	url: string
  }
  
  
  export interface EvolutionDetail2 {
	gender: string
	held_item: unknown
	item: unknown
	known_move: unknown
	known_move_type: unknown
	location: unknown
	min_affection: unknown
	min_beauty: unknown
	min_happiness: unknown
	min_level: number
	needs_overworld_rain: boolean
	party_species: unknown
	party_type: unknown
	relative_physical_stats: unknown
	time_of_day: string
	trade_species: unknown
	trigger: Trigger2
	turn_upside_down: boolean
  }
  
  export interface Trigger2 {
	name: string
	url: string
  }
  
  export interface Species {
	name: string
	url: string
  }
  
  export interface Species2 {
	name: string
	url: string
  }
  
  export interface Species3 {
	name: string
	url: string
  }
  