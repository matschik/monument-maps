import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Bounds } from '$lib/utils';
import { fetchMonuments, type Monument } from '$lib/api';

const dbcity: { [key: string]: { title: string; bounds: Bounds } } = {
    paris: {
        title: 'Paris',
        bounds: [2.039583493721267, 48.69117180838387, 2.7633989074665806, 49.00578954101073]
    },
    berlin: {
        title: 'Berlin',
        bounds: [13.088, 52.338, 13.761, 52.675]
    },
    london: {
        title: 'London',
        bounds: [-0.489, 51.28, 0.236, 51.686]
    },
    rome: {
        title: 'Rome',
        bounds: [12.35, 41.8, 12.65, 42.1]
    }
}

export const load: PageServerLoad = async ({ params }) => {
    const cityFromDb = dbcity[params.slug];
    const monuments = await fetchMonuments(cityFromDb.bounds);
    if (cityFromDb) {
        return {
            city: {
                ...cityFromDb,
                monuments
            }
        };
    }


    error(404, 'Not found');
};