import React, {Component} from 'react';
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col, Form, Button, Table, message, Modal, Input,Upload, Icon,Dropdown,Menu} from 'antd'
import reqwest from 'reqwest';
import {request} from 'utils'
import PropTypes from 'prop-types'

/**
 * @Title:上传下载列表DEMO
 * @Description:子组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/3/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input;


const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class FileList extends Component {
  state = {
    selectedRowKeys:[],
    fileList: [],
    uploading: false,
    filename:"",

  }

  render() {
    //父组件方法 可在props中取到
    const {LedgerType, pagination, changeModal,modalVisible,ids} = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const { uploading } = this.state;
    const formItemLayout1 = {
      labelCol: { span: 11 },
      wrapperCol: { span: 12 },
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }

    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        remove(e,record)
      } else {
        message.warning('等待开发')
      }
    }

    //列表表头
    const columns = [{
      title: '文件名称',
      dataIndex: "fileName",
      key: "fileName",
      width:'20%',
      align: 'left',
    },{
      title: '文件地址',
      dataIndex: "filePath",
      key: "filePath",
      width:'35%',
      //align: 'left',
    }, {
      title: '创建时间',
      dataIndex: "createTime",
      key: "createTime",
      width:'20%',
      //align: 'left',
    },{
      title: '操作',
      render: (text, record) =>{
        return (
          <Dropdown
            overlay={<Menu onClick={e => handleMenuClick(record, e)}>
              {/*<Menu.Item key='1'>删除</Menu.Item>*/}
              <Menu.Item key='2'>刷新</Menu.Item>
            </Menu>}
          >
            <Button style={{ border: 'none' }}>
              <Icon style={{ marginRight: 2 }} type="bars" />
              <Icon type="down" />
            </Button>
          </Dropdown>
        )
      }
    },];

    const uploadModalProps = {
      visible: modalVisible,
      maskClosable: false,
      title: "上传文件",
      wrapClassName: 'vertical-center-modal',
      width:"600px",
      onCancel:()=>{
        changeModal(false)
        this.setState({
          filename:null,
          fileList:[],
        })
        this.props.form.resetFields()
      },
    }


    /*上传文件属性*/
    const props = {
      action: '/gateway/uploadxmi.impt',
      accept:".xmi",
      showUploadList:false,//不显示上传列表
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
          filename:file.name,
        }));
        return false;
      },
      onChange:(e)=>{
        if(e.file.name !=='metadata.xmi'){
          message.error("请选择文件名称为metadata.xmi的文件进行上传")
          this.setState({
            filename:null,
            fileList:[],
          })
          this.props.form.resetFields()
        }

      },

      fileList: this.state.fileList,
    };
    /*/gateway/upload.impt*/
    //jsonplaceholder.typicode.com/posts/
    /*上传文件*/
    const handleUpload = () => {
      const { fileList } = this.state;
      const { form } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('files[]', file);
          formData.append('userId',this.props.app.user.userId);
        });
        this.setState({
          uploading: true,
        });
        reqwest({
          url: '/gateway/uploadxmi.impt',
          method: 'post',
          type:'impt',
          processData: false,
          contentType: false,
          data: formData,
          success:(resp) => {
            message.success('上传成功');
            this.setState({
              fileList: [],
              uploading: false,
            });
            changeModal(false)
            this.props.form.resetFields()
            this.props.dispatch({
              type: LedgerType+'/query',
            })
          },
          error: () => {
            this.setState({
              uploading: false,
            });
            message.error('上传失败,请重新选择');
            this.setState({
              filename:null,
              fileList:[],
            })
            this.props.form.resetFields()
          },
        })
      })

    }

    const onCancel =()=>{
      changeModal(false)
      this.setState({
        filename:null,
        fileList:[],
      })
      this.props.form.resetFields()
    }

    return (
      <div>
        <Row>
          <Col span={12}>
            <Form layout="inline">
              <FormItem >
                <Button  type="primary" onClick={e=>changeModal(true)}>
                  <Icon type="upload" /> 上传
                </Button>
              </FormItem>
              <FormItem >
                <Button  onClick={()=>{
                  this.props.dispatch({
                    type:LedgerType+'/LoadReport',
                    payload:{
                      //files:record
                    }
                  })
                }}>
                  <Icon type="download" /> 下载
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              //size="small"
              //rowSelection={rowSelection}
              style = {{ paddingTop:'10px' }}
              columns={columns}
              dataSource={this.props.list}
              scroll={{ y:350}}
              loading={this.props.loading.effects[LedgerType + '/query']}
              pagination={false}
            />

          </Col>
        </Row>
        <Modal {...uploadModalProps}
               footer={[
                 <Button onClick={onCancel}>取消</Button>,
                 <Button
                   className="upload-demo-start"
                   type="primary"
                   onClick={handleUpload}
                   disabled={this.state.fileList.length === 0}
                   loading={uploading}
                 >
                   {uploading ? '上传中..' : '确定' }
                 </Button>]}
        >
          <Row>

            <Col span={13}>
              <FormItem {...formItemLayout1} label="XMI文件">
                {getFieldDecorator('text', {
                  initialValue: this.state.filename,
                  rules: [
                    {
                      required: true,
                    },

                  ],
                })(<Input  placeholder="请选择文件" readOnly />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem>
                <Upload {...props} style={{marginLeft:'5px'}} >
                  <Button >
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

FileList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(FileList)


