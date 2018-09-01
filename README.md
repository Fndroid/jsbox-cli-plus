# jsbox-cli-plus

基于：[jsbox-cli](https://www.npmjs.com/package/jsbox-cli)

## 完善
1. 同步整个box里除.output外的所有文件
2. 支持同时开启[SocketLogger](https://www.npmjs.com/package/jsbox-logger)，参数--logger，开启后会自动向代码入口（.box的main.js）添加初始化代码，build时会自动删除