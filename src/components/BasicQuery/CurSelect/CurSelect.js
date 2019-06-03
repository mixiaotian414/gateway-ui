import React from 'react'
import PropTypes from 'prop-types'
import { Select,Form } from 'antd'
import { request } from 'utils'
import './CurSelect.less'
const FormItem = Form.Item;
import { arrayToSelectTree } from 'utils'
/**
 * @Title:基础查询组件》币种下拉框
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/2/2
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
class CurSelect extends React.Component {

  constructor (props) {
    super(props)
     const {
       fetchData={},
    } = props
    this.state = {
      queryData:[],
    }
  }
  componentDidMount () {
      this.fetch()
  }


  fetch = () => {
    this.promise = request({
      url:"/gateway/secdictselect.json",
      method: 'post',
      data: {
        appId:"1",
        dictCode:"CURRENCY"
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.dictList
      this.setState({
        queryData,
      })
    })
  }

  render () {
    const { getFieldDecorator} = this.props.form
    const { queryData } = this.state

    return (
      <FormItem label="币种">
        {getFieldDecorator('currId', { initialValue: "1" })(
          <Select placeholder="请选择" >
            {queryData && queryData.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}
          </Select>
        )}
      </FormItem>
    )
  }
}

CurSelect.propTypes = {
  form: PropTypes.object,
  fetchData: PropTypes.string,
}

export default CurSelect
