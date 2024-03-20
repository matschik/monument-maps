<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { PageData } from './$houdini';
	import { mapExplorerContext } from '$lib/MapExplorer.svelte';
	import type { Bounds } from '$lib/types';
	import LoadingIcon from '$lib/LoadingIcon.svelte';

	export let data: PageData;

	$: ({ PlaceHome } = data);

	$: monuments = $PlaceHome.data?.monumentsInBounds.monuments;
	$: bounds = $PlaceHome.data?.monumentsInBounds.bounds;

	const mapExplorerCtx = mapExplorerContext.get();

	$: {
		if (monuments && bounds) {
			mapExplorerCtx.mapMarkerAPI.unhighlightAll();
			mapExplorerCtx.resetScroll();
			mapExplorerCtx.setBounds(bounds as Bounds);
			mapExplorerCtx.setMonuments(monuments);
		}
	}
</script>

<svelte:head>
	<title>Monument Maps</title>
</svelte:head>

{#if $PlaceHome.fetching}
	<div class="flex justify-center py-8">
		<LoadingIcon class="w-[3rem]" />
	</div>
{:else if monuments}
	<MapExplorerMonumentList {monuments} />
{/if}
