
import { ConsoleOutput, TestResult } from '../types';

// A simple and safe-ish way to execute code and capture console logs
export const executeCodeSafely = (code: string, onLog: (output: ConsoleOutput) => void) => {
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
    };

    const formatMessage = (args: any[]): string => {
        return args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return '[Circular Object]';
                }
            }
            return String(arg);
        }).join(' ');
    };

    console.log = (...args: any[]) => onLog({ type: 'log', message: formatMessage(args) });
    console.error = (...args: any[]) => onLog({ type: 'error', message: formatMessage(args) });
    console.warn = (...args: any[]) => onLog({ type: 'warn', message: formatMessage(args) });
    console.info = (...args: any[]) => onLog({ type: 'info', message: formatMessage(args) });

    try {
        // Using new Function() is generally safer than eval() as it doesn't have access to the local scope.
        const func = new Function(code);
        func();
    } catch (e: any) {
        console.error(e.message);
    } finally {
        // Restore original console methods
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
    }
};

export const executeTests = (userCode: string, tests: string[]): TestResult[] => {
    return tests.map(testExpression => {
        try {
            // We create a function that runs the user's code, then returns the result of the test expression.
            // Note: This is a basic implementation and might struggle with complex scopes or async code without further refinement.
            const testHarness = `
                ${userCode}
                try {
                    return ${testExpression};
                } catch(e) {
                    throw e;
                }
            `;
            const func = new Function(testHarness);
            const result = func();
            return {
                test: testExpression,
                passed: !!result
            };
        } catch (e: any) {
            return {
                test: testExpression,
                passed: false,
                error: e.message
            };
        }
    });
};
