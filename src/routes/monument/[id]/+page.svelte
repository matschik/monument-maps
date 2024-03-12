<script lang="ts">
	import type { PageData } from './$types';
	import MapExplorer from '$lib/MapExplorer.svelte';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.monument.name} - Monument Maps</title>
</svelte:head>

<MapExplorer
	initialCenter={[data.monument.lon, data.monument.lat]}
	initialMonuments={[data.monument]}
	initialSelectedMonumentId={data.monument.id}
/>
