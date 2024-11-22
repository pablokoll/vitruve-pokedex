import useNetwork from "../../hooks/useNetworkStatus";

const OfflineBanner = () => {
	const isOnline = useNetwork();

	if (isOnline) return null;

	return (
		<span	
			style={{
				background: "red",
				color: "white",
				padding: "10px",
				textAlign: "center",
				marginBottom: "10px",
			}}
		>
			Offline
		</span>
	);
};

export default OfflineBanner;
