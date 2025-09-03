import {describe, it} from 'mocha';
import {expect} from 'chai';
import {validateAndConvertDate} from '../utils/validators';

describe('Validator Utility Tests', () => {
    describe('validateAndConvertDate', () => {
        
        describe('Valid Dates', () => {
            const validDates = [
                { input: '15/08/2021', expected: new Date(2021, 7, 15), description: 'Mid-month date in August' },
                { input: '01/01/2000', expected: new Date(2000, 0, 1), description: 'New Year\'s Day, millennium year' },
                { input: '31/12/1999', expected: new Date(1999, 11, 31), description: 'New Year\'s Eve, end of century' },
            ];

            validDates.forEach(({ input, expected, description }) => {
                it(`should validate and convert ${input} (${description})`, () => {
                    const result = validateAndConvertDate(input);
                    expect(result).to.not.be.null;
                    expect(result).to.deep.equal(expected);
                });
            });
        });

        describe('Invalid Dates', () => {
            const invalidDates = [
                { input: '32/01/2021', reason: 'Invalid day (32 > 31)' },
                { input: '15/13/2021', reason: 'Invalid month (13 > 12)' },
                { input: '15/08/21', reason: 'Invalid year format (2-digit)' },
                { input: '15-08-2021', reason: 'Invalid separator (dash instead of slash)' },
                { input: '', reason: 'Empty string' },
                { input: 'not-a-date', reason: 'Completely invalid string' },
            ];

            invalidDates.forEach(({ input, reason }) => {
                it(`should return null for ${input || 'empty string'} (${reason})`, () => {
                    const result = validateAndConvertDate(input);
                    expect(result).to.be.null;
                });
            });
        });

        describe('Edge Cases', () => {
            it('should handle leap year dates correctly', () => {
                const leapYearDate = validateAndConvertDate('29/02/2020');
                expect(leapYearDate).to.not.be.null;
                expect(leapYearDate).to.deep.equal(new Date(2020, 1, 29));
            });

            it('should reject February 29th on non-leap years', () => {
                const nonLeapYearDate = validateAndConvertDate('29/02/2021');
                expect(nonLeapYearDate).to.be.null;
            });

            it('should reject day 31 for months with only 30 days', () => {
                const april31 = validateAndConvertDate('31/04/2021');
                expect(april31).to.be.null;
            });
        });
    });
});
