import { IonSearchbar } from "@ionic/react";
import type React from "react";

const SearchBar: React.FC = () => {
	return (
		<>
			<IonSearchbar
				color="light"
				animated={true}
				placeholder="Search Pokemon"
				showClearButton="focus"
			/>
		</>
	);
};
export default SearchBar;
