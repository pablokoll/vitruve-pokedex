import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPokemonList } from "../api/pokemon";
import type { Pokemon } from "../shared/interfaces/pokemon.interface";

interface UsePokemonsInfiniteResult {
	data: InfiniteData<Pokemon[]> | undefined;
	fetchNextPage: () => void;
	isFetching: boolean;
	hasNextPage: boolean;
	isError: boolean;
	error: unknown;
	isFetchingNextPage: boolean;
	refetch: () => void;
}

const usePokemonsInfinite = (limit: number): UsePokemonsInfiniteResult => {
	const {
		data,
		fetchNextPage,
		isFetching,
		hasNextPage,
		isError,
		error,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["pokemons", "infinite"],
		queryFn: ({ pageParam = 0 }) => fetchPokemonList(limit, pageParam),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage === undefined) return undefined;
			if (Array.isArray(lastPage)) {
				return lastPage.length === limit ? allPages.length * limit : undefined;
			}
		},
		initialPageParam: 0,
		staleTime: Number.POSITIVE_INFINITY,
	});

	useEffect(() => {
		const handleRefetch = () => {
			console.log("Evento userAuthenticated detectado: haciendo refetch...");
			refetch();
		};

		document.addEventListener("userAuthenticated", handleRefetch);
		document.addEventListener("userNotAuthenticated", handleRefetch);

		// Limpiar suscripción
		return () => {
			document.removeEventListener("userAuthenticated", handleRefetch);
			document.removeEventListener("userNotAuthenticated", handleRefetch);
		};
	}, [refetch]);

	return {
		data,
		fetchNextPage,
		isFetching,
		hasNextPage,
		isError,
		error,
		isFetchingNextPage,
		refetch,
	};
};

export default usePokemonsInfinite;
