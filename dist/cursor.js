"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorPaginate = void 0;
const object_path_1 = require("object-path");
const urlEncoding_1 = require("./utils/urlEncoding");
function processOptions(options) {
    var _a, _b, _c;
    let limit = (_a = options.limit) !== null && _a !== void 0 ? _a : 1;
    if (limit < 1)
        limit = 1;
    // TODO Fix wrong pagination when sorting with a secondary field
    // const sortField = options.sort?.field ?? "_id";
    const sortField = "_id";
    const sortAscending = (_c = (_b = options.sort) === null || _b === void 0 ? void 0 : _b.ascending) !== null && _c !== void 0 ? _c : true;
    const next = options.next ? (0, urlEncoding_1.decode)(options.next) : undefined;
    const previous = options.previous ? (0, urlEncoding_1.decode)(options.previous) : undefined;
    return {
        limit: limit,
        sort: {
            field: sortField,
            ascending: sortAscending,
        },
        next,
        previous,
    };
}
function generateFindQuery(params) {
    var _a;
    if (!params.next && !params.previous)
        return {};
    const sortAscending = (!params.sort.ascending && params.previous) ||
        (params.sort.ascending && !params.previous);
    const compareOperation = sortAscending ? "$gt" : "$lt";
    // a `next` cursor will have precedence over a `previous` cursor.
    const cursor = ((_a = params.next) !== null && _a !== void 0 ? _a : params.previous);
    const hasSecondaryField = params.sort.field !== "_id";
    if (hasSecondaryField) {
        return {
            $or: [
                { [params.sort.field]: { [compareOperation]: cursor[0] } },
                {
                    [params.sort.field]: { [compareOperation]: cursor[0] },
                    _id: { [compareOperation]: cursor[1] },
                },
            ],
        };
    }
    return {
        _id: {
            [compareOperation]: cursor[0],
        },
    };
}
// TODO Fix wrong pagination when sorting with a secondary field
function generateSortQuery(params) {
    const sortAscending = (!params.sort.ascending && params.previous) ||
        (params.sort.ascending && !params.previous);
    const sortDirection = sortAscending ? 1 : -1;
    const hasSecondaryField = params.sort.field !== "_id";
    if (hasSecondaryField) {
        return {
            [params.sort.field]: sortDirection,
            _id: sortDirection,
        };
    }
    return {
        _id: sortDirection,
    };
}
// TODO Set correct 'doc' type instead of any
function encodeCursor(doc, params) {
    const hasSecondaryField = params.sort.field !== "_id";
    if (hasSecondaryField) {
        const cursorPaginatedField = (0, object_path_1.get)(doc, params.sort.field);
        return (0, urlEncoding_1.encode)([cursorPaginatedField, doc._id]);
    }
    return (0, urlEncoding_1.encode)([doc._id]);
}
function prepareResponse(docs, params) {
    const hasMore = docs.length > params.limit;
    // Remove the extra element that we added to 'peek' to see if there were more entries.
    if (hasMore)
        docs.pop();
    // If we sorted reverse to get the previous page, correct the sort order.
    if (params.previous)
        docs = docs.reverse();
    // Handle next cursor
    let next = undefined;
    const hasNext = !!params.previous || hasMore;
    if (hasNext) {
        next = encodeCursor(docs[docs.length - 1], params);
    }
    // Handle previous cursor
    let previous = undefined;
    const hasPrevious = !!params.next || !!(params.previous && hasMore);
    if (hasPrevious) {
        previous = encodeCursor(docs[0], params);
    }
    return {
        data: docs,
        paging: {
            limit: params.limit,
            cursors: {
                next: next,
                previous: previous,
            },
        },
    };
}
function cursorPaginate(options = { limit: 25 }) {
    const params = processOptions(options);
    const findQuery = generateFindQuery(params);
    const sortQuery = generateSortQuery(params);
    const query = this.find(findQuery)
        .sort(sortQuery)
        .limit(params.limit + 1);
    // TODO Remove the following workaround when Mongoose add the Query#transform() function to the index.d.ts
    return query.transform((docs) => {
        const response = prepareResponse(docs, params);
        return response;
    });
}
exports.cursorPaginate = cursorPaginate;
//# sourceMappingURL=cursor.js.map