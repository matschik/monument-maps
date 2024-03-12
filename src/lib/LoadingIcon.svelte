<svg viewBox="0 0 132 58" version="1.1" xmlns="http://www.w3.org/2000/svg" {...$$restProps}>
	<circle class="dot" cx="25" cy="30" r="13"></circle>
	<circle class="dot" cx="65" cy="30" r="13"></circle>
	<circle class="dot" cx="105" cy="30" r="13"></circle>
</svg>

<style>
	.dot {
		fill: #a3a3a3;
		animation: load 1s infinite;
	}

	.dot:nth-of-type(2) {
		animation-delay: 0.2s;
	}

	.dot:nth-of-type(3) {
		animation-delay: 0.4s;
	}

	@keyframes load {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
