<script lang="ts">
	import MapExplorer from '$lib/MapExplorer.svelte';
	import type { Monument } from '$lib/api';
	import { setContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	let mapExplorer: MapExplorer;
	let mapMonuments: Readable<Monument[]>;

	setContext('mapExplorerLayout', {
		getMapExplorer() {
			return mapExplorer;
		},
		getMapMonuments() {
			return mapMonuments;
		}
	});
</script>

<svelte:head>
	<title>Monument Maps</title>
</svelte:head>

<MapExplorer bind:this={mapExplorer} bind:mapMonuments>
	{#if mapExplorer}
		<slot />
	{/if}
</MapExplorer>
