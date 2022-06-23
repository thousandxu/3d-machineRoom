import React from "react";
import { Tabs, Progress } from 'antd';
import { option } from '../../mock/chart';
import Chart from '../../components/chart';

const { TabPane } = Tabs;
interface IProps {
    visible?: boolean;
    style?: any;
    server: any;
	onClose: () => void;
}

function ServerModal(props: IProps) {
    const { visible, style, server, onClose } = props;
    // display: visible ? 'block' : 'none'
    return (
        <div className="server_modal_warp" style={{ ...style, display: visible ? 'block' : 'none' }}>
			{/* <Icon type="close" onClick={onClose}/> */}
			<Tabs defaultActiveKey="1" size="small">
				<TabPane tab="基本信息" key="info">
					<div className="basic-info">
						<div className="content-item">
							<span className="content-name">状态：</span>
							<span className="content-value warning-value">异常</span>
						</div>
						<div className="content-item">
							<span className="content-name">集群名称：</span>
							<span className="content-value">集群A</span>
						</div>
						<div className="content-item">
							<span className="content-name">名称：</span>
							<span className="content-value">node-1</span>
						</div>
						<div className="content-item">
							<span className="content-name">位置编号：</span>
							<span className="content-value">12U</span>
						</div>
						<div className="content-item">
							<span className="content-name">上架时间：</span>
							<span className="content-value">2010-01-01</span>
						</div>
						<div className="content-item">
							<span className="content-name">型号：</span>
							<span className="content-value">IBM-3U</span>
						</div>
						<div className="content-item">
							<span className="content-name">供应商：</span>
							<span className="content-value">IBM</span>
						</div>
						<div className="content-item">
							<span className="content-name">负责人：</span>
							<span className="content-value">张三</span>
						</div>
						<div className="content-item">
							<span className="content-name">CPU：</span>
							<span className="content-value">16核</span>
						</div>
						<div className="content-item">
							<span className="content-name">内存：</span>
							<span className="content-value">16G</span>
						</div>
						<div className="content-item">
							<span className="content-name">磁盘：</span>
							<span className="content-value">1024G</span>
						</div>
						<div className="content-item">
							<span className="content-name">操作系统：</span>
							<span className="content-value">linux</span>
						</div>
						<div className="content-item">
							<span className="content-name">IP地址：</span>
							<span className="content-value">10.1.1.1</span>
						</div>
					</div>
					<h3 className="modal-title">正在运行服务</h3>
					<section className="running-apps">
						<span className="running-app">服务1</span>
						<span className="running-app">服务2</span>
						<span className="running-app">服务3</span>
						<span className="running-app">服务4</span>
						<span className="running-app">服务5</span>
						<span className="running-app">服务6</span>
					</section>
					<section className="unhandled-errors">
						<h3 className="modal-title">未处理告警</h3>
						<section className="section-content">
							<div className="error-content-item">
								<p className="error-content-text">服务器192.168.1.1 的CPU使用率在30分钟内大于90%</p>
								<p className="error-content-time">5分钟前</p>
								<div className="divider"></div>
							</div>
							<div className="error-content-item">
								<p className="error-content-text">服务器192.168.1.1 的CPU使用率在30分钟内大于90%</p>
								<p className="error-content-time">5分钟前</p>
								<div className="divider"></div>
							</div>
						</section>
					</section>
				</TabPane>
				<TabPane tab="图表信息" key="chart">
					<section className="resource-usage">
						<div className="section-content">
							<div><span>资源使用情况</span></div>
							<div className="resource-progress">
								<Progress width={80} type="circle" percent={75}/>
								<Progress width={80} type="circle" percent={75}/>
								<Progress width={80} type="circle" percent={75}/>
							</div>
						</div>
						<div className="section-content">
							<div><span>CPU使用率</span></div>
							<Chart option={option} height={140}/>
						</div>
						<div className="section-content">
							<div><span>内存使用率</span></div>
							<Chart option={option} height={140}/>
						</div>
						<div className="section-content">
							<div><span>磁盘使用率</span></div>
							<Chart option={option} height={140}/>
						</div>
					</section>
				</TabPane>
			</Tabs>
		</div>
    )
}
export default ServerModal;