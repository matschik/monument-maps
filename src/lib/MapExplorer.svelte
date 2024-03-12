<script lang="ts">
	import MapLibre, { type MarkerData } from '$lib/MapLibre.svelte';
	import maplibregl from 'maplibre-gl';
	import { type Writable, type Readable, get, writable } from 'svelte/store';
	import { fetchMonuments, type Monument } from '$lib/api';
	import { type Bounds, useQuery } from '$lib/utils';
	import LandmarkIcon from 'lucide-svelte/icons/landmark';
	import SearchIcon from 'lucide-svelte/icons/search';
	import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
	import LoadingIcon from '$lib/LoadingIcon.svelte';
	import MapLibreMarker from '$lib/MapLibreMarker.svelte';
	import { navigating } from '$app/stores';

	export let initialBounds: Bounds | null = null;
	export let initialMonuments: Monument[] | null = null;
	export let initialCenter: maplibregl.LngLatLike | null = null;
	export let initialSelectedMonumentId: string | null = null;

	let mapLibre: MapLibre;
	let myMap: maplibregl.Map;
	let mapCenter: Writable<maplibregl.LngLatLike>;
	let mapBounds: Writable<Bounds>;
	let mapZoom: Writable<number>;
	let metaMarkers: Readable<MarkerData[]>;
	let selectedMonumentId: string | null = initialSelectedMonumentId;
	$: selectedMonument =
		selectedMonumentId && initialMonuments
			? initialMonuments.find((monument) => monument.id === selectedMonumentId)
			: null;

	const initialMapOptions: Partial<maplibregl.MapOptions> = {};

	if (initialBounds) {
		initialMapOptions.bounds = initialBounds;
	} else if (initialCenter) {
		initialMapOptions.center = initialCenter;
		initialMapOptions.zoom = 12;
	} else {
		initialMapOptions.bounds = [
			-20.639164778062735, 31.292140930768284, 43.17877560026244, 59.83601007567944
		];
	}

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
						meta: monument
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
		if (initialMonuments) {
			setMarkersFromMonuments(initialMonuments);
		}
	}

	$: {
		if (initialMonuments) {
			setMarkersFromMonuments(initialMonuments);
		}
	}

	$: {
		if (myMap && initialBounds) {
			myMap.fitBounds(initialBounds, { linear: true });
		}
	}

	function highlightMapMarker(itemId: string) {
		const monument = document.querySelector(`[data-marker-monument='${itemId}']`);

		if (monument && !monument.classList.contains('animate-bounce')) {
			monument.classList.add('animate-bounce');
		}
	}

	function unhighlightMapMarker(itemId: string) {
		const monument = document.querySelector(`[data-marker-monument='${itemId}']`);

		if (monument && monument.classList.contains('animate-bounce')) {
			monument.classList.remove('animate-bounce');
		}
	}
</script>

<div class="flex overflow-hidden max-h-screen">
	<div class="flex-1 overflow-auto hidden md:block max-w-[600px] px-4 pb-10">
		<div class="flex justify-between items-center pt-2">
			<div class="py-2">
				<a href="/">
					<h1 class="text-xl text-red-700 font-bold flex items-center space-x-2">
						<LandmarkIcon width="15" height="15" class="size-6" /> <span>Monument Maps</span>
					</h1>
				</a>
			</div>
			{#if myMap}
				<button
					class="group relative inline-flex h-8 text-sm items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 duration-500"
					on:click={fetchMonumentsOnBounds}
					disabled={!!$navigating || $monumentsQueryIsLoading}
				>
					{#if !!$navigating || $monumentsQueryIsLoading}
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
		</div>
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

		{#if selectedMonument}
			<div class="mt-6">
				<h2 class="text-center font-semibold text-lg">{selectedMonument.name}</h2>
				<img src={selectedMonument.imageURL} alt="" class="mt-4 rounded" />
			</div>
		{:else if !!$navigating || $monumentsQueryIsLoading}
			<div class="flex justify-center py-8">
				<LoadingIcon class="w-[3rem]" />
			</div>
		{:else if Array.isArray($metaMarkers)}
			<div>
				<div class="font-medium mt-2">
					{$metaMarkers.length} result{$metaMarkers.length > 1 ? 's' : ''}
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
					{#each $metaMarkers as metaMarker}
						<a
							href={`/monument/${metaMarker.meta.id}`}
							on:mouseenter={() => highlightMapMarker(metaMarker.meta.id)}
							on:mouseleave={() => unhighlightMapMarker(metaMarker.meta.id)}
						>
							<div
								class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
							>
								<div class="flex-shrink-0">
									{#if metaMarker.meta.imageURL.trim()}
										<img
											class="size-10 rounded-full bg-red-700"
											src={metaMarker.meta.imageURL}
											alt=""
										/>
									{:else}
										<div
											class="bg-red-700 rounded-full size-10 text-white flex justify-center items-center"
										>
											<LandmarkIcon width="15" height="15" class="size-5" />
										</div>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<span class="absolute inset-0" aria-hidden="true"></span>
									<p class="text-sm font-medium text-gray-900">{metaMarker.meta.name}</p>
									<!-- {#if metaMarker.meta.tags.note}
									<p class="truncate text-sm text-gray-500">{metaMarker.meta.tags.note}</p>
									{/if} -->
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex-1 w-full md:w-1/2 h-screen">
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
	</div>
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
