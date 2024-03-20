import { createSchema, createYoga } from 'graphql-yoga';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { loadFiles } from '@graphql-tools/load-files';
import { fetchMonumentById, fetchMonuments } from './api';
import type { Place } from '$lib/types';

const cityBySlug: { [key: string]: Place } = {
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
	},
	ireland: {
		title: 'Ireland',
		bounds: [-10.65, 51.45, -6.2, 55.5]
	}
};

const typeDefsPath = path.resolve('.', 'schema.graphql')
console.log({ typeDefsPath })

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: await loadFiles(typeDefsPath),
		resolvers: {
			Query: {
				monumentById: async (_, { id }) => {
					const monument = await fetchMonumentById(id);
					if (!monument) {
						throw new Error(`Monument with ID ${id} not found`);
					}
					return monument;
				},
				monumentsInBounds: async (_, { bounds }) => {
					const monuments = await fetchMonuments(bounds);
					return { monuments, bounds };
				},
				placeBySlug: async (_, { slug }) => {
					const place = cityBySlug[slug];
					if (!place) {
						throw new Error(`Place with slug ${slug} not found`);
					}
					return place;
				},
				monumentsByPlaceSlug: async (_, { slug }) => {
					const place = cityBySlug[slug];
					if (!place) {
						throw new Error(`Place with slug ${slug} not found`);
					}
					const monuments = await fetchMonuments(place.bounds);
					return monuments;
				}
			}
		}
	}),
	graphqlEndpoint: '/api/graphql',
	fetchAPI: {
		Response
	}
}) satisfies RequestHandler;

export { yogaApp as GET, yogaApp as POST, yogaApp as OPTIONS };
