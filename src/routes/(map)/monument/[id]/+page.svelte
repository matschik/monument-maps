<script lang="ts">
	import LoadingIcon from '$lib/LoadingIcon.svelte';
	import { mapExplorerContext } from '$lib/MapExplorer.svelte';
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ MonumentById } = data);

	$: monument = $MonumentById.data?.monumentById;

	const mapExplorerCtx = mapExplorerContext.get();

	$: {
		if (monument) {
			mapExplorerCtx.mapMarkerAPI.unhighlightAll();
			mapExplorerCtx.resetScroll();
			mapExplorerCtx.setZoom(12);
			mapExplorerCtx.setCenter([monument.lon, monument.lat]);
			mapExplorerCtx.addMonuments([monument]);
			mapExplorerCtx.mapMarkerAPI.highlight(monument.id);
		}
	}
</script>

<svelte:head>
	{#if monument}
		<title>{monument.name} - Monument Maps</title>
	{/if}
</svelte:head>

{#if $MonumentById.fetching}
	<div class="flex justify-center py-8">
		<LoadingIcon class="w-[3rem]" />
	</div>
{:else if monument}
	<div class="mt-6">
		<h2 class="text-center font-semibold text-lg">{monument.name}</h2>
		{#if monument.imageURL?.trim()}
			<div class="flex justify-center">
				<img src={monument.imageURL} alt="" class="mt-4 rounded max-h-lg" />
			</div>
		{/if}
	</div>
{/if}
