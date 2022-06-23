/**
 * 计算地板，墙和机柜的布局
 */
import _ from 'lodash';
import { getHeightByUnum, getUImageByUbit } from './service/util';

// 构造墙体
export const buildWall = function(name, thick, startDot, endDot) {
    return {
        uuid: "",
        name: name,
        thick: thick,
        height: 240,
        skin: {
            skin_up: {
                skinColor: 0xdddddd,
            },
            skin_down: {
                skinColor: 0xdddddd,
            },
            skin_fore: {
                skinColor: 0xb0cee0,
            },
            skin_behind: {
                skinColor: 0xb0cee0,
            },
            skin_left: {
                skinColor: 0xdeeeee,
            },
            skin_right: {
                skinColor: 0xb0cee0,
            },
            opacity: 0.5
        },
        startDot: startDot,
        endDot: endDot
    }
}
// 构造静态地板墙体等绘图样式
export const buildFloorAndWall = function(floor_width, floor_length, wall_thick) {
    let floorObj = {
        show: true,
        uuid: "",
        name: 'floor',
        objType: 'floor',
        length: floor_length,
        width: floor_width,
        height: 10,
        rotation: [{ direction: 'x', degree: 0 }],//旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle] 
        x: 0,
        y: 0,
        z: 0,
        style: {
            skinColor: 0x8ac9e2,
            skin: {
                skin_up: {
                    skinColor: 0x98750f,
                    imgurl: "images/floor.jpg",
                    repeatx: true,
                    repeaty: true,
                    width: 3000,
                    height: 3000
                },
                skin_down: {
                    skinColor: 0x8ac9e2,
                },
                skin_fore: {
                    skinColor: 0x8ac9e2,
                }
            }
        }
    };

    let wallsObj = {
        show: true,
        uuid: "",
        name: 'wall',
        objType: 'wall',
        thick: wall_thick,
        length: 100,
        height: 240,
        wallData: [],
        style: {
            skinColor: 0xdddddd
        }
    };
    let wallList = [
        {
            name: 'wall-front',
            startDot: {
                x: floor_length / 2,
                y: 120,
                z: -(floor_width / 2 - wall_thick / 2)
            },
            endDot: {
                x: -floor_length / 2,
                y: 120,
                z: -(floor_width / 2 - wall_thick / 2)
            }
        }, {
            name: 'wall-behind',
            startDot: {
                x: floor_length / 2,
                y: 120,
                z: floor_width / 2 - wall_thick / 2
            },
            endDot: {
                x: -floor_length / 2,
                y: 120,
                z: floor_width / 2 - wall_thick / 2
            }
        }, {
            name: 'wall-left',
            startDot: {
                x: floor_length / 2 - wall_thick / 2,
                y: 120,
                z: floor_width / 2
            },
            endDot: {
                x: floor_length / 2 - wall_thick / 2,
                y: 120,
                z: -floor_width / 2
            }
        }, {
            name: 'wall-right',
            startDot: {
                x: -(floor_length / 2 - wall_thick / 2),
                y: 120,
                z: floor_width / 2
            },
            endDot: {
                x: -(floor_length / 2 - wall_thick / 2),
                y: 120,
                z: -floor_width / 2
            }
        }
    ];
    wallList.forEach(wall => {
        let wallObj = buildWall(wall.name, wall_thick, wall.startDot, wall.endDot);
        wallsObj.wallData.push(wallObj);
    });
    return [floorObj, wallsObj];
}


const cabinet = {
    show: true,
    name: '',
    shellname: '',
    isCabinet: true,
    uuid: '',
    objType: 'emptyCabinet',
    transparent: true,
    size: { length: 66, width: 70, height: 200, thick: 2 },
    position: { x: 0, y: 120, z: -0 },
    doors: {
        doorType: 'lr',// ud上下门 lr左右门 单门可以缺省
        doorSize: [1],
        doorname: ['cabinet1_1_door_01'],
        skins: [{
            skinColor: 0x333333,
            skin_fore: {
                imgurl: "images/rack_door_back.jpg",
            },
            skin_behind: {
                imgurl: "images/rack_front_door.jpg",
            }
        }]
    },
    skin: {
        skinColor: 0xff0000,
        skin_up: {
            skin: {
                skinColor: 0xff0000,
                skin_up: { imgurl: "images/rack_door_back.jpg" },
                skin_down: { imgurl: "images/rack_door_back.jpg" },
                skin_fore: {
                    skinColor: 0xff0000,
                    imgurl: "images/rack_door_back.jpg"
                },
                skin_behind: {
                    skinColor: 0xff0000,
                    imgurl: "images/rack_door_back.jpg"
                },
                skin_left: { imgurl: "images/rack_door_back.jpg" },
                skin_right: { imgurl: "images/rack_door_back.jpg" },
            }
        },
        skin_down: {
            skin: {
                skinColor: 0x333333,
            }
        },
        skin_left: {
            skin: {
                skinColor: 0x333333,
            }
        },
        skin_right: {
            skin: {
                skinColor: 0x333333,
            }
        },
        skin_behind: {
            skin: {
                skinColor: 0x333333,
            }
        }
    }
};
const serverData = {
    show: true,
    uuid: "",
    name: 'equipment_card_1',
    _name: 'server',
    isServer: true,
    objType: 'cube',
    length: 60,
    width: 65,
    height: 20,
    // x: -100,
    // y: 105,
    // z: -180,
    style: {
        skinColor: 0xffffff,
        skin: {
            skin_up: {
                skinColor: 0x9AC0CD,
            },
            skin_down: {
                skinColor: 0x9AC0CD,
            },
            skin_fore: {
                skinColor: 0x9AC0CD,
            },
            skin_behind: {
                skinColor: 0xff0000,
                imgurl: "images/server2.jpg",
            },
            skin_left: {
                skinColor: 0x9AC0CD,
            },
            skin_right: {
                skinColor: 0x9AC0CD,
            }
        }
    }
};
/**
 * 
 * @param {*} space 
 * @param {*} count 机房的行列布局数
 * @param {*} raskCount 机柜的行列数
 * @returns 
 */
export const calculatePosition = function(space, count, raskCount) {
    // count 为偶数正好两边均等分
    if (count % 2 === 0) {
        let middle = count / 2;
        if (raskCount > middle) {
            return -(raskCount - (middle + 1) + 0.5) * space;
        } else {
            return (middle - raskCount + 0.5) * space;
        }
    } else {
        let middle = Math.ceil(count / 2);
        if (raskCount === middle) {
            return 0;
        } else {
            let negative = raskCount > middle ? -1 : 1;
            return negative * ((raskCount - middle) * space);
        }
    }
};

// 计算第一行第一列的坐标位置
const calculateFirstPosition = (floor_width, floor_length) => {
    let x = floor_length / 2 - 100;
    let z = floor_width / 2 - 100;
    return {x, z};
}
// 
export const calculateRaskLayout = function(floor_width, floor_length, raskList) {
    // var row = layout.row, column = layout.column;
    // var rowWidth = (floor_width - 400) / row, colLength = (floor_length - 400) / column;
    var raskObjList = [];
    let firstCabinetPosition = calculateFirstPosition(floor_width, floor_length);
    _.forEach(raskList, rask => {
        let x = firstCabinetPosition.x - (rask.row - 1) * 280;
        let z = firstCabinetPosition.z - (rask.column - 1) * 100;
        let tempCabinet: any = _.cloneDeep(cabinet);
        let cabinetHeight = getHeightByUnum(rask.slots);
        let y = cabinetHeight / 2 + 10;
        tempCabinet = {
            ...tempCabinet,
            name: rask.name,
            shellname: `cabinet_${rask.id}`,
            id: rask.id,
            position: { x: x, y: y, z: z },
            scale: { x: 1, y: 1, z: 1 }
        };
        tempCabinet.size.height = cabinetHeight;
        tempCabinet.doors.doorname = [`cabinet_${rask.id}_door`];
        raskObjList.push(tempCabinet);
        if (rask.serverVoList && rask.serverVoList.length > 0) {
            _.forEach(rask.serverVoList, server => {
                let serverHeight = getHeightByUnum(server.serverHeight);
                let tempServer: any = _.cloneDeep(serverData);
                tempServer = {
                    ...tempServer,
                    cabinetId: rask.id,
                    name: `equipment_${server.id}`,
                    imgurl: getUImageByUbit(server.serverHeight),
                    state: server.state,
                    x: x, 
                    y: getHeightByUnum(server.slotPosition - 1) + 20, 
                    z: z,
                }
                tempServer.height = serverHeight;
                console.log(tempServer);
                // raskObjList.push({
                //     show: true,
                //     copyfrom: 'equipment_card_1',
                //     // name: 'equipment_card' + i,
                //     uuid: '',
                //     objType: 'cloneObj',
                //     name: server.name,
                //     position: { x: x, y: 50, z: z },
                //     // position: { x:-(i-1)*200, y: 50 , z:(j-1)*100 },
                //     scale: { x: 1, y: 1, z: 1 }
                // });
                raskObjList.push(tempServer);
            }); 
        }
    });
    return raskObjList;
}

