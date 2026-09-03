// Cache en memoria de proceso para los fact_* (datos casi estáticos: se
// cargan una vez por corrida del ETL, no en cada visita). Se prefiere a
// unstable_cache de Next porque su Data Cache tiene un tope duro de 2MB por
// entrada — el dataset de Observatorio del FET solo (~2.6MB serializado) ya
// lo supera, y eso hacía fallar el fetch entero (página vacía).
type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

export function cachedFetch<T>(key: string, ttlMs: number, fn: () => Promise<T>): () => Promise<T> {
  return async () => {
    const hit = store.get(key);
    if (hit && hit.expiresAt > Date.now()) {
      return hit.value as T;
    }

    const pending = inFlight.get(key);
    if (pending) return pending as Promise<T>;

    const promise = fn()
      .then((value) => {
        store.set(key, { value, expiresAt: Date.now() + ttlMs });
        return value;
      })
      .finally(() => {
        inFlight.delete(key);
      });
    inFlight.set(key, promise);
    return promise;
  };
}
