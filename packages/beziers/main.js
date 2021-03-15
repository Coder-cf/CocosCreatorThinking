'use strict';
/*
    跑在主进程中

    
    初始化扩展包
    执行后台操作程序（文件I/O，服务器逻辑）
    调用 Cocos Creator 主进程中的方法
    管理扩展面板的开启和关闭，以及响应主菜单和其他面板发送来的 IPC 消息

*/
module.exports = {
  load () {
    // execute when package loaded
    Editor.log('beziers success');
  },

  // register your ipc messages here
  messages: {
    // 短命名消息
    'prepareAdd' () {
      // open entry panel registered in package.json
      Editor.Panel.open('beziers');
    }
  },
};