import assert from 'assert';
import { cached } from './index.js';

const CACHE_SIZE = 5;

class TestClass {
    @cached(CACHE_SIZE, true)
    fact(num) {
        if (num === 0) { return 1; }
        else { return num * this.fact(num - 1); }
    }
}

function fact(num) {
    if (num === 0) { return 1; }
    else { return num * fact(num - 1); }
}

describe('LRU cache decorator', () => {

    let testInstance;

    beforeEach(() => {
        testInstance = new TestClass();
    });

    it('should get results from recently used cache', () => {
        for (let i = 1; i < 100; i++) {
            assert.equal(testInstance.fact(4), 24);
        }
        assert.equal(testInstance.fact.__debugHashTable__.size, CACHE_SIZE);
        assert.equal(testInstance.fact.__priorityQueue__.size, CACHE_SIZE);
        assert.deepEqual(Array.from(testInstance.fact.__debugHashTable__.values()), [1, 1, 2, 6, 24]);
        assert.deepEqual(Array.from(testInstance.fact.__debugHashTable__.keys()), ['[0]', '[1]', '[2]', '[3]', '[4]']);
        assert.deepEqual(Array.from(testInstance.fact.__priorityQueue__.keys()), ['[0]', '[1]', '[2]', '[3]', '[4]']);
    });

    it('should replace lru cache', () => {
        for (let i = 1; i < 10; i++) {
            assert.equal(testInstance.fact(i), fact(i));
        }
        assert.equal(testInstance.fact.__debugHashTable__.size, CACHE_SIZE);
        assert.equal(testInstance.fact.__priorityQueue__.size, CACHE_SIZE);
        assert.deepEqual(Array.from(testInstance.fact.__debugHashTable__.values()), [120, 720, 5040, 40320, 362880]);
        assert.deepEqual(Array.from(testInstance.fact.__debugHashTable__.keys()), ['[5]', '[6]', '[7]', '[8]', '[9]']);
        assert.deepEqual(Array.from(testInstance.fact.__priorityQueue__.keys()), ['[5]', '[6]', '[7]', '[8]', '[9]']);
    });
});