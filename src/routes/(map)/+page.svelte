<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import { getContext } from 'svelte';
	import type { PageData } from './$types';
	import type { MapExplorerContext } from '$lib/types';

	export let data: PageData;

	const mapExplorerCtx = getContext<MapExplorerContext>('mapExplorer');

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
