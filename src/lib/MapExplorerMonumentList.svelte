<script lang="ts">
	import LandmarkIcon from 'lucide-svelte/icons/landmark';
	import { getContext } from 'svelte';

	const { getMapExplorer, getMapMonuments }: any = getContext('mapExplorerLayout');
	const mapExplorer = getMapExplorer();
	const mapMonuments = getMapMonuments();
</script>

<div>
	<div class="font-medium mt-2">
		{$mapMonuments.length} result{$mapMonuments.length > 1 ? 's' : ''}
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
		{#each $mapMonuments as $mapMonument}
			<a
				href={`/monument/${$mapMonument.id}`}
				on:mouseenter={() => mapExplorer.highlightMapMarker($mapMonument.id)}
				on:mouseleave={() => mapExplorer.unhighlightMapMarker($mapMonument.id)}
			>
				<div
					class="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
				>
					<div class="flex-shrink-0">
						{#if $mapMonument.imageURL.trim()}
							<img class="size-10 rounded-full bg-red-700" src={$mapMonument.imageURL} alt="" />
						{:else}
							<div
								class="bg-red-700 rounded-full size-10 text-white flex justify-center items-center"
							>
								<LandmarkIcon width="15" height="15" class="size-5" />
							</div>
						{/if}
					</div>
					<div class="min-w-0 flex-1">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="text-sm font-medium text-gray-900">{$mapMonument.name}</p>
						<!-- {#if $mapMonument?.tags?.note}
							<p class="truncate text-sm text-gray-500">{$mapMonument.tags.note}</p>
						{/if} -->
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
