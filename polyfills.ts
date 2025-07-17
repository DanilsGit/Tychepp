import structuredClone from "@ungap/structured-clone";

if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone =
    structuredClone as unknown as typeof globalThis.structuredClone;
}
