"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringIsInt = exports.stringIsNumber = void 0;
exports.stringIsNumber = (str) => !isNaN(str * 1);
exports.stringIsInt = (str) => exports.stringIsNumber(str) && !str.includes(".");
