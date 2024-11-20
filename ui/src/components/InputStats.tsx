import { IonInput, IonLabel } from "@ionic/react";
import type React from "react";
import { useState } from "react";
import type { CustomField } from "../shared/types/field.type";

interface InputStatsProps {
	onChange: (name: string, value: CustomField) => void;
}

const InputStats: React.FC<InputStatsProps> = ({ onChange }) => {
	const [formData, setFormData] = useState({
		stats: [
			{ name: "HP", value: 1 },
			{ name: "Attack", value: 1 },
			{ name: "Defense", value: 1 },
			{ name: "Special Attack", value: 1 },
			{ name: "Special Defense", value: 1 },
			{ name: "Speed", value: 1 },
		],
	});

	const handleInputChange = (index: number, value: string) => {
		const updatedStats = [...formData.stats];
		updatedStats[index].value = Number.parseInt(value, 10);
		setFormData({ ...formData, stats: updatedStats });
		onChange(
			"statsNames",
			updatedStats.map((stat) => stat.name),
		);
		onChange(
			"statsValues",
			updatedStats.map((stat) => stat.value),
		);
	};

	return (
		<>
			<IonLabel position="floating">Stats</IonLabel>
			{formData.stats.map((stat, index) => (
				<div key={stat.name}>
					<IonLabel position="floating">{stat.name}</IonLabel>
					<IonInput
						name={stat.name}
						labelPlacement="floating"
						type="number"
						value={stat.value}
						onIonChange={(e) => handleInputChange(index, e.detail.value!)}
					/>
				</div>
			))}
		</>
	);
};

export default InputStats;
