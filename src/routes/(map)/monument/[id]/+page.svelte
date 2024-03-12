<script lang="ts">
	import type { PageData } from './$types';
	import { getContext } from 'svelte';

	export let data: PageData;

	const { getMapExplorer }: any = getContext('mapExplorerLayout');
	const mapExplorer = getMapExplorer();

	$: {
		mapExplorer.setCenter({
			lat: data.monument.lat,
			lon: data.monument.lon
		});

		mapExplorer.setZoom(12);

		// todo: add monument marker
	}
</script>

<svelte:head>
	<title>{data.monument.name} - Monument Maps</title>
</svelte:head>

<div class="mt-6">
	<h2 class="text-center font-semibold text-lg">{data.monument.name}</h2>
	{#if data.monument.imageURL.trim()}
		<img src={data.monument.imageURL} alt="" class="mt-4 rounded" />
	{/if}
</div>
