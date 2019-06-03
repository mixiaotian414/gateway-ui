import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Form } from 'antd'
import styles from './index.less'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class TestChartDemo extends Component {

    componentDidMount() {
        this.props.dispatch({
            type: 'testchartdemo/query',
        }).then(() => {
            const array = this.props.testchartdemo.demolist
            var AgeList = []
            var NameList = []
            array.map((item, index) => {
                if (item) {
                    AgeList.push(item.age)
                    NameList.push(item.name)
                }
            })
            var ChartBar = echarts.init(document.getElementById('bar'));
            var ChartLine = echarts.init(document.getElementById('line'));
            var ChartPie = echarts.init(document.getElementById('pie'));
            var a = AgeList
            var b = [15, 30, 88, 40, 20, 30]
            var c = NameList
            var d = '年龄'
            var e = 'TestList'
            ChartBar.setOption({
                title: { text: '图表Demo' },
                tooltip: {},
                xAxis: {
                    data: c
                },
                yAxis: {},
                series: [{
                    name: d,
                    type: 'bar',
                    data: a
                }, {
                    name: e,
                    type: 'bar',
                    data: b
                }]
            });
            ChartLine.setOption({
                tooltip: {},
                xAxis: {
                    data: c
                },
                yAxis: {},
                series: [{
                    name: d,
                    type: 'line',
                    data: a
                }, {
                    name: e,
                    type: 'line',
                    data: b
                }]
            });
            ChartPie.setOption({
                tooltip: {},
                series: [{
                    name: '来源',
                    type: 'pie',
                    radius: '55%',
                    data: [
                        { value: 555, name: 'AAA' },
                        { value: 666, name: 'BBB' },
                        { value: 777, name: 'CCC' },
                        { value: 888, name: 'DDD' },
                        { value: 999, name: 'EEE' }
                    ],
                }]
            });
        })
    }
    render() {
        return (
            <div className={styles.divbackground}>
                <Row>
                    <div id="bar" style={{ width: 1000, height: 500 }}></div>
                </Row>
                <Row>
                    <div id="line" style={{ width: 1000, height: 500 }}></div>
                </Row>
                <Row>
                    <div id="pie" style={{ width: 500, height: 500 }}></div>
                </Row>
            </div>

        );
    }
}

TestChartDemo.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ testchartdemo, loading }) => ({ testchartdemo, loading }))(Form.create()(TestChartDemo))
