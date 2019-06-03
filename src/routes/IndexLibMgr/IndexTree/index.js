import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import {   Form,     } from 'antd'
import { arrayToTree, queryArray } from 'utils'
import styles from './index.less'
import Filter from './components/StateFilter'
import { Page } from 'components'
import G6 from '@antv/g6';

/**
 * @title:指标管理
 * @author:mixiaotian
 * @time:2019/4/10
 * @Copyright: Copyright (c) 2018 .DHCC
 */



class IndexTree extends Component {
  state = {

  };
  componentDidMount=()=>{


    const data = {
      nodes: [{label: "请选择指标", id: "99999"}],
      edges: [ ]
    };

     this.work(data)


  }

  componentWillReceiveProps(props) {
    const {data}=props.IndexTree
   //console.log(data,"datas")

    if(JSON.stringify(data)!=='{}'){
      this.work(data)
    }

  }
 work=(data)=>{

    if(this.state.graph){
      this.state.graph.destroy()
    }
   var g = new dagre.graphlib.Graph();
   g.setDefaultEdgeLabel(function() {
     return {};
   });
   g.setGraph({
     rankdir: 'TB'
   });
   data.nodes.forEach(function(node) {
  /*   node.label = node.id;*/
     g.setNode(node.id, {
       width: 150,
       height: 50
     });
   });
   data.edges.forEach(function(edge) {
     g.setEdge(edge.source, edge.target);
   });
   dagre.layout(g);
   var coord = void 0;
   g.nodes().forEach(function(node, i) {
     coord = g.node(node);
     data.nodes[i].x = coord.x;
     data.nodes[i].y = coord.y;
   });
   g.edges().forEach(function(edge, i) {
     coord = g.edge(edge);
     data.edges[i].startPoint = coord.points[0];
     data.edges[i].endPoint = coord.points[coord.points.length - 1];
     data.edges[i].controlPoints = coord.points.slice(1, coord.points.length - 1);
   });
   G6.registerNode('operation', {
     drawShape: function drawShape(cfg, group) {
       var rect = group.addShape('rect', {
         attrs: {
           x: -75,
           y: -25,
           width: 150,
           height: 50,
           radius: 10,
           stroke: '#00C0A5',
           fill: '#92949F',
           fillOpacity: 0.45,
           lineWidth: 2
         }
       });
       return rect;
     }
   }, 'single-shape');

   const graph = new G6.Graph({
     container: 'mountNode',
     width: window.innerWidth-500,
     height: window.innerHeight-150,
     fitViewPadding:500,
     pixelRatio: 2,
     modes: {
       default: ['drag-canvas', 'zoom-canvas']
     },
     defaultNode: {
       shape: 'operation',

       labelCfg: {
         style: {
           fill: '#666',
           fontSize: 14,
           fontWeight: 'bold'
         }
       }
     },
     defaultEdge: {
       shape: 'polyline'
     },
     edgeStyle: {
       default: {
         endArrow: true,
         lineWidth: 2,
         stroke: '#ccc'
       }
     }
   });

   this.setState({
     graph
   })
   graph.data(data);
   graph.render();
   graph.fitView();
 }

  render () {

   //console.log(this.state.graph)
    const FormItem = Form.Item
    const { getFieldDecorator } = this.props.form
    const { IndexTree: { list, formValues,
      LedgerType, IndexTypeList=[]
    },dispatch,loading } = this.props

    const filerProps={
      /*索引参数*/
      LedgerType,
      loading,
      /*查询参数*/
      formValues,
      /*机构下拉树*/
      IndexTypeList,
      /*重置表单*/
      handleFormReset:()=>{
        dispatch({
          type: LedgerType+'/querySuccess',
          payload:{
            formValues:{
              page: 1,
              pageSize: 10
            },}
        });
      },
      /*查询表单*/
      toSubmit:(changefields)=>{
        this.setState({
          flag:false

        })
        dispatch({
            type: LedgerType+'/querySuccess',
            payload:{formValues: changefields,}
          }
        )
        dispatch({
          type:LedgerType+'/query',
          payload: changefields
        })
      }
    }

    return (
      <div className={styles.divbackground}>
        <Page inner>
          <Filter {...filerProps} />
          {/*     <List {...listProps} />
          {modalVisible && <CreateModel {...modalProps} />}*/}
         <div id="mountNode" style={{background: "-webkit-linear-gradient(top, transparent 40px, #bfbdbd 41px),-webkit-linear-gradient(left, transparent 40px,#bfbdbd 41px)",
           backgroundSize: "41px 41px",border:"solid 1px "
         }}></div>
        </Page>



      </div>
    )
  }
}

export default connect(({ IndexTree,  loading,dispatch  }) => ({ IndexTree,  loading,dispatch }))(Form.create()(IndexTree))
