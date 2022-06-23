import _ from 'lodash';
import * as THREE from 'three';
import { TWEEN } from './3dAction';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSG } from 'three-csg-ts';

import { onDocumentMouseDown, onDocumentMouseMove } from './event';
const ThreeBSP = require('three-js-csg')(THREE);


function msj3D() {}
var msj3DObj = null;
msj3D.prototype.start = function () {
    //此处用于判断浏览器
    
    //开始
    var _this = this;
    msj3DObj = _this;
    _this.initScene();
    _this.initRender(_this.fId);
    _this.initCamera();
    _this.initHelpGrid();
    _this.initLight();
    // _this.addTestObj();
    //添加3D对象
    _.forEach(_this.objList, function (_obj) {
        _this.InitAddObject(_obj);
    });
    _this.initMouseCtrl();
    _this.animation();
}

/*
方法：初始化
fid 画布所属div的Id
option:参数 {
    antialias:true,//抗锯齿效果为设置有效
    clearCoolr:0xFFFFFF,
    showHelpGrid:false,//是否显示网格线
}
*/
msj3D.prototype.initmsj3D = function (_fId, _option, _datajson) {
    //参数处理
    this.option = {};
    this.option.antialias = _option.antialias || true;
    this.option.clearCoolr = _option.clearCoolr || 0x1b7ace;
    this.option.showHelpGrid = _option.showHelpGrid || false;
    this.option.divWidth = _option.divWidth || 800;
    this.option.divHeight = _option.divHeight || 600;
    this.option.sourcePath = _option.sourcePath || `/three/`;
    this.showSingleCabinet = _option.showSingleCabinet ? _option.showSingleCabinet : false;
    //对象
    this.fId = _fId;
    this.width = this.option.divWidth;
    this.height = this.option.divHeight;
    this.BASE_PATH = this.option.sourcePath;
    this.renderer = null; //渲染器
    this.camera = null; //摄像机
    this.scene = null; //场景
    this.SELECTED = null;
    this.objects = [];
    this.MouseEvent = null;
    this.mouseClick = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.controls = null;//鼠标控制器
    this.objList = _datajson.objects;//对象列表
    this.eventList = _datajson.events;//事件对象列表
    this.btns = _datajson.btns;//按钮列表
    // var _this = this;
}
//初始化渲染器
msj3D.prototype.initRender = function () {
    var _this = this;
    _this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: _this.option.antialias });
    _this.renderer.setSize(_this.width, _this.height);
    _this.domElement = document.getElementById(_this.fId);
    document.getElementById(_this.fId).append(_this.renderer.domElement);
    _this.renderer.setClearColor(_this.option.clearCoolr, 1.0);
    _this.renderer.shadowMap.enabled = true; //
    _this.renderer.shadowMapSoft = true;
    //事件
    _this.renderer.domElement.addEventListener('click', onDocumentMouseDown, false);
    _this.renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
}
//初始化摄像机
msj3D.prototype.initCamera = function () {
    var _this = this;
    _this.camera = new THREE.PerspectiveCamera(45, _this.domElement.offsetWidth / _this.domElement.offsetHeight, 1, 100000)
    _this.camera.name = 'mainCamera';
    if (_this.showSingleCabinet) {
        _this.camera.position.set(-300, 0, 0);
    } else {
        _this.camera.position.set(0, 1000, -1600)
    }
    _this.camera.up.x = 0;
    _this.camera.up.y = 1;
    _this.camera.up.z = 0;
    _this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    _this.objects.push(_this.camera);
    _this.scene.add(_this.camera)
}
//创建场景
msj3D.prototype.initScene=function() {
    var _this = this;
    _this.scene = new THREE.Scene();
    var axesHelper = new THREE.AxesHelper(20000);
    _this.scene.add(axesHelper)
}
//添加对象
msj3D.prototype.addObject = function (_obj) {
    var _this = msj3DObj;
    _this.objects.push(_obj);
    _this.scene.add(_obj);
}
//创建网格线
msj3D.prototype.initHelpGrid = function () {
    var _this = this;
    if (_this.option.showHelpGrid) {
        var helpGrid = new THREE.GridHelper(2000);
        _this.scene.add(helpGrid);
    }
}
//灯光布置
/**
 * AmbientLight: 环境光，基础光源，它的颜色会被加载到整个场景和所有对象的当前颜色上。
 * PointLight：点光源，朝着所有方向都发射光线
 * SpotLight ：聚光灯光源：类型台灯，天花板上的吊灯，手电筒等
 * DirectionalLight：方向光，又称无限光，从这个发出的光源可以看做是平行光.  
 */
msj3D.prototype.initLight = function () {
    var _this = this;
    var light = new THREE.AmbientLight(0xcccccc);
    light.position.set(0, 0,0);
    _this.scene.add(light);
    var light2 = new THREE.PointLight(0x555555);
    light2.shadow.camera.near =1;
    light2.shadow.camera.far = 5000;
    light2.position.set(0, 350, 0);
    // light2.castShadow = true; //表示这个光是可以产生阴影的
    _this.scene.add(light2);
}
//创建鼠标控制器
msj3D.prototype.initMouseCtrl=function() {
    var _this = this;
    _this.controls = new OrbitControls(_this.camera, _this.domElement);
    // _this.controls.minAzimuthAngle = -Math.PI * (100 / 180);
    // _this.controls.maxAzimuthAngle = Math.PI * (100 / 180);
    _this.controls.minPolarAngle = Math.PI/4; 
    _this.controls.maxPolarAngle = Math.PI/2; 
    _this.controls.addEventListener('change', _this.updateControls);
}
//控制器回调
msj3D.prototype.updateControls = function () {
    var _this = msj3DObj;
    // console.log('2', _this.controls);
    // console.log('3', _this.camera);
    // controls.update();
}
//循环渲染界面
msj3D.prototype.animation = function () {
    var _this = msj3DObj;
    if (TWEEN != null && typeof (TWEEN) != 'undefined') {
        TWEEN.update();
    }
    requestAnimationFrame(_this.animation);
    _this.renderer.render(_this.scene, _this.camera);
}

// 添加对象
msj3D.prototype.InitAddObject = function (_obj) {
    var _this = this;
    if (_obj.show === null || typeof (_obj.show) === 'undefined' || _obj.show) {
        var _tempObj = null;
        switch (_obj.objType) {
            case 'cube':
                _tempObj = _this.createCube(_this, _obj);
                _this.addObject(_tempObj);
                break;
            case 'floor':
                _tempObj = _this.CreateFloor(_obj)
                _this.addObject(_tempObj);
                break;
            case 'wall':
                _this.CreateWall(_this,_obj);
                break;
            case 'plane':
                _tempObj = _this.createPlaneGeometry(_this, _obj);
                _this.addObject(_tempObj);
                break;
            case 'glasses':
                _this.createGlasses(_this, _obj);
                break;
            case 'emptyCabinet':
                _tempObj = _this.createEmptyCabinet(_this, _obj);
                _this.addObject(_tempObj);
                _this.commonFunc.makeTextSprite(_obj.name);
                break;
            case 'cloneObj':
                _tempObj = _this.commonFunc.cloneObj(_obj.copyfrom, _obj);
                _this.addObject(_tempObj);
                break;
            default:
                break;
        }
    }
}

//创建盒子体
msj3D.prototype.createCube = function (_this, _obj) {
    if (_this === null) {
        _this = this;
    }
    
    const { length = 1000, width = length, height = 10 } = _obj;
    const { x = 0, y = 0, z = 0 } = _obj;
    const { skinColor = 0x98750f } = _obj.style || {};
    const cubeGeometry = new THREE.BoxGeometry(length, height, width, 0, 0, 1);
    const isError = _obj.isServer ? _obj.state !== 0 : false;

    cubeGeometry.faces.forEach((face, index, faces) => {
        // face.color.setHex(skinColor)
        var hex = skinColor || Math.random() * 0x531844;
        if (index % 2 === 0) {
            face.color.setHex(hex)
            faces[index + 1].color.setHex(hex)
        }
    });
    
    //六面纹理
    var skin_up_obj = {
        vertexColors: THREE.FaceColors
    }
    var skin_down_obj = skin_up_obj,
        skin_fore_obj = skin_up_obj,
        skin_behind_obj = skin_up_obj,
        skin_left_obj = skin_up_obj,
        skin_right_obj = skin_up_obj;
    var skin_opacity = 1;
    if (_obj.style != null && typeof (_obj.style) != 'undefined'
        && _obj.style.skin != null && typeof (_obj.style.skin) != 'undefined') {
        //透明度
        if (_obj.style.skin.opacity != null && typeof (_obj.style.skin.opacity) != 'undefined') {
            skin_opacity = _obj.style.skin.opacity;
        }
        //上
        skin_up_obj = _this.createSkinOptionOnj(_this, length, width, _obj.style.skin.skin_up, cubeGeometry, 4, skin_opacity, isError);
        //下
        skin_down_obj = _this.createSkinOptionOnj(_this, length, width, _obj.style.skin.skin_down, cubeGeometry, 6, skin_opacity, isError);
        //前
        skin_fore_obj = _this.createSkinOptionOnj(_this, length, width, _obj.style.skin.skin_fore, cubeGeometry, 0, skin_opacity, isError);
        //后
        skin_behind_obj = _this.createSkinOptionOnj(_this, length, width, _obj.style.skin.skin_behind, cubeGeometry, 2, skin_opacity, isError);
        //左
        skin_left_obj = _this.createSkinOptionOnj(_this, length, width, _obj.style.skin.skin_left, cubeGeometry, 8, skin_opacity, isError);
        //右
        skin_right_obj = _this.createSkinOptionOnj(_this, length, width, _obj.style.skin.skin_right, cubeGeometry, 10, skin_opacity, isError);
    }
    var cubeMaterialArray = [];
    cubeMaterialArray.push(new THREE.MeshLambertMaterial(skin_fore_obj));
    cubeMaterialArray.push(new THREE.MeshLambertMaterial(skin_behind_obj));
    cubeMaterialArray.push(new THREE.MeshLambertMaterial(skin_up_obj));
    cubeMaterialArray.push(new THREE.MeshLambertMaterial(skin_down_obj));
    cubeMaterialArray.push(new THREE.MeshLambertMaterial(skin_right_obj));
    cubeMaterialArray.push(new THREE.MeshLambertMaterial(skin_left_obj));

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterialArray);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.uuid = _obj.uuid;
    cube.name = _obj.name;
    cube.position.set(x, y, z);
    if (_obj.rotation != null && typeof (_obj.rotation) != 'undefined' && _obj.rotation.length > 0) {
        _.forEach(_obj.rotation, function (rotation_obj) {
            switch (rotation_obj.direction) {
                case 'x':
                    cube.rotateX(rotation_obj.degree);
                    break;
                case 'y':
                    cube.rotateY(rotation_obj.degree);
                    break;
                case 'z':
                    cube.rotateZ(rotation_obj.degree);
                    break;
                case 'arb':
                    cube.rotateOnAxis(new THREE.Vector3(rotation_obj.degree[0], rotation_obj.degree[1], rotation_obj.degree[2]), rotation_obj.degree[3]);
                    break;
                default:
                    break;
            }
        });
    }
    return cube;
}
//创建地板
msj3D.prototype.CreateFloor = function (_obj) {
    var _this = this;
    var _cube = _this.createCube(_this, _obj);
    return _cube;
}
//创建墙体
msj3D.prototype.CreateWall = function (_this, _obj) {
    if (_this === null) {
         _this = this;
    }
    var _commonThick = _obj.thick || 40;//墙体厚度
    var _commonLength = _obj.length || 100;//墙体厚度
    var _commonHeight = _obj.height || 300;//强体高度
    var _commonSkin = _obj.style.skinColor || 0x98750f;
    //建立墙面
    _.forEach(_obj.wallData, function (wallobj) {
        var wallLength = _commonLength;
        var wallWidth = wallobj.thick||_commonThick;
        var positionX = ((wallobj.startDot.x||0) + (wallobj.endDot.x||0)) / 2;
        var positionY = ((wallobj.startDot.y || 0) + (wallobj.endDot.y || 0)) / 2;
        var positionZ = ((wallobj.startDot.z || 0) + (wallobj.endDot.z || 0)) / 2;
        //z相同 表示x方向为长度
        if (wallobj.startDot.z === wallobj.endDot.z) {
            wallLength = Math.abs(wallobj.startDot.x - wallobj.endDot.x);
            wallWidth = wallobj.thick || _commonThick;
        } else if (wallobj.startDot.x === wallobj.endDot.x) {
            wallLength = wallobj.thick || _commonThick;
            wallWidth = Math.abs(wallobj.startDot.z - wallobj.endDot.z);
        }
        var cubeobj = {
            length: wallLength,
            width: wallWidth,
            height: wallobj.height || _commonHeight,
            rotation: wallobj.rotation,
            x: positionX,
            y: positionY,
            z: positionZ,
            uuid: wallobj.uuid,
            name:wallobj.name,
            style: {
                skinColor: _commonSkin,
                skin:wallobj.skin 
            }
        }
        var _cube = _this.createCube(_this, cubeobj);
        if (_this.commonFunc.hasObj(wallobj.childrens) && wallobj.childrens.length > 0) {
            _.forEach(wallobj.childrens, function (walchildobj) {
                var _newobj = null;
                _newobj = _this.CreateHole(_this, walchildobj);
                _cube = _this.mergeModel(_this, walchildobj.op, _cube, _newobj);
            });
        }
        _this.addObject(_cube);
    });
}
//创建皮肤
msj3D.prototype.createSkin = function (flength, fwidth, _obj) {
    let _this = this;
    let imgwidth = 128, imgheight = 128;
    if (_obj.width != null && typeof (_obj.width) != 'undefined') {
        imgwidth = _obj.width;
    }
    if (_obj.height != null && typeof (_obj.height) != 'undefined') {
        imgheight = _obj.height;
    }
    const texture = new THREE.TextureLoader().load(_this.BASE_PATH + _obj.imgurl);
    let _repeat = false;
    if (_obj.repeatx !== null && typeof (_obj.repeatx) != 'undefined' && _obj.repeatx === true) {
        texture.wrapS = THREE.RepeatWrapping;
        _repeat = true;
    }
    if (_obj.repeaty !== null && typeof (_obj.repeaty) != 'undefined' && _obj.repeaty === true) {
        texture.wrapT = THREE.RepeatWrapping;
        _repeat = true;
    }
    if (_repeat) {
        texture.repeat.set(flength / imgheight, fwidth / imgwidth);
    }
    return texture;
}
//创建皮肤参数对象
msj3D.prototype.createSkinOptionOnj = function (_this, flength, fwidth, _obj, _cube, _cubefacenub, opacity, isError) {
    const errorServer = isError ? { color: 0xff0000, opacity: 0.8 } : {};
    const opacityOption = opacity < 1 ? {transparent: true, opacity: 0.5} : {};

    if (_this.commonFunc.hasObj(_obj)) {
        if (_this.commonFunc.hasObj(_obj.imgurl)) {
            return {
                map: _this.createSkin(flength, fwidth, _obj), 
                transparent: true,
                opacity: opacity || 1,
                ...errorServer
            }
        } else {
            if (_this.commonFunc.hasObj(_obj.skinColor)) {
                _cube.faces[_cubefacenub].color.setHex(_obj.skinColor);
                _cube.faces[_cubefacenub + 1].color.setHex(_obj.skinColor);
            }
            return {
                vertexColors: THREE.FaceColors,
                ...opacityOption,
                ...errorServer
            }
        }
    } else {
        return {
            vertexColors: THREE.FaceColors,
            ...opacityOption,
            ...errorServer
        }
    }
}

//创建空柜子
msj3D.prototype.createEmptyCabinet = function (_this, _obj) {
    var isError = Math.random() <= 0.4;

    //上
    var upobj = {
        show: true,
        uuid: "",
        name: '',
        objType: 'cube',
        isError,
        length: _obj.size.length + 1,
        width: _obj.size.width,
        height: _obj.size.thick + 1,
        x: _obj.position.x + 1,
        y: _obj.position.y + (_obj.size.height / 2 - _obj.size.thick / 2),
        z: _obj.position.z,
        style: {
            skinColor: isError ? 0xff0000 : _obj.skin.skinColor,
            skin: _obj.skin.skin_up.skin
        }
    }
    
    var upcube = _this.createCube(_this, upobj);
    //左
    var leftobj = {
        show: true,
        uuid: "",
        name: '',
        objType: 'cube',
        isError,
        length: _obj.size.length,
        width: _obj.size.thick,
        height: _obj.size.height,
        x: 0,
        y: -(_obj.size.height / 2 - _obj.size.thick / 2),
        z: 0 - (_obj.size.width / 2 - _obj.size.thick / 2) - 1,
        style: {
            skinColor: isError ? 0xff0000 : _obj.skin.skinColor,
            skin: _obj.skin.skin_left.skin
        }
    }
    var leftcube = _this.createCube(_this, leftobj);

    var Cabinet = _this.mergeModel(_this, '+', upcube, leftcube);
    //右
    var Rightobj = {
        show: true,
        uuid: "",
        name: '',
        objType: 'cube',
        isError,
        length: _obj.size.length,
        width: _obj.size.thick,
        height: _obj.size.height,
        x: 0,
        y: -(_obj.size.height / 2 - _obj.size.thick / 2),
        z: (_obj.size.width / 2 - _obj.size.thick / 2) + 1,
        style: {
            skinColor: isError ? 0xff0000 : _obj.skin.skinColor,
            skin: _obj.skin.skin_right.skin
        }
    }
    var Rightcube = _this.createCube(_this, Rightobj);
    Cabinet = _this.mergeModel(_this, '+', Cabinet, Rightcube);
    //后
    var Behidobj = {
        show: true,
        uuid: "",
        name: '',
        objType: 'cube',
        isError,
        length: _obj.size.thick,
        width: _obj.size.width,
        height: _obj.size.height,
        x: (_obj.size.length / 2 - _obj.size.thick / 2) + 1,
        y: -(_obj.size.height / 2 - _obj.size.thick / 2),
        z: 0,
        style: {
            skinColor: isError ? 0xff0000 : _obj.skin.skinColor,
            skin: _obj.skin.skin_behind.skin
        }
    }
    var Behindcube = _this.createCube(_this, Behidobj);
    Cabinet = _this.mergeModel(_this, '+', Cabinet, Behindcube);
    //下
    var Downobj = {
        show: true,
        uuid: "",
        name: '',
        objType: 'cube',
        isError,
        length: _obj.size.length + 1,
        width: _obj.size.width,
        height: _obj.size.thick,
        x: -1,
        y: -(_obj.size.height - _obj.size.thick) - 1,
        z: 0,
        style: {
            skinColor: isError ? 0xff0000 : _obj.skin.skinColor,
            skin: _obj.skin.skin_down.skin
        }
    }
    var Downcube = _this.createCube(_this, Downobj);
    Cabinet = _this.mergeModel(_this, '+', Cabinet, Downcube);

    var tempobj = new THREE.Object3D();
    tempobj.add(Cabinet);
    tempobj.name = _obj.name;
    tempobj.uuid = _obj.uuid;
    Cabinet.name = _obj.shellname;
    Cabinet.isCabinet = true;
    _this.objects.push(Cabinet);
    
    tempobj.isCabinet = true;
    tempobj.isError = isError;
    //门
    if (_obj.doors != null && typeof (_obj.doors) != 'undefined') {
        var doors = _obj.doors;
        if (doors.skins.length === 1) {//单门
            var singledoorobj = {
                show: true,
                uuid: "",
                name: _obj.doors.doorname[0],
                objType: 'cube',
                // isError: isError,
                length: _obj.size.thick,
                width: _obj.size.width,
                height: _obj.size.height,
                x: _obj.position.x - _obj.size.length / 2 - _obj.size.thick / 2,
                y: _obj.position.y,
                z: _obj.position.z,
                style: {
                    // skinColor: isError ? 0xff0000 : _obj.doors.skins[0].skinColor,
                    skinColor: _obj.doors.skins[0].skinColor,
                    skin: _obj.doors.skins[0]
                }
            }
            var singledoorcube = _this.createCube(_this, singledoorobj);
            _this.objects.push(singledoorcube);
            tempobj.add(singledoorcube);
        }
    }

    if (_obj.rotation !== null && typeof (_obj.rotation) != 'undefined' && _obj.rotation.length > 0) {
        _.forEach(_obj.rotation, function(rotation_obj, index) {
            switch (rotation_obj.direction) {
                case 'x':
                    tempobj.rotateX(rotation_obj.degree);
                    break;
                case 'y':
                    tempobj.rotateY(rotation_obj.degree);
                    break;
                case 'z':
                    tempobj.rotateZ(rotation_obj.degree);
                    break;
                case 'arb':
                    tempobj.rotateOnAxis(new THREE.Vector3(rotation_obj.degree[0], rotation_obj.degree[1], rotation_obj.degree[2]), rotation_obj.degree[3]);
                    break;
                default: 
                    break;
            }
        });
    }
    return tempobj;
}
//模型合并 使用ThreeBSP插件mergeOP计算方式 -表示减去 +表示加上 
msj3D.prototype.mergeModel = function (_this, mergeOP, _fobj, _sobj) {
    if (_this == null) {
        _this = this;
    }

    var fobjBSP = new ThreeBSP(_fobj);
    var sobjBSP = new ThreeBSP(_sobj);
    // var sobjBSP = new ThreeBSP(_sobj);
    var resultBSP = null;
    if (mergeOP === '-') {
        resultBSP = fobjBSP.subtract(sobjBSP);

    } else if (mergeOP === '+') {
        var subMesh = new THREE.Mesh(_sobj);
        _sobj.updateMatrix();
        _fobj.geometry.merge(_sobj.geometry, _sobj.matrix);
        return _fobj;
        // resultBSP = fobjBSP.union(sobjBSP);
    } else if (mergeOP === '&') {//交集
        resultBSP = fobjBSP.intersect(sobjBSP);
    } else {
        _this.addObject(_sobj);
        return _fobj;
    }
    var cubeMaterialArray = [];
    for (var i = 0; i < 1; i++) {
        cubeMaterialArray.push(new THREE.MeshLambertMaterial({
            //map: _this.createSkin(128, 128, { imgurl: '../datacenterdemo/res2/'+(i%11)+'.jpg' }),
            vertexColors: THREE.FaceColors
        }));
    }
    var cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
    var result = resultBSP.toMesh(cubeMaterials);
    result.material.shading = THREE.FlatShading;
    result.geometry.computeFaceNormals();
    result.geometry.computeVertexNormals();
    result.uuid = _fobj.uuid + mergeOP + _sobj.uuid;
    result.name = _fobj.name + mergeOP + _sobj.name;
    result.material.needsUpdate = true;
    result.geometry.buffersNeedUpdate = true;
    result.geometry.uvsNeedUpdate = true;
    var _foreFaceSkin = null;
    for (var i = 0; i < result.geometry.faces.length; i++) {
        var _faceset = false;
        for (var j = 0; j < _fobj.geometry.faces.length; j++) {
            if (result.geometry.faces[i].vertexNormals[0].x === _fobj.geometry.faces[j].vertexNormals[0].x
                && result.geometry.faces[i].vertexNormals[0].y === _fobj.geometry.faces[j].vertexNormals[0].y
                && result.geometry.faces[i].vertexNormals[0].z === _fobj.geometry.faces[j].vertexNormals[0].z
                && result.geometry.faces[i].vertexNormals[1].x === _fobj.geometry.faces[j].vertexNormals[1].x
                && result.geometry.faces[i].vertexNormals[1].y === _fobj.geometry.faces[j].vertexNormals[1].y
                && result.geometry.faces[i].vertexNormals[1].z === _fobj.geometry.faces[j].vertexNormals[1].z
                && result.geometry.faces[i].vertexNormals[2].x === _fobj.geometry.faces[j].vertexNormals[2].x
                && result.geometry.faces[i].vertexNormals[2].y === _fobj.geometry.faces[j].vertexNormals[2].y
                && result.geometry.faces[i].vertexNormals[2].z === _fobj.geometry.faces[j].vertexNormals[2].z) {
                result.geometry.faces[i].color.setHex(_fobj.geometry.faces[j].color.r * 0xff0000 + _fobj.geometry.faces[j].color.g * 0x00ff00 + _fobj.geometry.faces[j].color.b * 0x0000ff);
                _foreFaceSkin = _fobj.geometry.faces[j].color.r * 0xff0000 + _fobj.geometry.faces[j].color.g * 0x00ff00 + _fobj.geometry.faces[j].color.b * 0x0000ff;
                _faceset = true;
            }
        }
        if (_faceset === false) {
            for (var j = 0; j < _sobj.geometry.faces.length; j++) {
                if (result.geometry.faces[i].vertexNormals[0].x === _sobj.geometry.faces[j].vertexNormals[0].x
                    && result.geometry.faces[i].vertexNormals[0].y === _sobj.geometry.faces[j].vertexNormals[0].y
                    && result.geometry.faces[i].vertexNormals[0].z === _sobj.geometry.faces[j].vertexNormals[0].z
                    && result.geometry.faces[i].vertexNormals[1].x === _sobj.geometry.faces[j].vertexNormals[1].x
                    && result.geometry.faces[i].vertexNormals[1].y === _sobj.geometry.faces[j].vertexNormals[1].y
                    && result.geometry.faces[i].vertexNormals[1].z === _sobj.geometry.faces[j].vertexNormals[1].z
                    && result.geometry.faces[i].vertexNormals[2].x === _sobj.geometry.faces[j].vertexNormals[2].x
                    && result.geometry.faces[i].vertexNormals[2].y === _sobj.geometry.faces[j].vertexNormals[2].y
                    && result.geometry.faces[i].vertexNormals[2].z === _sobj.geometry.faces[j].vertexNormals[2].z
                    && result.geometry.faces[i].vertexNormals[2].z === _sobj.geometry.faces[j].vertexNormals[2].z) {
                    result.geometry.faces[i].color.setHex(_sobj.geometry.faces[j].color.r * 0xff0000 + _sobj.geometry.faces[j].color.g * 0x00ff00 + _sobj.geometry.faces[j].color.b * 0x0000ff);
                    _foreFaceSkin = _sobj.geometry.faces[j].color.r * 0xff0000 + _sobj.geometry.faces[j].color.g * 0x00ff00 + _sobj.geometry.faces[j].color.b * 0x0000ff;
                    _faceset = true;
                }
            }
        }
        if (_faceset === false) {
            result.geometry.faces[i].color.setHex(_foreFaceSkin);
        }
        // result.geometry.faces[i].materialIndex = i
    }
    result.castShadow = true;
    result.receiveShadow = true;
    return result;
}
//通用方法
msj3D.prototype.commonFunc = {
    //判断对象
    hasObj: function (_obj) {
        if (_obj != null && typeof (_obj) != 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    //查找对象
    findObject: function (_objname) {
        var _this = msj3DObj;
        var findedobj = null;
        _.forEach(_this.objects, function (_obj) {
            if (_obj.name !== null && _obj.name !== '') {
                if (_obj.name === _objname) {
                    findedobj = _obj;
                    return true;
                }
            }
        });
        return findedobj;
    },
    //复制对象
    cloneObj: function (_objname, newparam) {
        var _this = msj3DObj;
        var fobj = _this.commonFunc.findObject(_objname);
        let temp = fobj.clone();
        let isError = Math.random() <= 0.4
        // if (newparam.copyfrom.includes('cabinet') && isError) {
        //     console.log(temp.children[0].material)

        //     $.each(temp.children, function (index, item) {
        //         console.log(item, 'item')
                
        //         if ('material' in item) {
        //             console.log(item)

        //             item.material.forEach((item, index) => {


        //                 item.color = 0xff0000;
        //                 console.log(item)
        //             })
        //         }
        //     })
        // }
        var newobj = temp;
        

        if (newobj.children != null && newobj.children.length > 1) {
            _.forEach(newobj.children, function (obj, index) {
                obj.name = newparam.childrenname[index];
                // !补充机柜标志,从父级传下去

                obj._name = _this.commonFunc.getName(obj)
                // console.log(obj._name)

                // isCabinet: newparam.isCabinet && obj.name.includes('_door_01'),
                _this.objects.push(obj);
            });
            
        }
        // console.log(newobj)

        //位置
        if (_this.commonFunc.hasObj(newparam.position)) {
            newobj.position.x = newparam.position.x;
            newobj.position.y = newparam.position.y;
            newobj.position.z = newparam.position.z;
        }
        //大小
        if (_this.commonFunc.hasObj(newparam.scale)) {
            newobj.scale.x = newparam.scale.x;
            newobj.scale.y = newparam.scale.y;
            newobj.scale.z = newparam.scale.z;
        }
        //角度
        if (_this.commonFunc.hasObj(newparam.rotation)) {
            _.forEach(newparam.rotation, function (rotation_obj) {
                switch (rotation_obj.direction) {
                    case 'x':
                        newobj.rotateX(rotation_obj.degree);
                        break;
                    case 'y':
                        newobj.rotateY(rotation_obj.degree);
                        break;
                    case 'z':
                        newobj.rotateZ(rotation_obj.degree);
                        break;
                    case 'arb':
                        newobj.rotateOnAxis(new THREE.Vector3(rotation_obj.degree[0], rotation_obj.degree[1], rotation_obj.degree[2]), rotation_obj.degree[3]);
                        break;
                    default:
                        break;
                }
            });
        }
        newobj.name = newparam.name;
        newobj.uuid = newparam.uuid;
        newobj.isCabinet = newparam.isCabinet
        return newobj;
    },
    getName: function getName(obj) {
        const { name } = obj

        if (/_door/.test(name)) {
            return 'door'
        } else if (/_shell/.test(name)) {
            return 'cabinet'
        }
    },
    //设置表皮颜色
    setSkinColor: function (_objname, _color) {
        var _this = msj3DObj;
        var _obj = _this.commonFunc.findObject(_objname);
        if (_this.commonFunc.hasObj(_obj.material.emissive)) {
            _obj.material.emissive.setHex(_color);
        } else if (_this.commonFunc.hasObj(_obj.material.materials)) {
            if (_obj.material.materials.length > 0) {
                _.forEach(_obj.material.materials, function (obj) {
                    obj.emissive.setHex(_color);
                });
            }
        }
    },
    //添加图片标识
    addIdentification: function (_objname, _obj) {
        var _this = msj3DObj;
        var _fobj = _this.commonFunc.findObject(_objname);
        var loader = new THREE.TextureLoader();
        var texture = loader.load(_obj.imgurl, function () { }, undefined, function () { });
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xff0000 });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.name = _obj.name;
        sprite.position.x = _fobj.position.x + _obj.position.x;
        sprite.position.y = _fobj.position.y + _obj.position.y;
        sprite.position.z = _fobj.position.z + _obj.position.z;
        if (_this.commonFunc.hasObj(_obj.size)) {
            sprite.scale.set(_obj.size.x, _obj.size.y);
        } else {
            sprite.scale.set(1, 1);
        }
        _this.addObject(sprite);
    },
    //添加文字
    makeTextSprite: function (_objname, parameters) {
        var _this = msj3DObj;
        var _fobj = _this.commonFunc.findObject(_objname);
        if (parameters === undefined) parameters = {};
        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
        var message = parameters.hasOwnProperty("message") ? parameters["message"] : "helloMsj3D";
        var x = parameters.hasOwnProperty("position") ? parameters["position"].x : 0;
        var y = parameters.hasOwnProperty("position") ? parameters["position"].y : 0;
        var z = parameters.hasOwnProperty("position") ? parameters["position"].z : 0;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context.measureText(message);
        var textWidth = metrics.width;
        context.lineWidth = borderThickness;
        context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
        context.fillText(message, borderThickness, fontsize + borderThickness);
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.x = _fobj.position.x + x;
        sprite.position.y = _fobj.position.y + y;
        sprite.position.z = _fobj.position.z + z;
        sprite.name = parameters.name;
        sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
        _this.addObject(sprite);
    }
}

msj3D.prototype.addTestObj = function () {
    var _this = msj3DObj;

    let geometry = new THREE.BoxGeometry( 100, 100, 100 );
    let material = new THREE.MeshNormalMaterial();

    let mesh = new THREE.Mesh( geometry, material );
    _this.scene.add( mesh );

    console.log(mesh);
    console.log(_this.scene);
    // _this.renderer.render(_this.scene, _this.camera);
}

// window.onresize = () => {
//     let canvasDom = document.getElementById('canvas-frame');
//     msj3DObj.renderer.setSize(canvasDom.offsetWidth, canvasDom.offsetHeight)
// }
export { msj3D, msj3DObj };