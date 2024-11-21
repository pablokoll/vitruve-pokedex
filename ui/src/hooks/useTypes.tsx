import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPokemonTypes } from "../api/pokemon";

interface useTypesResult {
	types: string[] | undefined;
}

export const useTypes = (): useTypesResult => {
	const queryClient = useQueryClient();
	const allTypes = queryClient.getQueryData<string[]>(["types"]) || [];

	const { data: types } = useQuery<string[]>({
		queryKey: ["types"],
		queryFn: async () => {
			return allTypes.length ? allTypes : fetchPokemonTypes();
		},
		staleTime: Number.POSITIVE_INFINITY,
	});

	return {
		types,
	};
};
