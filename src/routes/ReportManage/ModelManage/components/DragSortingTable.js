import React from 'react'
import { Table ,Icon} from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import styles from './DragSprtingTable.less'
import lodash from 'lodash'
/**
 * @Title:报表管理》模型创建》指标穿梭框》已选指标可拖拽Table展现组件
 * @Description:
 * @Author: mxt
 * @Time: 2018/4/19
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };

  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={styles[className]}
        style={style}
      />
    )
  );
};
const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};
const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

class DragSortingTable extends React.Component {
  state = {
/*    data: [],*/
  }
  components = {
    body: {
      row: BodyRow,
    },
  }
  componentDidMount() {

  }


  moveRow = (dragIndex, hoverIndex) => {
   /* const { data } = this.state;*/
    const { todrag,data } = this.props;
    const dragRow = data[dragIndex];

    /*this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
    , );*/

    const clonedata=lodash.cloneDeep(data)
    clonedata.splice(dragIndex,1)
    clonedata.splice(hoverIndex, 0, dragRow)

    todrag(clonedata)


  }

  render() {

    const columns = [{
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },{
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        return <Icon type="close-circle" style={{    cursor: 'pointer'}} onClick={e=>{
             this.props.todeleteKey(record.key)
        }}/>
      },
    }

    ];


    return (
      <div className={styles.dragTable}>
      <Table
        columns={columns}
        showHeader={false}
        dataSource={this.props.data}
        components={this.components}
        pagination={false}

        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
      />
      </div>
    );
  }
}
const Demo = DragDropContext(HTML5Backend)(DragSortingTable);
export default Demo
