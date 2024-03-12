<script lang="ts">
	import MapLibre, { type MarkerData } from '$lib/MapLibre.svelte';
	import maplibregl from 'maplibre-gl';
	import { type Writable, type Readable, get, derived } from 'svelte/store';
	import { fetchMonuments, type Monument } from '$lib/api';
	import { type Bounds, useQuery } from '$lib/utils';
	import LandmarkIcon from 'lucide-svelte/icons/landmark';
	import SearchIcon from 'lucide-svelte/icons/search';
	import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
	import LoadingIcon from '$lib/LoadingIcon.svelte';
	import MapLibreMarker from '$lib/MapLibreMarker.svelte';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';

	let mapLibre: MapLibre;
	let myMap: maplibregl.Map;
	let mapCenter: Writable<maplibregl.LngLatLike>;
	let mapBounds: Writable<Bounds>;
	let mapZoom: Writable<number>;
	let metaMarkers: Readable<MarkerData[]>;
	export let mapMonuments: Readable<Monument[]>;

	let mapIsLoaded = false;
	function addMapLoadCallback(callback: () => void) {
		if (mapIsLoaded) {
			callback();
		} else {
			myMap.once('load', callback);
		}
	}

	onMount(() => {
		mapMonuments = derived(metaMarkers, ($metaMarkers) => {
			return $metaMarkers.map((m) => m.data);
		});
	});

	export function setBounds(bounds: Bounds) {
		addMapLoadCallback(() => {
			myMap.fitBounds(bounds, { animate: false });
		});
	}

	export function setMonuments(monuments: Monument[]) {
		addMapLoadCallback(() => {
			setMarkersFromMonuments(monuments);
		});
	}

	export function setCenter(center: maplibregl.LngLatLike) {
		addMapLoadCallback(() => {
			myMap.setCenter(center);
		});
	}

	export function setZoom(zoom: number) {
		addMapLoadCallback(() => {
			myMap.setZoom(zoom);
		});
	}

	const initialMapOptions: Partial<maplibregl.MapOptions> = {};

	const {
		fetch: monumentsQueryFetch,
		data: monumentsQueryData,
		isLoading: monumentsQueryIsLoading
	} = useQuery<Monument[]>(async () => {
		const bounds = get(mapBounds);
		const monuments = await fetchMonuments(bounds);
		return monuments;
	});

	function setMarkersFromMonuments(monuments: Monument[]) {
		if (!mapLibre) return;
		if (!Array.isArray(monuments)) {
			mapLibre.setMarkers([]);
		} else {
			mapLibre.setMarkers(
				monuments.map((monument: any) => {
					const element = document.createElement('div');

					new MapLibreMarker({
						target: element,
						props: {
							monumentId: monument.id
						}
					});

					return {
						id: `overpass-${monument.id}`,
						latitude: monument.lat,
						longitude: monument.lon,
						options: {
							element
						},
						data: monument
					};
				})
			);
		}
	}

	async function fetchMonumentsOnBounds() {
		await monumentsQueryFetch();

		const monuments = get(monumentsQueryData);
		if (monuments) {
			setMarkersFromMonuments(monuments);
		}
	}

	function onMapInit() {
		myMap.once('load', () => {
			mapIsLoaded = true;
		});
	}

	$: isLoadingData = !!$navigating || $monumentsQueryIsLoading;
</script>

<div class="flex overflow-hidden max-h-screen">
	<div class="flex-1 overflow-auto hidden md:block max-w-[600px] px-4 pb-10">
		<header class="flex justify-between items-center pt-2">
			<div class="py-2">
				<a href="/">
					<h1 class="text-xl text-red-700 font-bold flex items-center space-x-2">
						<LandmarkIcon width="15" height="15" class="size-6" />
						<span>Monument Maps</span>
					</h1>
				</a>
			</div>
			{#if myMap}
				<button
					class="group relative inline-flex h-8 text-sm items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 duration-500"
					on:click={fetchMonumentsOnBounds}
					disabled={isLoadingData}
				>
					{#if isLoadingData}
						<LoadingIcon class="w-[2rem] h-[0.88rem]" />
					{:else}
						<div
							class="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6"
						>
							<div
								class="absolute translate-x-0 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0"
							>
								<SearchIcon width="15" height="15" class="size-4" />
							</div>
							<span class="pl-6">Search</span>
							<div
								class="absolute right-0 translate-x-12 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100"
							>
								<ArrowRightIcon width="15" height="15" class="size-4" />
							</div>
						</div>
					{/if}
				</button>
			{/if}
		</header>
		<nav class="flex space-x-2 text-sm">
			<a href="/city/paris" class="text-blue-600 hover:text-blue-500 underline">
				<span>Paris</span>
			</a>
			<a href="/city/berlin" class="text-blue-600 hover:text-blue-500 underline">
				<span>Berlin</span>
			</a>
			<a href="/city/london" class="text-blue-600 hover:text-blue-500 underline">
				<span>London</span>
			</a>
			<a href="/city/rome" class="text-blue-600 hover:text-blue-500 underline">
				<span>Rome</span>
			</a>
		</nav>
		<main>
			{#if isLoadingData}
				<div class="flex justify-center py-8">
					<LoadingIcon class="w-[3rem]" />
				</div>
			{:else if Array.isArray($mapMonuments)}
				<slot />
			{/if}
		</main>
	</div>

	<aside class="flex-1 w-full md:w-1/2 h-screen">
		<MapLibre
			bind:this={mapLibre}
			bind:map={myMap}
			bind:center={mapCenter}
			bind:bounds={mapBounds}
			bind:zoom={mapZoom}
			bind:metaMarkers
			{initialMapOptions}
			on:init={onMapInit}
		/>
	</aside>
</div>

<style>
	@keyframes bounce {
		0% {
			transform: translateY(0);
		}
		10% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-5px);
		}
		50% {
			transform: translateY(0);
		}
		64% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(0);
		}
	}
	:global(.animate-bounce) {
		animation: bounce 0.9s infinite;
	}
</style>
