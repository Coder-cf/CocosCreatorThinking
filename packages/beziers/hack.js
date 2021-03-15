module.exports = {
    'addPrefab': function (event, args, name, index) {
        let node = cc.find(name);
        if(node && node instanceof cc.Node){
           this.tempNodeName = name;
           const loader = cc.resources ? cc.resources: cc.loader
            loader.load({type: 'uuid', uuid:'cc1df48b-7ddc-46fe-9f3d-8c1381391dc1'}, function(err, prefab){
                if(err) {
                    cc.error('预制体加载失败');
                    return;
                }
                node.insertChild(cc.instantiate(prefab), index);
                Editor.Ipc.sendToPanel('scene', 'scene:stash-and-save');
            })
        } else {
            cc.error('未找到节点');
        }
    },

    'removePrefab': function (event, args, name) {
        cc.find(`${name}/BezierManager`).parent = null;
        Editor.Ipc.sendToPanel('scene', 'scene:stash-and-save');
    }
};