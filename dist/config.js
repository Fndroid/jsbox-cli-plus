"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const fs = require("fs");
const chalk_1 = require("chalk");
const constant_1 = require("./constant");
if (!fs.existsSync(constant_1.CONFIG_DIR)) {
    fs.mkdirSync(constant_1.CONFIG_DIR);
}
if (!fs.statSync(constant_1.CONFIG_DIR).isDirectory()) {
    console.log(chalk_1.default.red(`[ERROR] ${constant_1.CONFIG_DIR} is not a directory`));
    process.exit(1);
}
const db = low(new FileSync(constant_1.CONFIG_PATH));
db.defaults({ host: '' }).write();
function setHost(host) {
    db.set('host', host).write();
}
exports.setHost = setHost;
function getHost() {
    return db.get('host').value();
}
exports.getHost = getHost;
