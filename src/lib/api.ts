import { isCoordinatesInBounds, type Bounds } from '$lib/utils';
import type { OverpassNode } from 'overpass-ts';
import {
	fetchOverpassMonumentsOnBounds,
	fetchImageFromWikidata,
	fetchOverpassMonumentById
} from './overpassApi';
import { MONUMENT_MICHELIN } from './constants';
import { error } from '@sveltejs/kit';

export type Monument = {
	id: string;
	lat: number;
	lon: number;
	type: string;
	name: string;
	imageURL: string;
};

export async function fetchMonumentById(id: string): Promise<Monument | undefined> {
	if (id === MONUMENT_MICHELIN.id) {
		return MONUMENT_MICHELIN;
	}
	if (!id || Number.isNaN(Number(id))) {
		error(404, 'Not found');
	}
	const monumentFromOverpass = await fetchOverpassMonumentById(id);
	if (!monumentFromOverpass) {
		return;
	}
	const monument = await overpassMonumentToMonument(monumentFromOverpass);
	return monument;
}

export async function fetchMonuments(bounds: Bounds): Promise<Monument[]> {
	const monumentsFromOverpass = await fetchOverpassMonumentsOnBounds(bounds);
	const monumentsNormalized: Monument[] = await Promise.all(
		monumentsFromOverpass.map(overpassMonumentToMonument)
	);

	const monuments = isCoordinatesInBounds([MONUMENT_MICHELIN.lon, MONUMENT_MICHELIN.lat], bounds)
		? [MONUMENT_MICHELIN, ...monumentsNormalized]
		: monumentsNormalized;

	return monuments;
}

async function overpassMonumentToMonument(monument: OverpassNode): Promise<Monument> {
	let imageURL = '';
	const wikidata = monument?.tags?.wikidata || monument?.tags?.['subject:wikidata'] || '';

	if (wikidata) {
		try {
			const image = await fetchImageFromWikidata(wikidata as string);
			if (image) {
				imageURL = image;
			}
		} catch (err) {
			console.error(err);
		}
	}

	return {
		id: String(monument.id),
		lat: monument.lat,
		lon: monument.lon,
		type: monument.type,
		name: monument?.tags?.name || '',
		imageURL
	};
}
