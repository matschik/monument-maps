<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { PageData } from './$types';
	import { getContext } from 'svelte';

	export let data: PageData;

	const { getMapExplorer }: any = getContext('mapExplorerLayout');
	const mapExplorer = getMapExplorer();

	$: {
		mapExplorer.setBounds(data.city.bounds);
		mapExplorer.setMonuments(data.city.monuments);
	}
</script>

<svelte:head>
	<title>{data.city.title} - Monument Maps</title>
</svelte:head>

<MapExplorerMonumentList />
