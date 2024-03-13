import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchMonuments } from '$lib/api';
import { cityBySlug } from '$lib/constants';

export const load: PageServerLoad = async ({ params }) => {
	const city = cityBySlug[params.slug];
	if (!city) {
		error(404, 'Not found');
	}
	const monuments = await fetchMonuments(city.bounds);
	if (city) {
		return {
			place: {
				...city,
				monuments
			}
		};
	}

	error(404, 'Not found');
};
