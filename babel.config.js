module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module:react-native-dotenv',
          {
            moduleName: '@env', // Tên module bạn sẽ import
            path: '.env',       // Đường dẫn đến file .env
            safe: false,        // Nếu true, sẽ báo lỗi nếu biến không tồn tại
            allowUndefined: true, // Cho phép biến undefined
          },
        ],
      ],
    };
  };