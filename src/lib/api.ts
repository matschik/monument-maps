import { type Bounds } from '$lib/utils';
import { fetchOverpassMonumentsOnBounds, fetchImageFromWikidata, fetchOverpassMonumentById } from './overpassApi';

export type Monument = {
    id: string;
    lat: number;
    lon: number;
    type: string;
    name: string;
    imageURL: string;
};

async function overpassMonumentToMonument(monument: any): Promise<Monument> {
    let imageURL = '';
    const wikidata = monument?.tags?.wikidata || monument?.tags?.['subject:wikidata'] || ""

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
        id: monument.id,
        lat: monument.lat,
        lon: monument.lon,
        type: monument.type,
        name: monument?.tags?.name || "",
        imageURL
    };
}

export async function fetchMonumentById(id: string): Promise<Monument> {
    const monumentFromOverpass = await fetchOverpassMonumentById(id);
    const monument = await overpassMonumentToMonument(monumentFromOverpass);
    return monument;
}

export async function fetchMonuments(bounds: Bounds): Promise<Monument[]> {
    const monumentsFromOverpass = await fetchOverpassMonumentsOnBounds(bounds);
    const monuments: Monument[] = await Promise.all(monumentsFromOverpass.map(overpassMonumentToMonument));
    return monuments;
}