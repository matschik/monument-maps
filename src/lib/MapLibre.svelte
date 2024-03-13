<script context="module" lang="ts">
	import 'maplibre-gl/dist/maplibre-gl.css';
	export type MarkerData = {
		id: string;
		latitude: number;
		longitude: number;
		options: maplibregl.MarkerOptions;
		data: any;
	};
</script>

<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { PUBLIC_MAP_KEY } from '$env/static/public';
	import { derived, writable } from 'svelte/store';
	import { isWebglSupported, reactiveMap } from '$lib/utils';
	import type { Bounds } from '$lib/types';

	export let initialMapOptions: Partial<maplibregl.MapOptions> = {};

	let mapContainer: HTMLDivElement;
	export let map: maplibregl.Map;
	export const zoom = writable<number>();
	export const center = writable<maplibregl.LngLatLike>();
	export const bounds = writable<Bounds>();

	const dispatch = createEventDispatcher();

	const markerMap = reactiveMap<
		string,
		{
			marker: maplibregl.Marker;
			data: MarkerData;
		}
	>();
	export const metaMarkers = derived(markerMap, ($markerMap) => {
		return Array.from($markerMap.values()).map((marker) => marker.data);
	});

	export function setMarkers(markersData: MarkerData[]) {
		if (!Array.isArray(markersData)) return;
		for (const markerData of markersData.filter(
			(markerData: any) => !markerMap.has(markerData.id)
		)) {
			const marker = new maplibregl.Marker(markerData.options)
				.setLngLat([markerData.longitude, markerData.latitude])
				.addTo(map);
			markerMap.set(markerData.id, { marker, data: markerData });
		}

		for (const [id, { marker }] of markerMap.get()) {
			if (!markersData.some((markerData: any) => markerData.id === id)) {
				marker.remove();
				markerMap.delete(id);
			}
		}
	}

	export function addMarkers(markersData: MarkerData[]) {
		if (!Array.isArray(markersData)) return;
		for (const markerData of markersData) {
			if (!markerMap.has(markerData.id)) {
				const marker = new maplibregl.Marker(markerData.options)
					.setLngLat([markerData.longitude, markerData.latitude])
					.addTo(map);
				markerMap.set(markerData.id, { marker, data: markerData });
			}
		}
	}

	export function resetMarkers() {
		for (const [id, { marker }] of markerMap.get()) {
			marker.remove();
			markerMap.delete(id);
		}
	}

	onMount(() => {
		if (!isWebglSupported()) {
			alert('Your browser does not support MapLibre GL');
		} else {
			map = new maplibregl.Map({
				container: mapContainer,
				style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${PUBLIC_MAP_KEY}`,
				...initialMapOptions
			});

			updateMapStores();

			map.on('move', () => {
				updateMapStores();
			});
			dispatch('init');
		}
	});

	function updateMapStores() {
		if (!map) return;
		zoom.set(map.getZoom());
		center.set(map.getCenter());
		const mapBounds = map.getBounds();
		const sw = mapBounds.getSouthWest();
		const ne = mapBounds.getNorthEast();
		bounds.set([sw.lng, sw.lat, ne.lng, ne.lat]);
	}

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={mapContainer} class="w-full h-full"></div>
