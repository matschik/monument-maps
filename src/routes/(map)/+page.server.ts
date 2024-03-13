import type { PageServerLoad } from './$types';
import { PLACE_MICHELIN } from '$lib/constants';
import type { Bounds } from '$lib/types';
import { fetchMonuments } from '$lib/api';

export const load: PageServerLoad = async ({ url }) => {
	const urlBounds = url.searchParams.get('bounds');
	let boundsFromURL: maplibregl.LngLatBoundsLike | null = null;

	if (urlBounds) {
		const boundsArray = urlBounds.split('~').map(parseFloat);
		if (boundsArray.length === 4) {
			boundsFromURL = boundsArray as Bounds;
		}
	}

	const bounds = boundsFromURL || PLACE_MICHELIN.bounds;

	const monuments = await fetchMonuments(bounds);

	return {
		place: {
			title: '',
			bounds,
			monuments
		}
	};
};
