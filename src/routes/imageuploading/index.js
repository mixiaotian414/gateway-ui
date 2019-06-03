import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { LocaleProvider, Form, Upload, Icon, message, Button, Divider, Modal, Row, Col, Input } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import reqwest from 'reqwest';

const FormItem = Form.Item;
const { TextArea } = Input;

class Imageuploading extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.state = {
      fileList: [],
      uploading: false,
      modalVisible: false,
    }
  }

  showModal() {
    this.setState({
      modalVisible: true
    })
  }

  handleCancel = (e) => {
    this.setState({
      modalVisible: false
    })
  }


  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    this.setState({
      uploading: true,
    });
    this.setState({
      loadingstatus: true
    })
    const imageAlias = this.props.form.getFieldValue("imageAlias");
    const imageExplain = this.props.form.getFieldValue("imageExplain");
    reqwest({
      url: '/media/api/upload?owner=100001' + '&imageAlias=' + imageAlias + '&imageExplain=' + imageExplain,
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('文件上传成功');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('文件上传失败');
      },
    });
  }

  render() {
    const { uploading, fileList } = this.state;
    const { getFieldDecorator, resetFields } = this.props.form;
    const Dragger = Upload.Dragger;
    const props = {
      multiple: false,
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    return (
      <LocaleProvider locale={zhCN}>
        <div className={styles.divbackground}>
          <Button type="primary" onClick={() => this.showModal()}>文件上传</Button>
          <Modal
            title={"文件上传"}
            visible={this.state.modalVisible}
            footer={false}
            onCancel={this.handleCancel}
            keyboard={false}
            maskClosable={false}
            width={800}
          >
            <Row>
              <Form layout="inline" style={{ textAlign: 'left' }}>
                <FormItem label="文件别名：" >
                  {getFieldDecorator('imageAlias', {
                  })(<Input placeholder="请输入" style={{ float: 'left' }} />)}
                </FormItem>
                <FormItem label="文件说明：" >
                  {getFieldDecorator('imageExplain', {
                  })(<TextArea autosize={{ minRows: 3, maxRows: 6 }} placeholder="请输入" style={{ width: '526px' }} />)}
                </FormItem>
              </Form>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到这里</p>
              </Dragger>
              <Divider />
              <Button
                type="primary"
                onClick={this.handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? '上传中...' : '开始上传'}
              </Button>
            </Row>
          </Modal>
        </div>
      </LocaleProvider>
    )
  }
}

Imageuploading.propTypes = {
  loading: PropTypes.object,
};

export default connect(({ imageuploading, loading, app }) => ({ imageuploading, loading, app }))(Form.create()(Imageuploading))
