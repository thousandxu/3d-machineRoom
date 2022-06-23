import React from 'react';
import _ from 'lodash';
import { Button, Select } from 'antd';

import CabinetModal from './components/raskModal';
import ServerModal from './components/serverModal';
import './index.scss';

import { msj3D, msj3DObj } from './3dmr';
import { openCabinetDoor, popServer, flyToCabinet } from './3dAction';
import { buildFloorAndWall, calculateRaskLayout } from './layout';
import { calculateLayout } from './service/util';

import { raskList } from '../mock'; 


const Option = Select.Option;
interface IProps {

}
interface IState {
    showCabinetCanvas: boolean;
    cabinetModalVisible: boolean;
    nowCabinet: any;
    serverModalVisible: boolean;
    nowServer: any;
}
class MachineRoom extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            showCabinetCanvas: false,
            cabinetModalVisible: false,
            nowCabinet: {},
            serverModalVisible: false,
            nowServer: {}
        }
    }
    cabinetStyle: any = {};
    cabinetList: Array<any> = [];
    allObjects: any;
    initOption: any;

    componentDidMount() {
        let msjstation = new msj3D();
        let reactRef: any = this;
        let canvasDom = document.getElementById('canvas-frame');
        this.initOption = {
            antialias: true,
            showHelpGrid: false,
            clearCoolr: 0x225F93,
            divHeight: canvasDom.offsetHeight,
            divWidth: canvasDom.offsetWidth,
            reactRef: reactRef
        };
        let roomLayout = {row: 10, column: 10};
        let { width, length } = calculateLayout(roomLayout);
        let floorAndWall = buildFloorAndWall(length, width, 20);
        let raskThreeObjs = calculateRaskLayout(length, width, raskList);
        this.cabinetList = _.cloneDeep(raskThreeObjs);
        console.log(raskThreeObjs);
        let Aobjects: any = {
            objects: [
                ...floorAndWall,
                ...raskThreeObjs
            ],
            events: {
                click: [
                    {
                        findObject: function (_objname) {//查找某一类符合名称的对象
                            if (_objname.indexOf("cabinet") >= 0 && _objname.indexOf("door") >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        obj_uuid: "",
                        obj_event: (_obj) => {
                            this.showCabinetModal(_obj);
                            return openCabinetDoor(_obj, () => {});
                        }
                    }, 
                    {
                        findObject: function (_objname) {//查找某一类符合名称的对象
                            if (_objname.indexOf("cabinet") >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        obj_uuid: "",
                        obj_event: (_obj) => {
                            this.showCabinetModal(_obj);
                        }
                    },
                    {
                        findObject: function (_objname) {//查找某一类符合名称的对象
                            if (_objname.indexOf("equipment") >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        obj_uuid: "",
                        obj_event: (_obj) => {
                            this.showServerModal(_obj);
                            // console.log(_obj);
                            let visible = _obj.cardstate ? (_obj.cardstate === 'out' ? false : true) : true;
                            this.setState({ serverModalVisible: visible });
                            return popServer(_obj, () => {});
                        }
                    }
                ],
                dbclick: [
                    {
                        findObject: function (_objname) {//查找某一类符合名称的对象
                            if (_objname.indexOf("cabinet") >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        obj_uuid: "",
                        obj_event: (_obj) => {
                            this.showCabinetCanvas(_obj);
                        }
                    }
                ],
                mouseDown: {
                },
                mouseUp: {
                },
                mouseMove: {
                }
            },
        }
        this.allObjects = _.cloneDeep(Aobjects);
        //复制机柜
        // for (var i = 1; i <= 3; i++) {
        //     for (var j = 1; j <= 6; j++) {
        //         if (i !== 1 || j !== 1) {                    
        //             Aobjects.objects.push({
        //                 show: true,
        //                 isCabinet: true,
        //                 copyfrom: 'cabinet1_1',
        //                 name: 'cabinet' + i + '_' + j,
        //                 childrenname: ['cabinet' + i + '_' + j + '_shell', 'cabinet' + i + '_' + j + '_door_01'],
        //                 uuid: '',
        //                 objType: 'cloneObj',
        //                 position: { x: -(i - 1) * 450, y: 0, z: (j - 1) * 105 },
        //                 scale: { x: 1, y: 1, z: 1 }
        //             });
        //             Aobjects.objects.push({
        //                 show: true,
        //                 copyfrom: 'equipment_card_1',
        //                 name: 'equipment_card'+i+'_'+j,
        //                 uuid: '',
        //                 objType: 'cloneObj',
        //                 position: { x:-(i-1)*450, y: 50 , z:(j-1)*105 },
        //                 scale: { x: 1, y: 1, z: 1 }
        //             });
        //         }
        //     }
        // }
        // console.log(Aobjects.objects);
        msjstation.initmsj3D('canvas-frame', this.initOption, Aobjects);
        msjstation.start();
    }

    showCabinetModal = (mesh) => {
        let { cabinetModalVisible } = this.state;
        if (cabinetModalVisible) {
            this.setState({ cabinetModalVisible: false, nowCabinet: {} });
        } else {
            let cabinetId = mesh.name.split('_')[1];
            let cabinet = _.find(raskList, {id: parseInt(cabinetId)});
            console.log(mesh, cabinet);
            let {pageX, pageY} = msj3DObj.MouseEvent;
            this.cabinetStyle = {left: pageX + 10, top: pageY + 10};
            this.setState({
                cabinetModalVisible: true,
                nowCabinet: cabinet
            });
        }
    }
    showCabinetCanvas = (mesh) => {
        this.setState({
            showCabinetCanvas: true
        });
        let cabinetId = parseInt(mesh.name.split('_')[1]);
        let newCabinetThreeObjs = _.filter(this.cabinetList, item => {
            return item.id === cabinetId || item.cabinetId === cabinetId;
        });
        _.forEach(newCabinetThreeObjs, item => {
            item.doors && delete item.doors;
            if (item.position) {
                item.position.x = 0;
                item.position.y = 0;
                item.position.z = 0;
            } else {
                let cabinetHeight = _.find(this.cabinetList, {id: cabinetId}).size.height;
                item.x = 0;
                item.y = item.y - cabinetHeight/2 - 10;
                item.z = 0;
            }
        });
        console.log(newCabinetThreeObjs);
        let newObjs = {
            objects: [
                ...newCabinetThreeObjs
            ],
            events: {
                click: [
                    {
                        findObject: function (_objname) {//查找某一类符合名称的对象
                            if (_objname.indexOf("equipment") >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        obj_uuid: "",
                        obj_event: (_obj) => {
                            this.showServerModal(_obj);
                            let visible = _obj.cardstate ? (_obj.cardstate === 'out' ? false : true) : true;
                            this.setState({ serverModalVisible: visible });
                            return popServer(_obj, () => {});
                        }
                    }
                ],
                mouseDown: {
                },
                mouseUp: {
                },
                mouseMove: {
                }
            },
        }
        // let canvasDom = document.getElementById('cabinet-frame');
        // let initOption = {
        //     antialias: true,
        //     showHelpGrid: false,
        //     clearCoolr: 0x225F93,
        //     divHeight: canvasDom.offsetHeight,
        //     divWidth: canvasDom.offsetWidth,
        //     showSingleCabinet: true
        // };
        let msjstation = new msj3D();
        msjstation.initmsj3D('cabinet-frame', {...this.initOption, showSingleCabinet: true}, newObjs);
        msjstation.start();
    }
    hideCabinetCanvas = () => {
        this.setState({
            showCabinetCanvas: false
        }, () => {
            let msjstation = new msj3D();
            msjstation.initmsj3D('canvas-frame', this.initOption, this.allObjects);
            msjstation.start();
        });
    }
    showServerModal = (mesh) => {
        console.log(mesh);
    }
    hideCabinetModal = () => {
        this.setState({ cabinetModalVisible: false });
    }
    hideServerModal = () => {
        this.setState({ serverModalVisible: false });
    }

    focusCabinet = (cabinetId) => {
        let _this = msj3DObj;
        console.log(_this.objects);
        let target = _this.commonFunc.findObject(`cabinet_${cabinetId}`);
        // let target = _this.commonFunc.findObject(cabinetId);
        flyToCabinet(target, true);
        console.log(cabinetId, target);
    }

    render() {
        const { showCabinetCanvas, cabinetModalVisible, nowCabinet, serverModalVisible } = this.state;
        return(
            <div className="machine_room_warp">
                {
                    showCabinetCanvas ? <Button onClick={this.hideCabinetCanvas}>返回</Button> : null
                }
                <div className="search_cabinet_warp">
                    <Select style={{ width: '120px' }} showSearch onChange={this.focusCabinet}>
                        {
                            raskList.map(cabinet => <Option key={cabinet.id} value={cabinet.id}>{cabinet.name}</Option>)
                        }
                    </Select>
                </div>
                {
                    !showCabinetCanvas ? <div id="canvas-frame" className="canvas_frame"></div> : null
                }
                {
                    showCabinetCanvas ? <div id="cabinet-frame" className="cabinet_frame"></div> : null
                }
                <CabinetModal visible={cabinetModalVisible} cabinet={nowCabinet} onClose={this.hideCabinetModal} style={this.cabinetStyle}/>
                <ServerModal visible={serverModalVisible} server={{}} onClose={this.hideServerModal}/>
            </div>
        )
    }
    
}
export default MachineRoom;