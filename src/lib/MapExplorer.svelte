<script lang="ts" context="module">
	import { createContext } from '$lib/utils';
	export const mapExplorerContext = createContext<{
		setBounds: (bounds: Bounds) => void;
		setMonuments: (monuments: Monument[]) => void;
		addMonuments: (monuments: Monument[]) => void;
		setCenter: (center: [number, number]) => void;
		setZoom: (zoom: number) => void;
		mapMarkerAPI: {
			highlight: (id: string) => void;
			unhighlight: (id: string) => void;
			unhighlightAll: () => void;
		};
		resetScroll: () => void;
	}>('mapExplorer');
</script>

<script lang="ts">
	import MapLibre from '$lib/MapLibre.svelte';
	import type { Map, LngLatLike } from 'maplibre-gl';
	import type { Writable } from 'svelte/store';
	import SearchIcon from 'lucide-svelte/icons/search';
	import ArrowRightIcon from 'lucide-svelte/icons/arrow-right';
	import LoadingIcon from '$lib/LoadingIcon.svelte';
	import MapLibreMarker from '$lib/MapLibreMarker.svelte';
	import { navigating } from '$app/stores';
	import type { Monument, Bounds } from '$lib/types';

	const footerLinks = {
		cities: [
			{ name: 'Paris', href: '/city/paris' },
			{ name: 'Berlin', href: '/city/berlin' },
			{ name: 'London', href: '/city/london' },
			{ name: 'Rome', href: '/city/rome' },
			{ name: 'Ireland', href: '/city/ireland' }
		],
		monuments: [
			{ name: 'Michelin Boulogne-Billancourt', href: '/monument/michelin' },
			{ name: "Monument des Droits de l'Homme", href: '/monument/4663700857' },
			{ name: 'Nationaldenkmal für die Befreiungskriege', href: '/monument/241490725' }
		]
	};
	let mapLibre: MapLibre;
	let map: Map;
	let mapBounds: Writable<Bounds>;
	let explorerEl: HTMLDivElement;

	let mapIsLoaded = false;
	const onMapInitCallbacks: (() => void)[] = [];
	function onMapLoad(callback: () => void) {
		if (map) {
			if (mapIsLoaded) {
				callback();
			} else {
				map.once('load', callback);
			}
		} else {
			onMapInitCallbacks.push(callback);
		}
	}

	function onMapInit() {
		for (const callback of onMapInitCallbacks) {
			callback();
		}
		map.once('load', () => {
			mapIsLoaded = true;
		});
	}

	const mapMarkerAPI = {
		highlight(itemId: string) {
			const monument = document.querySelector(`[data-marker-monument='${itemId}']`);

			if (monument && !monument.classList.contains('animate-bounce')) {
				monument.classList.add('animate-bounce');
			}
		},
		unhighlight(itemId: string) {
			const monument = document.querySelector(`[data-marker-monument='${itemId}']`);

			if (monument && monument.classList.contains('animate-bounce')) {
				monument.classList.remove('animate-bounce');
			}
		},
		unhighlightAll() {
			const monuments = document.querySelectorAll('[data-marker-monument]');

			for (const monument of monuments) {
				if (monument.classList.contains('animate-bounce')) {
					monument.classList.remove('animate-bounce');
				}
			}
		}
	};

	function setBounds(bounds: Bounds) {
		onMapLoad(() => {
			map.fitBounds(bounds, { animate: false });
		});
	}

	function setMonuments(monuments: Monument[]) {
		onMapLoad(() => {
			setMarkersFromMonuments(monuments);
		});
	}

	function addMonuments(monuments: Monument[]) {
		onMapLoad(() => {
			addMarkersFromMonuments(monuments);
		});
	}

	function setCenter(center: LngLatLike) {
		onMapLoad(() => {
			map.setCenter(center);
		});
	}

	function setZoom(zoom: number) {
		onMapLoad(() => {
			map.setZoom(zoom);
		});
	}

	mapExplorerContext.set({
		mapMarkerAPI: {
			highlight(itemId: string) {
				onMapLoad(() => {
					mapMarkerAPI.highlight(itemId);
				});
			},
			unhighlight(itemId: string) {
				onMapLoad(() => {
					mapMarkerAPI.unhighlight(itemId);
				});
			},
			unhighlightAll() {
				onMapLoad(mapMarkerAPI.unhighlightAll);
			}
		},
		setBounds,
		setMonuments,
		addMonuments,
		setCenter,
		setZoom,
		resetScroll() {
			explorerEl?.scrollTo(0, 0);
		}
	});

	function monumentToMarkerData(monument: Monument) {
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
	}

	function addMarkersFromMonuments(monuments: Monument[]) {
		if (!mapLibre || !Array.isArray(monuments)) return;
		mapLibre.addMarkers(monuments.map(monumentToMarkerData));
	}

	function setMarkersFromMonuments(monuments: Monument[]) {
		if (!mapLibre) return;
		if (!Array.isArray(monuments)) {
			mapLibre.setMarkers([]);
		} else {
			mapLibre.setMarkers(monuments.map(monumentToMarkerData));
		}
	}

	$: isLoadingData = !!$navigating;
</script>

<div class="flex flex-col-reverse lg:flex-row lg:overflow-hidden lg:max-h-screen">
	<div bind:this={explorerEl} class="flex-1 overflow-auto lg:max-w-[600px]">
		<div class="min-h-[80vh]">
			<header class="px-4 flex justify-between items-center py-2">
				<div class="py-2">
					<a href="/">
						<h1 class="text-xl text-red-600 font-bold flex items-center space-x-2">
							<img src="/favicon.png" alt="logo" class="size-6" />
							<span>Monument Maps</span>
						</h1>
					</a>
				</div>
				{#if $mapBounds}
					<a href={`/?bounds=${$mapBounds.join('~')}`}>
						<button
							class="group relative inline-flex h-8 text-sm items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-200 duration-500"
							disabled={isLoadingData}
							tabindex="-1"
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
					</a>
				{/if}
			</header>

			<main class="px-4">
				{#if isLoadingData}
					<div class="flex justify-center py-8">
						<LoadingIcon class="w-[3rem]" />
					</div>
				{:else}
					<slot />
				{/if}
			</main>
		</div>
		<footer class="mt-4 px-4 pt-4 pb-14 bg-gray-100">
			<nav>
				<div class="flex flex-col text-sm">
					<h2 class="text-base font-bold mt-4">Monument</h2>
					<div class="flex flex-col space-y-2 mt-2 text-sm">
						{#each footerLinks.monuments as monument}
							<a href={monument.href} class="text-blue-600 hover:text-blue-500 underline">
								<span>{monument.name}</span>
							</a>
						{/each}
					</div>
				</div>
				<div>
					<h2 class="text-base font-bold mt-4">City</h2>
					<div class="flex space-x-2 text-sm">
						{#each footerLinks.cities as city}
							<a href={city.href} class="text-blue-600 hover:text-blue-500 underline">
								<span>{city.name}</span>
							</a>
						{/each}
					</div>
				</div>
			</nav>
			<a
				href="https://github.com/matschik/monument-maps"
				aria-label="Go to Github repository"
				class="inline-block mt-4"
			>
				<svg
					class="size-5"
					aria-label="Github"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					focusable="false"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					></path>
				</svg>
			</a>
			<div class="mt-4 text-sm font-semibold">© Monument Maps 2024</div>
		</footer>
	</div>

	<aside class="flex-1">
		<MapLibre bind:this={mapLibre} bind:map bind:bounds={mapBounds} on:init={onMapInit} />
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
		animation: bounce 0.8s infinite;
	}
</style>
