import { writable, type Writable, get } from 'svelte/store';
import type { Bounds } from './types';
import { getContext, setContext } from 'svelte';

export function writableWithCallback<T>(
	initialValue: T,
	callback: (value: T) => void
): {
	subscribe: Writable<T>['subscribe'];
	set: (value: T) => void;
	update: Writable<T>['update'];
} {
	const writeStore = writable<T>(initialValue);
	const { subscribe, set: originalSet, update: originalUpdate } = writeStore;

	function set(value: T): void {
		originalSet(value);
		callback(get(writeStore));
	}

	function update(updater: (value: T) => T): void {
		originalUpdate(updater);
		callback(get(writeStore));
	}

	return {
		subscribe,
		set,
		update
	};
}

export function isWebglSupported() {
	if (window.WebGLRenderingContext) {
		const canvas = document.createElement('canvas');
		try {
			// Note that { failIfMajorPerformanceCaveat: true } can be passed as a second argument
			// to canvas.getContext(), causing the check to fail if hardware rendering is not available. See
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
			// for more details.
			const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
			if (context && typeof context.getParameter == 'function') {
				return true;
			}
		} catch (e) {
			// WebGL is supported, but disabled
		}
		return false;
	}
	// WebGL not supported
	return false;
}

interface ReactiveMap<K, V> {
	subscribe: Writable<Map<K, V>>['subscribe'];
	set: (key: K, value: V) => void;
	delete: (key: K) => void;
	clear: () => void;
	get: () => Map<K, V>;
	has: (key: K) => boolean;
}

export function reactiveMap<K, V>(initialValues: Array<[K, V]> = []): ReactiveMap<K, V> {
	const map = new Map<K, V>(initialValues);
	const { subscribe, set: originalSet } = writable<Map<K, V>>(new Map<K, V>(initialValues));

	return {
		subscribe,
		has(key: K) {
			return map.has(key);
		},
		set(key: K, value: V) {
			map.set(key, value);
			originalSet(new Map(map));
		},
		delete(key: K) {
			map.delete(key);
			originalSet(new Map(map));
		},
		clear() {
			map.clear();
			originalSet(new Map(map));
		},
		get() {
			return get({ subscribe });
		}
	};
}

export function isCoordinatesInBounds(coordinates: [number, number], bounds: Bounds) {
	const [swLong, swLat, neLong, neLat] = bounds;
	const [coordLong, coordLat] = coordinates;

	// Check if the coordinates' longitude is within the bounds
	const isLongInBounds = coordLong >= swLong && coordLong <= neLong;

	// Check if the coordinates' latitude is within the bounds
	const isLatInBounds = coordLat >= swLat && coordLat <= neLat;

	return isLongInBounds && isLatInBounds;
}

interface Context<T> {
	get: () => T;
	set: (ctx: T) => T;
}

export function createContext<T>(key: string): Context<T> {
	return {
		get: () => getContext<T>(key),
		set: (ctx: T) => setContext(key, ctx)
	};
}
