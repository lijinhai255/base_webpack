const add = {
  init() {
    $('#js-btn').click(function () {
      alert('京程一灯');
    });
    //react 事件库的原理 代理
    //$.on 代理 整个事件绑定到了document
  },
};
console.log('add组件');

export default add;
