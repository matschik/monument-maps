<script lang="ts">
	import type { PageData } from './$types';
	import { getContext, onDestroy } from 'svelte';

	export let data: PageData;

	const { getMapExplorer }: any = getContext('mapExplorerLayout');
	const mapExplorer = getMapExplorer();

	$: {
		mapExplorer.unhighlightAllMapMarkers();
		mapExplorer.setZoom(12);
		mapExplorer.setCenter({
			lat: data.monument.lat,
			lon: data.monument.lon
		});
		mapExplorer.addMonuments([data.monument]);
		mapExplorer.highlightMapMarker(data.monument.id);
	}

	onDestroy(() => {
		mapExplorer.unhighlightMapMarker(data.monument.id);
	});
</script>

<svelte:head>
	<title>{data.monument.name} - Monument Maps</title>
</svelte:head>

<div class="mt-6">
	<h2 class="text-center font-semibold text-lg">{data.monument.name}</h2>
	{#if data.monument.imageURL.trim()}
		<img src={data.monument.imageURL} alt="" class="mt-4 rounded" />
	{/if}
</div>
