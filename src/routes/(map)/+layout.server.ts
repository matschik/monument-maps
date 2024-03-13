import type { LayoutServerLoad } from './$types';
import { fetchMonumentById, fetchMonuments, type Monument } from '$lib/api';
import { MONUMENT_MICHELIN, PLACE_MICHELIN, dbcity, type Place } from '$lib/constants';
import type { Bounds } from '$lib/utils';

export const load: LayoutServerLoad = async ({ route, params, url }) => {
	let data:
		| {
				place?: Place;
				monument?: Monument;
		  }
		| undefined;

	if (route.id === '/(map)') {
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

		data = {
			place: {
				title: '',
				bounds,
				monuments
			}
		};
	} else if (route.id === '/(map)/monument/[id]') {
		const monumentId = params.id;
		if (monumentId) {
			if (monumentId === 'michelin') {
				data = {
					monument: MONUMENT_MICHELIN
				};
			} else {
				const monument = await fetchMonumentById(monumentId);
				if (monument) {
					data = {
						monument
					};
				}
			}
		}
	} else if (route.id === '/(map)/city/[slug]') {
		if (params.slug) {
			const cityFromDb = dbcity[params.slug];

			if (cityFromDb) {
				const monuments = await fetchMonuments(cityFromDb.bounds);
				data = {
					place: {
						...cityFromDb,
						monuments
					}
				};
			}
		}
	}

	return data;
};
