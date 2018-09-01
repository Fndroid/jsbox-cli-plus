"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const os_1 = require("os");
exports.CONFIG_DIR = path_1.join(os_1.homedir(), '.config', 'jsbox');
exports.CONFIG_PATH = path_1.join(exports.CONFIG_DIR, 'config.json');
