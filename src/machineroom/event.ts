import * as THREE from 'three';
import _ from 'lodash';
import { msj3DObj } from './3dmr';
import { EventHandler1 } from './service/EventListen';

let clickCount = 0;
let clickTimer: any = undefined;
let hoverTimer: any = undefined;
const listen = EventHandler1.getEventListen();


/**
 * 获取目标对象集合
 * @param event 
 */
 export function getTargets (event) {
    let _this = msj3DObj;
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    _this.mouseClick.x = (event.offsetX / _this.domElement.offsetWidth) * 2 - 1;
    _this.mouseClick.y = -(event.offsetY / _this.domElement.offsetHeight) * 2 + 1;
    _this.raycaster.setFromCamera(_this.mouseClick, _this.camera);
    var intersects = _this.raycaster.intersectObjects(_this.scene.children, true);

    return intersects
}

/**
 * 获取目标对象
 * @param event 
 */
export function getTarget (event) {
    const intersects = getTargets(event)
    console.log(intersects);
    if (intersects.length > 0) {
        return intersects[0]
    }
    // console.warn('没有获取到任何目标对象', intersects)
}

const handleEvent = (eventList, SELECTED) => {
    _.forEach(eventList, function(_obj) {
        if ("string" == typeof (_obj.obj_name)) {
            if (_obj.obj_name === SELECTED.name) {
                _obj.obj_event(SELECTED);
            }
        } else if (_obj.findObject !== null|| 'function' === typeof (_obj.findObject)) {
            if (_obj.findObject(SELECTED.name)) {
                _obj.obj_event(SELECTED);
            }
        }
    });
}
/**
 * 事件：鼠标右键按下
 * @param event 
 */
export function onDocumentMouseDown(event) {
    let _this = msj3DObj;
    clickCount++;
    if (clickTimer) {
        clearTimeout(clickTimer)
    }
    clickTimer = setTimeout(() => {
        _this.raycaster.setFromCamera(_this.mouseClick, _this.camera);
        let intersects = _this.raycaster.intersectObjects(_this.objects);
        if (intersects.length > 0) {
            _this.MouseEvent = event;
            _this.controls.enabled = false;
            _this.SELECTED = intersects[0].object;
            switch (clickCount) {
                case 1: {
                    console.log('单击');
                    handleEvent(_this.eventList.click, _this.SELECTED);
                    break;
                }
                case 2: {
                    console.log('双击');
                    handleEvent(_this.eventList.dbclick, _this.SELECTED);
                    break;
                }
                default: 
                    break;
            }
            _this.controls.enabled = true;
        }
        clickCount = 0
    }, 16.8 * 15); // 在15帧内处理点击操作
    event.preventDefault();
}
// export function onDocumentMouseDown2(event) {
//     clickCount++;
//     if (clickTimer) {
//         clearTimeout(clickTimer)
//     }
//     clickTimer = setTimeout(() => {
//         let target = getTarget(event)
//         switch (clickCount) {
//             case 1: 
//                 listen.broadcasting('click', target, event);
//                 break;
//             case 2: 
//                 listen.broadcasting('dbclick', target, event)
//                 break;
//             case 3: 
//                 listen.broadcasting('threeclick', target,event)
//                 break;
//             default: 
//                 break;
//         }

//         clickCount = 0
//     }, 16.8 * 15); // 在15帧内处理点击操作
//     event.preventDefault();
// }

/**
 * 事件：鼠标悬浮
 */
export function onDocumentMouseMove(event) {
    event.preventDefault();
    var _this = msj3DObj;
    _this.mouseClick.x = (event.clientX / _this.width) * 2 - 1;
    _this.mouseClick.y = -(event.clientY / _this.height) * 2 + 1;
    _this.raycaster.setFromCamera(_this.mouseClick, _this.camera);

    // if (hoverTimer) {
    //     clearTimeout(hoverTimer)
    // }
    
    // hoverTimer = setTimeout(() => {
    //     let target = getTarget(event)
    //     listen.broadcasting('hover', target, event)
    // }, 16.8) // 在50帧内处理鼠标悬浮操作
}