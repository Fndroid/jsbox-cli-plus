"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
function info(msg) {
    console.log(chalk_1.default.greenBright(`[INFO] ${msg}`));
}
exports.info = info;
function warn(msg) {
    console.log(chalk_1.default.yellowBright(`[WARN] ${msg}`));
}
exports.warn = warn;
function error(msg) {
    console.log(chalk_1.default.redBright(`[ERROR] ${msg}`));
}
exports.error = error;
