<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
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
