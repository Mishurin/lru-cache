# lru-cache
JavaScript Implementation of LRU cache

## Usage
```javascript
import { cached } from './index.js';
class TestClass {
    @cached(5 /*cache size*/)
    fact(num) {
        if (num === 0) { return 1; }
        else { return num * this.fact(num - 1); }
    }
}
```

## Tests
```
npm test
```