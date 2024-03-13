import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchMonumentById } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const monumentId = params.id;
	const monument = await fetchMonumentById(monumentId);
	if (monument) {
		return {
			monument
		};
	}

	error(404, 'Not found');
};
