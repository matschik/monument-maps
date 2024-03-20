import { graphql } from '$houdini';
import type { PlaceHomeVariables } from './$houdini';
import type { Bounds } from '$lib/types';

export const _houdini_load = graphql(`
	query PlaceHome($bounds: [Float!]!) {
		monumentsInBounds(bounds: $bounds) {
			monuments {
				id
				lat
				lon
				type
				name
				imageURL
			}
			bounds
		}
	}
`);

const PLACE_MICHELIN_BOUNDS = [
	2.1219972380452816, 48.795406039228226, 2.3460153349686834, 48.860273059708106
];

export const _PlaceHomeVariables: PlaceHomeVariables = ({ url }) => {
	const urlBounds = url.searchParams.get('bounds');
	let boundsFromURL: maplibregl.LngLatBoundsLike | null = null;

	if (urlBounds) {
		const boundsArray = urlBounds.split('~').map(parseFloat);
		if (boundsArray.length === 4) {
			boundsFromURL = boundsArray as Bounds;
		}
	}

	const bounds = boundsFromURL || PLACE_MICHELIN_BOUNDS;

	return {
		bounds
	};
};
