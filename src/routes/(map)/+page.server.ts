import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	if (parentData.place) {
		return {
			place: parentData.place
		};
	}
	error(404, 'Not found');
};
