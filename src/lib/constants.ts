import type { Monument } from './api';
import type { Bounds } from './utils';

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
	imageURL:
		'https://lh3.googleusercontent.com/p/AF1QipO1fVxR5o44KsQRVQ48WHvUs0MUotgdCbSZ5ltF=s680-w680-h510'
};
