<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { PageData } from './$types';
	import { getContext, onDestroy } from 'svelte';

	export let data: PageData;

	const { getMapExplorer }: any = getContext('mapExplorerLayout');
	const mapExplorer = getMapExplorer();

	$: {
		mapExplorer.setBounds(data.place.bounds);
		mapExplorer.setMonuments(data.place.monuments);
	}
</script>

<svelte:head>
	<title>{data.place.title} - Monument Maps</title>
</svelte:head>

<MapExplorerMonumentList />
