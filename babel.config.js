module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@':'./src/',
          'screens':'./src/Screens/',
          'types': './src/Types',
          'header':'./src/ReusableComponent/Header',
        },
      },
    ]
  ]
};
