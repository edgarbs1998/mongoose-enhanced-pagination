/**
 * These will take a JavaScript value (usually an object or array) and encode/decode as a URL-safe string.
 */

export function encode(value: any): string {
  const stringifiedValue = JSON.stringify(value);
  return Buffer.from(stringifiedValue).toString("base64");
}

export function decode(value: string): any {
  const decodedValue = Buffer.from(value, "base64").toString("ascii");
  return JSON.parse(decodedValue);
}
