import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPokemonGenders } from "../api/pokemon";

interface useGendersResult {
	genders: string[] | undefined;
}

export const useGenders = (): useGendersResult => {
	const queryClient = useQueryClient();
	const allGenders = queryClient.getQueryData<string[]>(["genders"]) || [];

	const { data: genders } = useQuery<string[]>({
		queryKey: ["genders"],
		queryFn: async () => {
			return allGenders.length ? allGenders : fetchPokemonGenders();
		},
		staleTime: Number.POSITIVE_INFINITY,
	});

	return {
		genders,
	};
};
