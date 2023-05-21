"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/getRegisterMethod.ts
var getRegisterMethod_exports = {};
__export(getRegisterMethod_exports, {
  getSecretsVariables: () => getSecretsVariables
});
module.exports = __toCommonJS(getRegisterMethod_exports);
function getSecretsVariables(type) {
  const isMobile = type === "mobile";
  const client_id = isMobile ? process.env.GITHUB_CLIENT_ID_MOBILE : process.env.GITHUB_CLIENT_ID;
  const client_secret = isMobile ? process.env.GITHUB_CLIENT_SECRET_MOBILE : process.env.GITHUB_CLIENT_SECRET;
  return {
    client_id,
    client_secret
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSecretsVariables
});
