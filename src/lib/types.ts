export type Place = {
	title: string;
	bounds: Bounds;
	monuments: Monument[];
};

export type MapExplorerContext = {
	setBounds: (bounds: Bounds) => void;
	setMonuments: (monuments: Monument[]) => void;
	addMonuments: (monuments: Monument[]) => void;
	setCenter: (center: [number, number]) => void;
	setZoom: (zoom: number) => void;
	mapMarkerAPI: {
		highlight: (id: string) => void;
		unhighlight: (id: string) => void;
		unhighlightAll: () => void;
	};
	resetScroll: () => void;
};

export type Monument = {
	id: string;
	lat: number;
	lon: number;
	type: string;
	name: string;
	imageURL: string;
};

type SouthWestLongitude = number;
type SouthWestLatitude = number;
type NorthEastLongitude = number;
type NorthEastLatitude = number;

export type Bounds = [SouthWestLongitude, SouthWestLatitude, NorthEastLongitude, NorthEastLatitude];
