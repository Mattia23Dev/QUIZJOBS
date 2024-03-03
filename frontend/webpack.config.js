module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'source-map-loader',
              options: {
                filterSourceMappingUrl: (url, resourcePath) => {
                  // Ignora le URL dei file di mappa di Ant Design
                  if (/antd\/.*\.less/.test(resourcePath)) {
                    return false;
                  }
                  return true;
                },
              },
            },
          ],
        },
      ],
    },
  };