<script lang="ts">
	import MapExplorer from '$lib/MapExplorer.svelte';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
</script>

<svelte:head>
	<title>Monument Maps</title>
</svelte:head>

<MapExplorer initialData={data}>
	<slot />
</MapExplorer>
