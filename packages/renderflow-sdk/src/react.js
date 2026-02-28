"use strict";
/**
 * React integration for Render Flow.
 * Call useRenderFlow() in a component to report when it renders (and optional file:line).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRenderFlow = useRenderFlow;
exports.reportRender = reportRender;
const react_1 = require("react");
const index_1 = require("./index");
const REACT_STACK_REGEX = /at (\w+)?\s*\(?\s*(\S+):(\d+):(\d+)/;
/**
 * Try to get file path and line from the current call stack.
 * Works when source maps or transpiled code preserve location.
 */
function getLocationFromStack() {
    try {
        const stack = new Error().stack ?? '';
        const lines = stack.split('\n');
        // Skip first lines (Error, getLocationFromStack, useRenderFlow, ...) and find first app file
        for (let i = 2; i < lines.length; i++) {
            const m = lines[i].match(REACT_STACK_REGEX);
            if (m) {
                const [, fn, file, line, col] = m;
                // Prefer relative path; strip webpack:// or similar
                let filePath = file
                    .replace(/^webpack:\/\/\//, '')
                    .replace(/^\.\//, '')
                    .replace(/\?.*$/, '');
                if (filePath.includes('node_modules'))
                    continue;
                return {
                    filePath,
                    line: parseInt(line, 10),
                    column: parseInt(col, 10),
                };
            }
        }
    }
    catch {
        // ignore
    }
    return null;
}
/**
 * Call this hook inside a React component to send a render event to Render Flow on each render.
 * If filePath/line are not provided, attempts to infer from the call stack (may not work in all bundlers).
 */
function useRenderFlow(options = {}) {
    const { filePath: optPath, line: optLine, functionName, kind } = options;
    const ref = (0, react_1.useRef)(0);
    ref.current += 1;
    (0, react_1.useEffect)(() => {
        const location = optPath != null && optLine != null
            ? { filePath: optPath, line: optLine, column: 0 }
            : getLocationFromStack();
        if (location) {
            const event = {
                filePath: location.filePath,
                line: location.line,
                column: location.column,
                functionName,
                kind: kind ?? 'render',
            };
            (0, index_1.sendEvent)(event);
        }
    });
}
/**
 * Report a custom render event (e.g. from a specific handler or manual instrumentation).
 */
function reportRender(event) {
    (0, index_1.sendEvent)(event);
}
//# sourceMappingURL=react.js.map