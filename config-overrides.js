const { override, fixBabelImports } = require("customize-cra");
const addLessLoader = require("customize-cra-less-loader");

module.exports = override(
    // addDecoratorsLegacy(),//使用装饰器 //需要引入@babel/plugin-proposal-decorators依赖，next ts可以使用 react ts版本无法使用
    fixBabelImports("import", { libraryName: 'antd', style: true }),//style为true则表示使用未编译的less样式，这是可以定制主题色了
    addLessLoader({
    lessLoaderOptions: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#038fde',
        }
      }
    }
  })
);