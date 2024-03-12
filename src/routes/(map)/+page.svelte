<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { Bounds } from '$lib/utils';
	import { getContext } from 'svelte';

	const { getMapExplorer }: any = getContext('mapExplorerLayout');

	const mapExplorer = getMapExplorer();
	const EUROPE_BOUNDS: Bounds = [
		-20.639164778062735, 31.292140930768284, 43.17877560026244, 59.83601007567944
	];
	mapExplorer.setBounds(EUROPE_BOUNDS);
	//mapExplorer.setMonuments([]);
</script>

<svelte:head>
	<title>Monument Maps</title>
</svelte:head>

<MapExplorerMonumentList />
