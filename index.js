export function cached(size, DEBUG = false) {

    const hashTable = new Map();
    const priorityQueue = new Map();

    return function (target) {

        const orig = target.descriptor.value;

        function decoratedFn() {

            const key = JSON.stringify(Array.from(arguments));
            const now = Date.now();

            if (hashTable.has(key)) {
                priorityQueue.set(key, now);
                return hashTable.get(key);
            }

            const result = orig.apply(this, arguments);

            if (hashTable.size === size) {

                let lruKey = null;
                let lruVal = Number.MAX_SAFE_INTEGER;

                for (let item of priorityQueue.entries()) {
                    if (item[1] < lruVal) {
                        lruKey = item[0];
                        lruVal = item[1];
                    }
                }

                priorityQueue.delete(lruKey);
                hashTable.delete(lruKey);
            }

            hashTable.set(key, result);
            priorityQueue.set(key, now);

            return result;
            
        }

        if (DEBUG) {
            decoratedFn.__debugHashTable__ = hashTable;
            decoratedFn.__priorityQueue__ = priorityQueue;
        }

        target.descriptor.value = decoratedFn;

    }
}
