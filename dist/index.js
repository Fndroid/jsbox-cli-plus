"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const net = require("net");
const path = require("path");
const actions_1 = require("./actions");
const log = require("./log");
program
    .command('host')
    .description('Show your current host IP')
    .action(() => {
    actions_1.showHost();
});
program
    .command('set <hostIP>')
    .description('Set your host IP')
    .action((hostIP) => {
    if (!net.isIP(hostIP)) {
        log.error(`${hostIP} is not a valid IP`);
        process.exit(1);
    }
    actions_1.saveHost(hostIP);
});
program
    .command('watch [item]')
    .option('-l, --logger', 'Start a debug worker')
    .description('Watching change in a directory or file')
    .action((item, cmd) => {
    const pwd = process.cwd();
    if (!item) {
        item = '.';
    }
    item = path.resolve(pwd, item);
    actions_1.watch(item, cmd.logger);
});
program
    .command('build [dir]')
    .option('-o, --output <output>', 'Specify the output directory')
    .description('Build box package')
    .action((dir, cmd) => __awaiter(this, void 0, void 0, function* () {
    const pwd = process.cwd();
    dir = dir || '.';
    dir = path.resolve(pwd, dir);
    yield actions_1.build(dir, cmd.output);
}));
program.parse(process.argv);
