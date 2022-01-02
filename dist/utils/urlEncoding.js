"use strict";
/**
 * These will take a JavaScript value (usually an object or array) and encode/decode as a URL-safe string.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
function encode(value) {
    const stringifiedValue = JSON.stringify(value);
    return Buffer.from(stringifiedValue).toString("base64");
}
exports.encode = encode;
function decode(value) {
    const decodedValue = Buffer.from(value, "base64").toString("ascii");
    return JSON.parse(decodedValue);
}
exports.decode = decode;
//# sourceMappingURL=urlEncoding.js.map