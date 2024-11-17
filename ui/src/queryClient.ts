import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnReconnect: true,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			// networkMode: "offlineFirst",
		},
		mutations: {
			// networkMode: "offlineFirst",
		},
	},
});
export const persister = createSyncStoragePersister({
	storage: window.localStorage,
});
