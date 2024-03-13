import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	if (parentData.monument) {
		return {
			monument: parentData.monument
		};
	}
	error(404, 'Not found');
};
