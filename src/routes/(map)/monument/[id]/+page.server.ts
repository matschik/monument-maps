import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchMonumentById } from '$lib/api';

const MONUMENT_MICHELIN = {
	id: 'michelin',
	lat: 48.82785004580804,
	lon: 2.2340062865071264,
	type: 'node',
	name: 'Michelin Boulogne-Billancourt',
	imageURL:
		'https://lh3.googleusercontent.com/p/AF1QipO1fVxR5o44KsQRVQ48WHvUs0MUotgdCbSZ5ltF=s680-w680-h510'
};

export const load: PageServerLoad = async ({ params }) => {
	const monumentId = params.id;
	if (monumentId === 'michelin') {
		return {
			monument: MONUMENT_MICHELIN
		};
	}
	const monument = await fetchMonumentById(monumentId);
	if (monument) {
		return {
			monument
		};
	}

	error(404, 'Not found');
};
