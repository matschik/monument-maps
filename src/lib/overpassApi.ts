import type { Bounds } from './utils';
import type { OverpassJson, OverpassNode } from 'overpass-ts';
import { overpass } from 'overpass-ts';

export async function fetchOverpassMonumentsOnBounds(bounds: Bounds, limit = 50) {
	const formData = `[out:json];node["historic"="monument"]["name"](${[bounds[1], bounds[0], bounds[3], bounds[2]].join(',')});out ${limit};`;
	const r = await overpass(formData);
	const json = (await r.json()) as OverpassJson;
	return json.elements as OverpassNode[];
}

export async function fetchOverpassMonumentById(id: string): Promise<OverpassNode> {
	const formData = `[out:json];node(${id});out;`;
	const r = await overpass(formData);
	const json = (await r.json()) as OverpassJson;
	return json.elements[0] as OverpassNode;
}

export async function fetchImageFromWikidata(entityId: string) {
	// Fetching data from Wikidata
	const wikidataUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`;
	const response = await fetch(wikidataUrl);
	const data = await response.json();

	// Extracting the image file name from the P18 property
	const imageFileName = data.entities?.[entityId]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
	if (!imageFileName) return null;
	const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFileName)}`;

	return imageUrl;
}
