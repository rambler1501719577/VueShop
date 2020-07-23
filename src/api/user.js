var Mock = require('mockjs');
export function login(user) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          "username": Mock.mock('@first()'),
          "age": Mock.mock('@natural(1, 40)'),
          token: Mock.mock('@guid()')
        }
      });
    }, 1000);
  });
}
