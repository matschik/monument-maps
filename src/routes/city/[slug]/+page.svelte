<script lang="ts">
	import type { PageData } from './$types';
	import MapExplorer from '$lib/MapExplorer.svelte';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.city.title} - Monument Maps</title>
</svelte:head>

<MapExplorer initialBounds={data.city.bounds} initialMonuments={data.city.monuments} />
