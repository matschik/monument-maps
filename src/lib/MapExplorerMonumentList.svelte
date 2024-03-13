<script lang="ts">
	import type { MapExplorerContext, Monument } from '$lib/types';
	import { getContext } from 'svelte';

	export let monuments: Monument[] = [];

	const { mapMarkerAPI } = getContext<MapExplorerContext>('mapExplorer');
</script>

<div>
	<div class="font-medium mt-2">
		{monuments.length} result{monuments.length > 1 ? 's' : ''}
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
		{#each monuments as monument}
			<a
				href={`/monument/${monument.id}`}
				on:mouseenter={() => mapMarkerAPI.highlight(monument.id)}
				on:mouseleave={() => mapMarkerAPI.unhighlight(monument.id)}
			>
				<div
					class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
				>
					<div class="flex-shrink-0">
						{#if monument.imageURL.trim()}
							<img class="size-10 rounded-lg bg-red-600" src={monument.imageURL} alt="" />
						{:else}
							<div
								class="bg-red-600 rounded-lg size-10 text-white flex justify-center items-center"
							>
								<img src="/favicon.png" alt="monument" width="15" height="15" class="size-5" />
							</div>
						{/if}
					</div>
					<div class="min-w-0 flex-1">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="text-sm font-medium text-gray-900">{monument.name}</p>
						<!-- {#if monument?.tags?.note}
							<p class="truncate text-sm text-gray-500">{monument.tags.note}</p>
						{/if} -->
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
