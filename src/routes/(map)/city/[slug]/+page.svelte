<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { PageData } from './$houdini';
	import { mapExplorerContext } from '$lib/MapExplorer.svelte';
	import { CityBySlugStore } from '$houdini';
	import LoadingIcon from '$lib/LoadingIcon.svelte';

	export let data: PageData;

	$: ({ CityBySlug } = data);

	$: place = $CityBySlug.data?.placeBySlug;
	$: monuments = $CityBySlug.data?.monumentsByPlaceSlug;

	const mapExplorerCtx = mapExplorerContext.get();

	$: {
		if (place && monuments) {
			mapExplorerCtx.mapMarkerAPI.unhighlightAll();
			mapExplorerCtx.resetScroll();
			mapExplorerCtx.setBounds([
				place.bounds[0],
				place.bounds[1],
				place.bounds[2],
				place.bounds[3]
			]);
			mapExplorerCtx.setMonuments(monuments);
		}
	}
</script>

<svelte:head>
	{#if place}
		<title>{place.title} - Monument Maps</title>
	{/if}
</svelte:head>

{#if $CityBySlug.fetching}
	<div class="flex justify-center py-8">
		<LoadingIcon class="w-[3rem]" />
	</div>
{:else if monuments}
	<MapExplorerMonumentList {monuments} />
{/if}
