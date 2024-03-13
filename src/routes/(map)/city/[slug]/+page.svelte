<script lang="ts">
	import MapExplorerMonumentList from '$lib/MapExplorerMonumentList.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.place.title} - Monument Maps</title>
</svelte:head>

<MapExplorerMonumentList monuments={data.place.monuments} />
