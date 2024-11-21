import {
	type UseMutationResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { deleteUserPokemon } from "../api/pokemon";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

interface UseDeletePokemonResult {
	deletePokemon: UseMutationResult<
		{ message: string },
		Error,
		{ id: string; name: string },
		unknown
	>["mutate"];
	isPending: boolean;
	isError: boolean;
	isSuccess: boolean;
	error: AxiosError | null;
}

const useDeletePokemon = (): UseDeletePokemonResult => {
	const queryClient = useQueryClient();

	const { mutate, isSuccess, isPending, isError, error } = useMutation<
		{ message: string },
		AxiosError,
		{ id: string; name: string },
		{ prevPokemon: Pokemon }
	>({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			deleteUserPokemon(id, name),

		onMutate: async (pokemon) => {
			await queryClient.cancelQueries({
				queryKey: ["pokemons", pokemon.name],
			});

			const prevPokemon = queryClient.getQueryData<Pokemon>([
				"pokemons",
				pokemon.name,
			]);
			if (prevPokemon) {
				return { prevPokemon };
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pokemons", "infinite"] });
		},
		onError: (error, variables, context) => {
			if (context?.prevPokemon) {
				queryClient.setQueryData(["pokemons", "infinite"], context.prevPokemon);
			}
		},
	});

	return { deletePokemon: mutate, isSuccess, isPending, isError, error };
};

export default useDeletePokemon;
