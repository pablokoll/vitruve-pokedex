import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { persister, queryClient } from "./queryClient";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
	<PersistQueryClientProvider
		client={queryClient}
		persistOptions={{ persister }}
	>
		<React.StrictMode>
			<App />
			<ReactQueryDevtools initialIsOpen />
		</React.StrictMode>
	</PersistQueryClientProvider>,
);
