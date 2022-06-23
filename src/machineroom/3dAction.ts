import * as THREE from 'three';
import * as TWEENClass from '@tweenjs/tween.js'
import { isExists } from './service/util';

import { msj3DObj } from './3dmr';

export const TWEEN = TWEENClass;

const openCloseDoor = (obj, x, y, z, info) => {
    var doorstate = "close";
    var tempobj = null;
    if (isExists(obj.doorState)) {
        doorstate = obj.doorState;
        tempobj = obj.parent;
    } else {
        console.log("add parent");
        var objparent = obj.parent;
        tempobj = new THREE.Object3D();
        tempobj.position.set(obj.position.x + x, obj.position.y + y, obj.position.z + z);
        obj.position.set(-x, -y, -z);
        tempobj.add(obj);
        objparent.add(tempobj);
    }

    obj.doorState = (doorstate === "close" ? "open" : "close");
    if (info === "left" || info === "right") {
        new TWEEN.Tween(tempobj.rotation).to({
            y: (doorstate === "close" ? 0.25 * 2 * Math.PI : 0 * 2 * Math.PI)
        }, 1000).start();
    } else if (info === "outin") {
        //沿点击的法向量移动
        // var intersects = this.raycaster.intersectObjects([obj]);
        // if (intersects.length > 0) {
        //     // 射线位置赋值给移动网格模型
        //     tempobj.position.copy(intersects[0].point);
        //     // 沿着法线方向平移移动的网格模型
        //     var normal = intersects[0].face.normal;// 当前位置曲面法线
        //     tempobj.translateOnAxis(normal,50); //平移50
        // }

        var targetPos = new THREE.Vector3(1, 0, 0);
        // var euler = new THREE.Euler( 1, 0,0);
        // var matrix = new THREE.Matrix4();  //创建一个4维矩阵
        // matrix.lookAt(obj.position.clone() , obj.position.clone() , targetPos) //设置朝向
        // matrix.multiply(new THREE.Matrix4().makeRotationFromEuler(euler))
        // var toRot = new THREE.Quaternion().setFromRotationMatrix(matrix) 
        // tempobj.translateOnAxis(toRot,50);
        if (obj.doorState === "close") {
            tempobj.translateOnAxis(targetPos, -obj.geometry.parameters.depth + 20);
        } else {
            tempobj.translateOnAxis(targetPos, obj.geometry.parameters.depth - 20);
        }
    }

}
/**
 * 机柜的门开关
 */
export const openCabinetDoor = (_obj, func) => {
    openCloseDoor(_obj, _obj.geometry.parameters.width / 2, 0, _obj.geometry.parameters.depth / 2, "right");
    func(_obj);
    // var doorstate = "close";
    // var tempobj = null;
    // if (_obj.doorState != null && typeof (_obj.doorState) != 'undefined') {
    //     doorstate = _obj.doorState;
    //     tempobj = _obj.parent;
    // } else {
    //     console.log("add parent", _obj.parent);
    //     var _objparent = _obj.parent;
    //     tempobj = new THREE.Object3D();
    //     tempobj.position.set(_obj.position.x, _obj.position.y, _obj.position.z + _obj.geometry.parameters.depth / 2);
    //     _obj.position.set(0, 0, -_obj.geometry.parameters.depth / 2);
    //     tempobj.add(_obj);
    //     _objparent.add(tempobj);
    // }
    // _obj.doorState = (doorstate === "close" ? "open" : "close");
    // new TWEEN.Tween(tempobj.rotation).to({
    //     y: (doorstate === "close" ? 0.25 * 2 * Math.PI : 0 * 2 * Math.PI)
    // }, 1000).start();
}

// 点击机柜内部的服务器的弹出
export const popServer = (_obj, func) => {
    var cardstate = "in";
    if (_obj.cardstate != null && typeof (_obj.cardstate) != 'undefined') {
        cardstate = _obj.cardstate;
    } else {
        _obj.cardstate = "out";
    }
    _obj.cardstate = (cardstate === "in" ? "out" : "in");
    new TWEEN.Tween(_obj.position).to({
        x: (cardstate === "in" ? _obj.position.x - 50 : _obj.position.x + 50),
    }, 1000).start();
}


/**
 * 跳转到指定机柜处
 * @param target 
 */
 export function flyToCabinet(targetObj, openDoor) {
    let SELECTED = targetObj
    // SELECTED = findTopObj('cabinet', SELECTED)
    
    let { scene, camera } = msj3DObj;
    let orbitControl = msj3DObj.controls;
    // if (openDoor) {
    //     const doorName = SELECTED.name + '&&' + 'cabinet_door'
    //     const selectedCabinetDoor = scene.getObjectByName(doorName) as any

    //     /**
    //      * 处于开门状态，那么就先关门再开门
    //      */
    //     if (selectedCabinetDoor.doorState === 'close' || !isExists(selectedCabinetDoor.doorState)) {
    //         openCabinetDoor(selectedCabinetDoor, () => { 

    //         })
    //     }
    // }

    /**
     * 让当前相机的位置指向选中的对象
     * 然后再慢慢微调相机的 x轴和y轴距离
     * 最终达到正好看到机柜的位置
     */

    const cameraTarget = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
    }

    const controlTarget = {
        x: orbitControl.target.x,
        y: orbitControl.target.y,
        z: orbitControl.target.z,
    }

    console.log(SELECTED);

    const elementTarget = {
        x: SELECTED.position.x,
        y: SELECTED.position.y,
        z: SELECTED.position.z,
    }

    const target = {
        x: SELECTED.position.x - 320,
        y: SELECTED.position.y + 80,
        z: SELECTED.position.z,
    }

    console.log(elementTarget);
    console.log(target);
    console.log(camera);

    /**
     * 让当前相机指向目标位置
     */
    new TWEEN.Tween(cameraTarget).to(target)
        .onUpdate(function (item) {
            camera.position.x = item.x;
            camera.position.y = item.y;
            camera.position.z = item.z;
        }).start();


    /**
     * 让当前控制器的目标指向选中的对象
     */
    new TWEEN.Tween(controlTarget).to(elementTarget)
        .onUpdate(function (item) {
            orbitControl.target.x = item.x
            orbitControl.target.y = item.y
            orbitControl.target.z = item.z
            orbitControl.update()
        }).start();
    // }).easing(TWEEN.Easing.Elastic.Out).start();

}