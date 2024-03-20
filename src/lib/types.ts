export type Place = {
	title: string;
	bounds: Bounds;
	monuments: Monument[];
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
