import { writable, type Writable, get } from 'svelte/store';

export function writableWithCallback<T>(
    initialValue: T,
    callback: (value: T) => void
): {
    subscribe: Writable<T>['subscribe'],
    set: (value: T) => void,
    update: Writable<T>['update']
} {
    const writeStore = writable<T>(initialValue);
    const { subscribe, set: originalSet, update: originalUpdate } = writeStore

    function set(value: T): void {
        originalSet(value);
        callback(get(writeStore))
    }

    function update(updater: (value: T) => T): void {
        originalUpdate(updater);
        callback(get(writeStore))
    }

    return {
        subscribe,
        set,
        update,
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
            return get({ subscribe })
        }
    };
}

type SouthWestLongitude = number;
type SouthWestLatitude = number;
type NorthEastLongitude = number;
type NorthEastLatitude = number;

export type Bounds = [
    SouthWestLongitude,
    SouthWestLatitude,
    NorthEastLongitude,
    NorthEastLatitude
];

export function useQuery<T>(queryFunction: () => Promise<T>): {
    isLoading: Writable<boolean>;
    error: Writable<Error | undefined>;
    data: Writable<T | undefined>;
    fetch: () => Promise<void>;
} {
    const data = writable<T | undefined>();
    const error = writable<Error | undefined>();
    const isLoading = writable<boolean>(false);

    async function fetchData() {
        isLoading.set(true);
        try {
            const responseData = await queryFunction();
            data.set(responseData);
            error.set(undefined);
        } catch (err) {
            data.set(undefined);
            error.set(err.message);
        }
        isLoading.set(false);
    }

    return { isLoading, error, data, fetch: fetchData };
}

