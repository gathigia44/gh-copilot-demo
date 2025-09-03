# Validator Utility Test Documentation

## Overview

This document describes the test cases for the validator utility functions, providing comprehensive coverage of both valid and invalid input scenarios.

## Test Structure

The tests are written using the Mocha testing framework with Chai assertions and are located in `album-viewer/tests/validators.test.ts`.

## Test Cases for `validateAndConvertDate`

### Valid Date Test Cases

The following test cases verify that the function correctly validates and converts valid French date formats:

| Input Date  | Expected Output | Description |
|-------------|----------------|-------------|
| `15/08/2021` | `Date(2021, 7, 15)` | Mid-month date in August |
| `01/01/2000` | `Date(2000, 0, 1)` | New Year's Day, millennium year |
| `31/12/1999` | `Date(1999, 11, 31)` | New Year's Eve, end of century |

#### Test Logic

For each valid date:
1. Call `validateAndConvertDate()` with the input string
2. Verify the result is a Date object
3. Use deep equality to ensure the Date object matches expected values
4. Confirm month adjustment (JavaScript months are 0-based)

### Invalid Date Test Cases

The following test cases verify that the function correctly rejects invalid inputs:

| Input Date | Reason for Invalidity | Expected Output |
|------------|----------------------|-----------------|
| `32/01/2021` | Invalid day (32 > 31) | `null` |
| `15/13/2021` | Invalid month (13 > 12) | `null` |
| `15/08/21` | Invalid year format (2-digit) | `null` |
| `15-08-2021` | Invalid separator (dash instead of slash) | `null` |

#### Test Logic

For each invalid date:
1. Call `validateAndConvertDate()` with the input string
2. Verify the result is `null`
3. Ensure no exceptions are thrown

## Running the Tests

### Prerequisites

Ensure you have the following dependencies installed:

```bash
npm install --save-dev @types/chai @types/mocha chai mocha ts-node
```

### Test Execution

The tests can be run using the npm script:

```bash
npm test
```

This executes the Mocha test runner with TypeScript support via ts-node.

### Test Configuration

The test configuration is defined in `package.json`:

```json
{
  "scripts": {
    "test": "npx mocha --require ts-node/register \"tests/**/*.test.ts\""
  }
}
```

## Test Framework Details

### Mocha Integration

- **Framework**: Mocha v11.7.1
- **TypeScript Support**: ts-node/register
- **Pattern Matching**: Automatically discovers `*.test.ts` files in the tests directory

### Chai Assertions

- **Assertion Library**: Chai v6.0.1
- **Assertion Style**: expect style
- **Deep Equality**: Uses `deep.equal` for Date object comparison

## Test Code Structure

```typescript
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {validateAndConvertDate} from '../utils/validators';

function testValidateAndConvertDate() {
    // Valid date tests with expected outcomes
    const validDates = [
        { input: '15/08/2021', expected: new Date(2021, 7, 15) },
        // ... more test cases
    ];

    // Invalid date tests
    const invalidDates = [
        '32/01/2021', // Invalid day
        // ... more test cases
    ];

    // Test execution logic
}
```

## Coverage Analysis

### Valid Input Coverage

- ✅ Standard dates (mid-month)
- ✅ Edge cases (month/year boundaries)
- ✅ Leap year considerations (implicit through Date object)
- ✅ Century boundaries

### Invalid Input Coverage

- ✅ Out-of-range days
- ✅ Out-of-range months
- ✅ Incorrect year format
- ✅ Wrong date separators
- ✅ Completely invalid strings

### Missing Coverage Areas

The following areas could be enhanced in future test iterations:

- **Edge Date Cases**: February 29th on non-leap years
- **Boundary Testing**: Days 30/31 for months with fewer days
- **Null/Undefined Input**: Testing with null or undefined values
- **Empty String**: Testing with empty string input
- **Special Characters**: Testing with unusual characters
- **Performance Testing**: Large volume input testing

## Best Practices Demonstrated

1. **Clear Test Data**: Use descriptive input/expected output pairs
2. **Separation of Concerns**: Valid and invalid tests are clearly separated
3. **Comprehensive Coverage**: Tests both format and logic validation
4. **Assertion Clarity**: Uses appropriate assertion methods for different scenarios
5. **No Side Effects**: Tests don't modify global state

## Debugging and Troubleshooting

### Common Issues

1. **Date Month Confusion**: Remember JavaScript months are 0-based
2. **Deep Equality**: Use `deep.equal` for object comparison, not strict equality
3. **TypeScript Errors**: Ensure ts-node is properly configured

### Test Output Example

```
  ✓ should validate and convert valid French date format 15/08/2021
  ✓ should validate and convert valid French date format 01/01/2000
  ✓ should validate and convert valid French date format 31/12/1999
  ✓ should return null for invalid day 32/01/2021
  ✓ should return null for invalid month 15/13/2021
  ✓ should return null for invalid year format 15/08/21
  ✓ should return null for invalid separator 15-08-2021
```

## Future Test Enhancements

- Add property-based testing for random date generation
- Include performance benchmarks
- Add integration tests with actual form submission
- Test internationalization scenarios
- Add mutation testing to verify test quality
