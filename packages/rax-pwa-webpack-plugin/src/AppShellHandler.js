const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { createElement } = require('rax');
const renderer = require('rax-server-renderer');

const interopRequire = require('./res/interopRequire');
const getWebpackNodeConfig = require('./res/getWebpackNodeConfig');

class AppShellHandler {
  constructor(options) {
    this.options = options;
    this.tempShellFileName = 'tempShell';
    this.tempShellFilePath = path.resolve(this.options.pathConfig.appDirectory, '.temp', this.tempShellFileName + '.js');
  }

  build(callback) {
    const { pathConfig } = this.options;
    const webpackShellConfig = getWebpackNodeConfig(pathConfig);
    webpackShellConfig.entry[this.tempShellFileName] = pathConfig.appShell;
    webpack(webpackShellConfig).run(() => {
      callback();
    });
  }

  getContent() {
    const content = renderer.renderToString(
      createElement(interopRequire(eval(fs.readFileSync(this.tempShellFilePath, 'utf-8'))), {
        Component: () => createElement('div', { id: 'root-page' })
      })
    );
    return content;
  }
}

module.exports = AppShellHandler;
