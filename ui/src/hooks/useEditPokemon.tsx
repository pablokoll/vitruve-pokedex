import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateUserPokemon } from "../api/pokemon";
import type { UpdatePokemonDto } from "../shared/dto/update-pokemon.dto";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

interface UseEditPokemonResult {
	editPokemon: (editedPokemon: UpdatePokemonDto) => void;
	isPending: boolean;
	isError: boolean;
	isSuccess: boolean;
	error: AxiosError | null;
}

const useEditPokemon = (): UseEditPokemonResult => {
	const queryClient = useQueryClient();

	const { mutate, isPending, isError, error, isSuccess } = useMutation<
		Pokemon,
		AxiosError,
		UpdatePokemonDto,
		{ prevPokemon: Pokemon | undefined } | undefined
	>({
		mutationFn: (editedPokemon) => {
			return updateUserPokemon(editedPokemon);
		},
		onMutate: async (editedPokemon) => {
			await queryClient.cancelQueries({
				queryKey: ["pokemons", editedPokemon.name],
			});
			await queryClient.cancelQueries({ queryKey: ["pokemons", "infinite"] });
			const prevPokemon = queryClient.getQueryData<Pokemon>([
				"pokemons",
				editedPokemon.name,
			]);

			return { prevPokemon };
		},
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ["pokemons", "infinite"] });
			queryClient.setQueryData<Pokemon>(["pokemons", data.name], data);
		},
		onError: (error, variables, context) => {
			if (context?.prevPokemon) {
				queryClient.setQueryData<Pokemon>(
					["pokemons", context.prevPokemon.name],
					context.prevPokemon,
				);
			}
		},
	});

	return { editPokemon: mutate, isSuccess, isPending, isError, error };
};

export default useEditPokemon;