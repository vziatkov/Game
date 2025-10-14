# Utility Functions

This directory contains reusable utility functions for the project.

## Functions

### `minFreePipe`

A point-free (curried) version of `Math.min` for use in function composition and pipelines.

**Signature:**
```typescript
minFreePipe(threshold: number) => (value: number) => number
```

**Usage:**

```typescript
import { minFreePipe } from './utils';

// Basic usage - create a clamping function
const clampTo100 = minFreePipe(100);
clampTo100(150); // returns 100
clampTo100(50);  // returns 50

// In array transformations
const values = [25, 75, 120, 200, 50];
const clampedValues = values.map(minFreePipe(100));
// Result: [25, 75, 100, 100, 50]

// In function composition
const processValue = (value: number) => minFreePipe(100)(value * 2);
processValue(40);  // returns 80
processValue(60);  // returns 100
```

**Benefits:**
- **Curried**: Can be partially applied for reuse
- **Point-free**: Works well in function composition
- **Type-safe**: Full TypeScript support
- **Performant**: No overhead, just returns `Math.min`

**Use Cases:**
- Clamping values to a maximum
- Data validation and sanitization
- Array transformations
- Functional pipelines
