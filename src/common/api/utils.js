export function handleTree(data, id, parentId, children) {
    let config = {
      id: id || 'id',
      parentId: parentId || 'parentId',
      childrenList: children || 'children'
    };
  
    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];
  
    for (let d of data) {
      let parentId = d[config.parentId];
      if (childrenListMap[parentId] == null) {
        childrenListMap[parentId] = [];
      }
      nodeIds[d[config.id]] = d;
      childrenListMap[parentId].push(d);
    }
  
    for (let d of data) {
      let parentId = d[config.parentId];
      if (nodeIds[parentId] == null) {
        tree.push(d);
      }
    }
  
    for (let t of tree) {
      adaptToChildrenList(t);
    }
  
    function adaptToChildrenList(o) {
      if (childrenListMap[o[config.id]] !== null) {
        o[config.childrenList] = childrenListMap[o[config.id]];
      }
      if (o[config.childrenList]) {
        for (let c of o[config.childrenList]) {
          adaptToChildrenList(c);
        }
      }
    }
    return tree;
  }

  // 表单重置
export function resetForm(refName) {
    if (this.$refs[refName]) {
      this.$refs[refName].resetFields();
    }
  }