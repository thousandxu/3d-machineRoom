import _ from 'lodash';
import { CSG } from 'three-csg-ts'
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)

/**
 * 判断该对象是否存在
 * @param obj 
 */
 export function isExists(obj) {
    return ![undefined, null].includes(obj)
}

/**
 * 根据机房配置的行列数动态计算房间的大小
 */
export const calculateLayout = (layout) => {
    let { row, column } = layout;
    let width = row * 300;
    let length = column * 100 + 400;
    return { width, length };
}


/**
 * U 位操作
 * 1. 根据 U数 获取实际高度
 * 2. 根据 实际高度 获取 U数
 * 3. 根据 起始U位 获取当前的y轴位置
 * 4. 根据当前的y轴位置 获取起始 U位
 * 5. 根据起始U位和结束U位 来获取 U数
 * 6. 根据起始U位和结束U位 来计算实际高度
 */
const uUnit = 8;
export function getHeightByUnum(num, uUnitLength = uUnit) {
    if (uUnitLength) {
        return num * uUnitLength
    }
    return num * uUnit
}

export const getUImageByUbit = (uBit) => {
    let imageUrl = '/images/equipment/equipment_front-2U1.png'
    switch (uBit) {
        case 1: imageUrl = '/images/equipment/equipment_front-1U.png'; break;
        case 2: imageUrl = '/images/equipment/equipment_front-2U.png'; break;
        case 3: imageUrl = '/images/equipment/equipment_front-3U.png'; break;
        case 4: imageUrl = '/images/equipment/equipment_front-4U.png'; break;
        case 5: imageUrl = '/images/equipment/equipment_front-5U.png'; break;
        case 6: imageUrl = '/images/equipment/equipment_front-6U.png'; break;
        case 7: imageUrl = '/images/equipment/equipment_front-7U.png'; break;
        case 8: imageUrl = '/images/equipment/equipment_front-8U.png'; break;
        default: imageUrl = '/images/equipment/equipment_front-8U.png'; break;
    }
    return imageUrl
}

/**
 * 向上查找，找到最上层的该名称对象，找不到就返回`null`
 * @param name 
 * @param object 
 */
 export function findTopObj(name, object) {
    if (
        object.name.includes(name) &&
        object.parent.name === 'mainScene' &&
        object.userData &&
        object.userData.name &&
        object.userData.name.includes('JG')
    ) {
        return object
    } else if (object.parent) {
        return findTopObj(name, object.parent)
    }

    return null
}

/**
 * 合并模型，模型之间的 交集 并集 操作
 * @param mergeOp 
 * @param firstObj 
 * @param secondObj 
 * @param commonSkin 
 */
 export function mergeModel(mergeOp: any, firstObj: any, secondObj: THREE.Mesh<THREE.BoxGeometry, any[]>, commonSkin?: any): any {
    firstObj.updateMatrix()
    secondObj.updateMatrix()

    const firstObjBSP = CSG.fromMesh(firstObj)
    const secondObjBSP = CSG.fromMesh(secondObj)

    let resultObjBSP = null;
    switch (mergeOp) {
        case '-': 
            resultObjBSP = firstObjBSP.subtract(secondObjBSP)
            break;
        case '+': {
            // const subMesh = new THREE.Mesh(secondObj as any)
            secondObj.updateMatrix();
            firstObj.geometry.merge(secondObj.geometry, secondObj.matrix)
            firstObj.updateMatrix()
            return firstObj
        }
        case '&': 
            resultObjBSP = firstObjBSP.intersect(secondObjBSP)
            break;
        default: {
            // addObject(secondObj)
            return firstObj
        }
    }

    const result: any = CSG.toMesh(resultObjBSP, firstObj.matrix) // resultObjBSP.toMesh(cubeMaterialArray)
    result.material.flatShading = true
    result.geometry.computeFaceNormals()
    result.geometry.computeVertexNormals()
    result.uuid = firstObj.uuid + mergeOp + secondObj.uuid
    result.name = firstObj.name + mergeOp + secondObj.name
    result.material.needsUpdate = true
    result.geometry.bufferNeedUpdate = true
    result.geometry.uvsNeedUpdate = true
    result.material = firstObj.material


    /**
     * 循环处理 整合后的模型的面
     * 最终的结果的所有面 与 firstObj模型的所有面 和 secondObj模型的所有面的三维 x y z 进行比较
     * 如果有相同的就设置 最终结果的那一面的 颜色 以及 materialIndex
     */


    const [resultFaces, firstObjFace, secondObjFace] = [result.geometry.faces, firstObj.geometry.faces, secondObj.geometry.faces]
    resultFaces.forEach((resultFaceItem: { vertexNormals: any[]; color: { setHex: (arg0: any) => void }; materialIndex: number }, resultFaceIndex: any) => {
        let faceset = false

        firstObjFace.forEach((firstFaceItem: any, firstFaceIndex: any) => {
            // const {} = resultFaceItem.vertexNormals[0]
            /* resultFaceItem.vertexNormals == firstFaceItem.vertexNormals*/

            const faceset = resultFaceItem.vertexNormals.every((subItem: { x: any; y: any; z: any }, subIndex: string | number) => {
                return subItem.x === firstFaceItem.vertexNormals[subIndex].x &&
                    subItem.y === firstFaceItem.vertexNormals[subIndex].y &&
                    subItem.z === firstFaceItem.vertexNormals[subIndex].z
            })

            if (faceset) {
                resultFaceItem.color.setHex(commonSkin)
                resultFaceItem.materialIndex = firstFaceItem.materialIndex
            }
        })

        if (faceset === false) {
            secondObjFace.forEach((secondFaceItem, secondFaceIndex) => {
                // const {} = resultFaceItem.vertexNormals[0]
                /* resultFaceItem.vertexNormals == secondFaceItem.vertexNormals*/
                const faceset = resultFaceItem.vertexNormals.every((subItem: { x: number; y: number; z: number }, subIndex: string | number) => {
                    return subItem.x === secondFaceItem.vertexNormals[subIndex].x &&
                        subItem.y === secondFaceItem.vertexNormals[subIndex].y &&
                        subItem.z === secondFaceItem.vertexNormals[subIndex].z
                })

                if (faceset) {
                    resultFaceItem.color.setHex(commonSkin)
                    resultFaceItem.materialIndex = secondFaceItem.materialIndex
                }
            })
        }

        if (faceset === false) {
            resultFaceItem.color.setHex(commonSkin)
        }
    })

    result.castShadow = true
    result.receiveShadow = true

    return result
}
