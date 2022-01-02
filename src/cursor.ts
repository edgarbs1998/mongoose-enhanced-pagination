import { Document, FilterQuery, Model, Query } from "mongoose";
import { get } from "object-path";

import { CursorOptions, PaginationQueryHelpers } from ".";
import { CursorParams, CursorResponse } from "./interface";
import { decode, encode } from "./utils/urlEncoding";

function processOptions(options: CursorOptions): CursorParams {
  let limit = options.limit ?? 1;
  if (limit < 1) limit = 1;

  // TODO Fix wrong pagination when sorting with a secondary field
  // const sortField = options.sort?.field ?? "_id";
  const sortField = "_id";
  const sortAscending = options.sort?.ascending ?? true;

  const next = options.next ? decode(options.next) : undefined;
  const previous = options.previous ? decode(options.previous) : undefined;

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

function generateFindQuery(params: CursorParams): FilterQuery<any> {
  if (!params.next && !params.previous) return {};

  const sortAscending =
    (!params.sort.ascending && params.previous) ||
    (params.sort.ascending && !params.previous);
  const compareOperation = sortAscending ? "$gt" : "$lt";

  // a `next` cursor will have precedence over a `previous` cursor.
  const cursor = (params.next ?? params.previous) as string[];

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
function generateSortQuery(params: CursorParams): any {
  const sortAscending =
    (!params.sort.ascending && params.previous) ||
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
function encodeCursor(doc: any, params: CursorParams): string {
  const hasSecondaryField = params.sort.field !== "_id";

  if (hasSecondaryField) {
    const cursorPaginatedField = get(doc, params.sort.field);

    return encode([cursorPaginatedField, doc._id]);
  }

  return encode([doc._id]);
}

function prepareResponse<T>(
  docs: T[],
  params: CursorParams
): CursorResponse<T> {
  const hasMore = docs.length > params.limit;
  // Remove the extra element that we added to 'peek' to see if there were more entries.
  if (hasMore) docs.pop();

  // If we sorted reverse to get the previous page, correct the sort order.
  if (params.previous) docs = docs.reverse();

  // Handle next cursor
  let next: string | undefined = undefined;
  const hasNext = !!params.previous || hasMore;
  if (hasNext) {
    next = encodeCursor(docs[docs.length - 1], params);
  }

  // Handle previous cursor
  let previous: string | undefined = undefined;
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

export function cursorPaginate<T>(
  this: Model<T, PaginationQueryHelpers<T>>,
  options: CursorOptions = { limit: 25 }
): Query<any, Document<T>> & PaginationQueryHelpers<T> {
  const params = processOptions(options);

  const findQuery = generateFindQuery(params);
  const sortQuery = generateSortQuery(params);

  const query = this.find(findQuery)
    .sort(sortQuery)
    .limit(params.limit + 1);

  // TODO Remove the following workaround when Mongoose add the Query#transform() function to the index.d.ts
  return (query as any).transform((docs: T[]) => {
    const response = prepareResponse(docs, params);
    return response;
  });
}
