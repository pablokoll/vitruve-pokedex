import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPokemonAbilities } from "../api/pokemon";

interface useAbilitiesResult {
	abilities: string[] | undefined;
}

export const useAbilities = (): useAbilitiesResult => {
	const queryClient = useQueryClient();
	const allAbilities = queryClient.getQueryData<string[]>(["abilities"]) || [];

	const { data: abilities } = useQuery<string[]>({
		queryKey: ["abilities"],
		queryFn: async () => {
			return allAbilities.length ? allAbilities : fetchPokemonAbilities();
		},
		staleTime: Number.POSITIVE_INFINITY,
	});

	return {
		abilities,
	};
};
