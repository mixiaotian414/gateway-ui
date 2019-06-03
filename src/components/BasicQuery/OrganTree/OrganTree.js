import React from 'react'
import PropTypes from 'prop-types'
import { TreeSelect,Form } from 'antd'
import { request } from 'utils'
import './OrganTree.less'
const FormItem = Form.Item;
import { arrayToSelectTree } from 'utils'
/**
 * @Title:基础查询组件》机构树
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/2/2
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
class OrganTree extends React.Component {

  constructor (props) {
    super(props)
     const {
       fetchData={},
    } = props
    this.state = {
      queryData:[],
      fetchData,
    }
  }
  componentDidMount () {
      this.fetch()
  }


  fetch = () => {
    const { fetchData } = this.state
    this.promise = request({
      url:"/api/v1/querySelectTree",
      method: 'get',
      data: {
        ...fetchData,
      },
    }).then((result) => {
      if (result.RESCODE!=='1') {
        return
      }
      const queryData = arrayToSelectTree(result.LIST, 'group_id', 'prt_group_id')
      this.setState({
        queryData,
      })
    })
  }

  render () {
    const { getFieldDecorator} = this.props.form
    const { queryData } = this.state

    return (
      <FormItem label="营业机构:">
      {getFieldDecorator('BANK_ORG_ID',{
      })
      (<TreeSelect
       /*   size="large"*/
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={queryData||[]}
          placeholder="请选择收款方所在组"
          treeDefaultExpandAll
        >
        </TreeSelect>
      )}
    </FormItem>)
  }
}

OrganTree.propTypes = {
  form: PropTypes.object,
  fetchData: PropTypes.string,
}

export default OrganTree
