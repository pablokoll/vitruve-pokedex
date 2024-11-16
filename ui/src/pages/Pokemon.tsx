import { IonButton, IonContent, IonPage, IonSearchbar } from "@ionic/react";
import type React from "react";
import { containerStyle } from "../styles/styles";

const PokemonPage: React.FC = () => {
	
	
	return (
		<IonPage>
			<IonContent>
				<div className={containerStyle}>
					<IonSearchbar />
					<div color="danger">Pokemon</div>
					<IonButton color="red-velvet">Favorite</IonButton>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default PokemonPage;
