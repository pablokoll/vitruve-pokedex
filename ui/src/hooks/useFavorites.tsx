import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import {
	fetchUserPokemonsFavorites,
	toggleUserFavoritePokemon,
} from "../api/pokemon";
import { useAuth } from "../providers/AuthProvider";
import type {
	Pokemon,
	PokemonFavorite,
} from "../shared/interfaces/pokemon.interface";

interface UseFavoritesResult {
	favorites: PokemonFavorite[] | undefined;
	updateFavorite: UseMutationResult<
		{ message: string },
		Error,
		{ id: string; action?: "add" },
		unknown
	>["mutate"];
}

const useFavorites = (): UseFavoritesResult => {
	const { isAuthenticated } = useAuth();
	const {
		data: favorites,
		isError,
		refetch,
	} = useQuery<PokemonFavorite[]>({
		queryKey: ["pokemons", "favorites"],
		queryFn: fetchUserPokemonsFavorites,
		enabled: isAuthenticated,
		retry: 3,
	});

	const queryClient = useQueryClient();

	const { mutate: toggleFavorite } = useMutation<
		{ message: string },
		AxiosError,
		{ id: string; action?: "add" },
		{ prevData: unknown }
	>({
		mutationFn: ({ id, action }) => toggleUserFavoritePokemon(id, action),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pokemons", "favorites"] });
		},
		onError: (error, variables) => {
			if (error.response?.statusText === "Unauthorized") {
				const authListener = () => {
					toggleFavorite({ id: variables.id, action: 'add' });
					document.removeEventListener("userAuthenticated", authListener);
				};
				document.addEventListener("userAuthenticated", authListener);
			}
		},
		onMutate: async (variables) => {
			await queryClient.cancelQueries({ queryKey: ["pokemons", "favorites"] });
			queryClient.setQueryData(
				["pokemons", "favorites"],
				(oldData: Pokemon[]) => {
					return oldData.map((pokemon: Pokemon) =>
						pokemon.id === variables.id
							? { ...pokemon, isFavorite: !pokemon.isFavorite }
							: pokemon,
					);
				},
			);

			return { prevData: favorites };
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["pokemons", "favorites"] });
		},
	});

	useEffect(() => {
		if (isError) {
			refetch();
		}
	}, [isError, refetch]);

	useEffect(() => {
		if (!isAuthenticated) {
			queryClient.setQueryData(["pokemons", "favorites"], []);
		}
	});

	return {
		favorites,
		updateFavorite: toggleFavorite,
	};
};

export default useFavorites;
