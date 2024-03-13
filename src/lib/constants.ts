import type { Monument, Bounds } from '$lib/types';

export const PLACE_MICHELIN: { title: string; bounds: Bounds } = {
	title: 'Michelin Boulogne-Billancourt',
	bounds: [2.1219972380452816, 48.795406039228226, 2.3460153349686834, 48.860273059708106]
};

export const MONUMENT_MICHELIN: Monument = {
	id: 'michelin',
	lat: 48.82785004580804,
	lon: 2.2340062865071264,
	type: 'node',
	name: PLACE_MICHELIN.title,
	imageURL: '/michelin-boulogne.jpg'
};

export const cityBySlug: { [key: string]: { title: string; bounds: Bounds } } = {
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
