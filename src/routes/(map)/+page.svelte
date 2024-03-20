<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { PageData } from './$types';
	import { mapExplorerContext } from '$lib/MapExplorer.svelte';

	export let data: PageData;

	const mapExplorerCtx = mapExplorerContext.get();

	$: {
		mapExplorerCtx.mapMarkerAPI.unhighlightAll();
		mapExplorerCtx.resetScroll();
		mapExplorerCtx.setBounds(data.place.bounds);
		mapExplorerCtx.setMonuments(data.place.monuments);
	}
</script>

<svelte:head>
	<title>Monument Maps</title>
</svelte:head>

<MapExplorerMonumentList monuments={data.place.monuments} />
