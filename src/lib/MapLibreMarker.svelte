<script lang="ts">
	import LandmarkIcon from 'lucide-svelte/icons/landmark';
	export let monumentId: string;
</script>

<a href={`/monument/${monumentId}`}>
	<div
		class="arrow relative text-5 min-w-8 h-8 p-2 rounded flex items-center justify-center bg-red-600 text-white hover:-translate-y-1 transition"
		data-marker-monument={monumentId}
	>
		<LandmarkIcon class="size-5" />
	</div>
</a>

<style>
	.arrow::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid rgb(220 38 38);
	}
</style>
