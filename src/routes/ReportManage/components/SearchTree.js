import React from 'react'
import PropTypes from 'prop-types'
import {Tree, Input,Form } from 'antd'
import { request } from 'utils'
/**
 * @Title:报表管理》自定义指标列表》搜索树
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/5/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

/*const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    /!*console.log(tns,'tns')*!/
    return tns;

  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);
console.log(gData,'gData')
const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
generateList(gData);
console.log(dataList,'dataList')*/
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    value:undefined,
    treeData:[],
    dataList:[],
  }
  componentDidMount = () => {

    //目录树形
    this.fetch()
  }
  generateList = (data) => {
    let dataList=this.state.dataList
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      const title = node.title;
      dataList.push({ key, title});
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }/*
    console.log(dataList,"dataList")*/
    this.setState({
      dataList
    })
  };
  fetch = () => {
    this.promise = request({
      url:"/gateway/deriveproddirtree.json",
      method: 'post',
      data: {
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if (result.RSP_BODY) {

        const treeData =result.RSP_BODY.deriveProdList
        let treeString=JSON.stringify(treeData)
        let treeTrans=treeString.replace(/shortName/g,"title").replace(/code/g,"key")

        let treeDataJson= JSON.parse(treeTrans);
        this.generateList(treeDataJson)
        this.setState({
          treeData:treeDataJson
        })

      }

    })
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onChange = (e) => {
    const value = e.target.value;
    const treeData=this.state.treeData
    const dataList=this.state.dataList
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, treeData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }
  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data => data.length>0&&data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
    const onSelect =(selectedKeys, info)=>{
      this.setState({
        value:selectedKeys
      })
      triggerChange(selectedKeys)
    }
    const triggerChange = (changedValue) => {

      const onChange = this.props.onChange;
      if (changedValue.length>0){
        changedValue=changedValue[0]
      }else{
        changedValue=null
      }
      if (onChange) {
        onChange(changedValue);
      }
    }
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="请输入" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={onSelect}
        >
          {this.state.treeData.length>0?loop(this.state.treeData):null}
        </Tree>
      </div>
    );
  }
}


SearchTree.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(SearchTree)
