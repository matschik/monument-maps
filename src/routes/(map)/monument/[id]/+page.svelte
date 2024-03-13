<script lang="ts">
	import type { PageData } from './$types';
	import { getContext } from 'svelte';
	import type { MapExplorerContext } from '$lib/types';

	export let data: PageData;

	const mapExplorerCtx = getContext<MapExplorerContext>('mapExplorer');

	$: {
		mapExplorerCtx.mapMarkerAPI.unhighlightAll();
		mapExplorerCtx.resetScroll();
		mapExplorerCtx.setZoom(12);
		mapExplorerCtx.setCenter([data.monument.lon, data.monument.lat]);
		mapExplorerCtx.addMonuments([data.monument]);
		mapExplorerCtx.mapMarkerAPI.highlight(data.monument.id);
	}
</script>

<svelte:head>
	<title>{data.monument.name} - Monument Maps</title>
</svelte:head>

<div class="mt-6">
	<h2 class="text-center font-semibold text-lg">{data.monument.name}</h2>
	{#if data.monument.imageURL.trim()}
		<div class="flex justify-center">
			<img src={data.monument.imageURL} alt="" class="mt-4 rounded max-h-lg" />
		</div>
	{/if}
</div>
