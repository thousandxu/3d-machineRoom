import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import macarons from 'echarts/theme/macarons';
import 'echarts/map/js/world';
import 'echarts/map/js/china';
import 'echarts/map/js/province/anhui';
import 'echarts/map/js/province/aomen';
import 'echarts/map/js/province/beijing';
import 'echarts/map/js/province/chongqing';
import 'echarts/map/js/province/fujian';
import 'echarts/map/js/province/gansu';
import 'echarts/map/js/province/guangdong';
import 'echarts/map/js/province/guangxi';
import 'echarts/map/js/province/guizhou';
import 'echarts/map/js/province/hainan';
import 'echarts/map/js/province/hebei';
import 'echarts/map/js/province/heilongjiang';
import 'echarts/map/js/province/henan';
import 'echarts/map/js/province/hubei';
import 'echarts/map/js/province/hunan';
import 'echarts/map/js/province/jiangsu';
import 'echarts/map/js/province/jiangxi';
import 'echarts/map/js/province/jilin';
import 'echarts/map/js/province/liaoning';
import 'echarts/map/js/province/neimenggu';
import 'echarts/map/js/province/ningxia';
import 'echarts/map/js/province/qinghai';
import 'echarts/map/js/province/shandong';
import 'echarts/map/js/province/shanghai';
import 'echarts/map/js/province/shanxi';
import 'echarts/map/js/province/shanxi1';
import 'echarts/map/js/province/sichuan';
import 'echarts/map/js/province/taiwan';
import 'echarts/map/js/province/tianjin';
import 'echarts/map/js/province/xianggang';
import 'echarts/map/js/province/xinjiang';
import 'echarts/map/js/province/xizang';
import 'echarts/map/js/province/yunnan';
import 'echarts/map/js/province/zhejiang';
import 'echarts-liquidfill';    //水球图

export default class Chart extends Component {
    render() {
        return (
            // theme这边传个ReactEcharts不认识的string(没引或者压根儿没这个主题)进来就能取消原来macarons的主题了;这次改动主要是想在大屏那边能够取消echarts中图标的背景色
            <ReactEcharts option={this.props.option} style={{height: this.props.height || '100%', width: this.props.width||'100%',marginTop: this.props.marginTop|| ''}} onEvents={this.props.events ? this.props.events : null} theme={this.props.theme || 'macarons'} notMerge/>
        );
    }
}

Chart.propTypes = {
    option: PropTypes.object.isRequired,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    width: PropTypes.number,
    theme: PropTypes.string
};
