const withMDX = require('@next/mdx')();
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withTM = require('next-transpile-modules')(['react-devicon']);

module.exports = withTM(withImages(withSass(withMDX({ 
    pageExtensions: ['js', 'jsx', 'md', 'mdx']  ,
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 2,
    },  
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 10000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 50      
    },  
    webpack: function(config) {
        config.module.rules.push({
          test: /\.md$/,
          use: 'raw-loader',
        });
        // config.module.rules.push({
        //   test: /\.svg$/,
        //   issuer: {
        //     test: /\.(js|ts)x?$/,
        //   },
        //   use: ['@svgr/webpack'],
        // });    
        // config.module.rules.push({
        //   test: /\.(png|jpe?g|gif|svg)$/i,
        //   loader: 'file-loader',
        //   options: {
        //     outputPath: 'images',
        //   },
        // });    
        config.module.rules.forEach(rule => {
          if (rule.toString().includes('.scss')) {
            rule.rules = rule.use.map(useRule => {
              if (typeof useRule === 'string') {
                return { loader: useRule };
              }
              if (useRule.loader === 'css-loader') {
                return {
                  oneOf: [
                    {
                      test: new RegExp('.global.scss$'),
                      loader: useRule.loader,
                      options: {},
                    },
                    {
                      loader: useRule.loader,
                      options: { modules: true }
                    },
                  ],
                };
              }
              return useRule;
            });
            delete rule.use;
          }
        });
        return config
      }    
}
))));
  
// var config = {
//   webpack: (config, { isServer }) => {
//     // Fixes npm packages that depend on `fs` module
//     if (!isServer) {
//       config.node = {
//         fs: 'empty'
//       }
//     }

//     return config
//   }
// }
