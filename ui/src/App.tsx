import {
	IonApp,
	IonPage,
	IonRouterOutlet,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Navbar from "./components/Navigation/NavBar";

import "./index.css";
import "./theme/variables.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Ionic Dark Mode */
import "@ionic/react/css/palettes/dark.system.css";

import { css } from "../styled-system/css";
import FavoritePage from "./pages/FavoritePage";
import PokedexPage from "./pages/PokedexPage";
import PokemonDetails from "./pages/PokemonDetails";
import SigninPage from "./pages/SignInPage";
import SignupPage from "./pages/SignUpPage";
import TeamPage from "./pages/TeamPage";
import AuthProvider from "./providers/AuthProvider";

setupIonicReact();

const App: React.FC = () => (
	<AuthProvider>
		<IonApp>
			<IonReactRouter>
				<Navbar />
				<IonPage
					id="main-content"
					className={css({
						marginTop: "56px",
					})}
				>
					<IonRouterOutlet>
						<Route exact path="/pokedex" component={PokedexPage} />
						<Route exact path="/favorites" component={FavoritePage} />
						<Route exact path="/team" component={TeamPage} />
						<Route exact path="/signin" component={SigninPage} />
						<Route exact path="/signup" component={SignupPage} />
						<Route exact path="/pokedex/:pokemonName" component={PokemonDetails} />
						<Redirect exact from="/" to="/pokedex" />
					</IonRouterOutlet>
				</IonPage>
			</IonReactRouter>
		</IonApp>
	</AuthProvider>
);

export default App;
