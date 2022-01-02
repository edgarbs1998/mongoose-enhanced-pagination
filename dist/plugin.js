"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseEnhancedPagination = void 0;
const cursor_1 = require("./cursor");
const offset_1 = require("./offset");
/**
 * The mongoose plugin
 * @param schema mongoose schema
 */
function mongooseEnhancedPagination(schema) {
    // Cursor pagination
    schema.static("cursorPaginate", cursor_1.cursorPaginate);
    schema.query["cursorPaginate"] = cursor_1.cursorPaginate;
    // Offset pagination
    schema.static("offsetPaginate", offset_1.offsetPaginate);
    schema.query["offsetPaginate"] = offset_1.offsetPaginate;
}
exports.mongooseEnhancedPagination = mongooseEnhancedPagination;
//# sourceMappingURL=plugin.js.map