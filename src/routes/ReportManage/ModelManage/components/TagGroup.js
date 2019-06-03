import React,{Component} from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { Tag, Input, Tooltip, Icon, } from 'antd';

class EditableTagGroup extends React.Component {
  state = {
   /* tags: ['Unremovable', 'Tag 2', 'Tag 3'],*/
    inputVisible: false,
    inputValue: '',
  };

  handleClose = (e,removedTag) => {
    e.preventDefault();

    this.props.EditItem(removedTag)

    /*const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });*/

  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }
//暂时没用
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }
//暂时没用
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }
//暂时没用
  saveInputRef = input => this.input = input

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    return (
      <div style={{textAlign:"left"}}>
        {tags.map((tagObj, index) => {
          let tagname =tagObj.productName?tagObj.productName:"未定义"
          let tagcode=tagObj.productCode
          let tag=tagObj.productCode+'['+tagname+']'
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tagcode}
                closable={tags.length !== 1}
            /*   closable={true}*/
                 onClose={(e) => this.handleClose(e,tagcode)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}

EditableTagGroup.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default EditableTagGroup


