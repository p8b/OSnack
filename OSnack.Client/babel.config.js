module.exports = (api) => {
   api.cache(false);
   return {
      "presets": [
         ["@babel/env",
            {
               "targets": "> 0.25%",
               "corejs": "3.6.5",
               "useBuiltIns": "usage"
            }
         ],
         "@babel/preset-react",
         ["@babel/preset-typescript",
            {
               "allExtensions": true,
               "isTSX": true
            }
         ],

      ],
      "plugins": [
         "@babel/plugin-syntax-dynamic-import",
         "@babel/proposal-class-properties",
         "@babel/proposal-object-rest-spread"
      ]
   };
}