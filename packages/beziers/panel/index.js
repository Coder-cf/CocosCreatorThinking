// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
  template: `
    <h2>beziers</h2>
    <hr />
    <div>输入父节点名称: <ui-input id = "nodeName" value= Canvas ></ui-input></div>
    <hr />
    <div>输入父节点下索引: <ui-num-input id= "nodeIndex" value = 0></ui-num-input></div>
    <hr />
    <ui-button id="btn">Add it</ui-button>
    <ui-button id="remove">Remove it</ui-button>
  `,

  // element and variable binding
  $: {
    remove: '#remove',
    btn: '#btn',
    nodeName: '#nodeName',
    nodeIndex: '#nodeIndex',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$btn.addEventListener('confirm', () => {
      Editor.Scene.callSceneScript('beziers', 'addPrefab', function (err, length) {
       
      },this.$nodeName.value, this.$nodeIndex.value );
    });
    this.$remove.addEventListener('confirm', () => {
      Editor.Scene.callSceneScript('beziers', 'removePrefab', function (err, length) {
       
      },this.$nodeName.value);
    });
  },

  // register your ipc messages here
  messages: {
  }
});