import React from 'react';
import * as THREE from 'three';

let camera, scene, renderer;
let geometry, material, mesh;
class MachineRoom extends React.Component {

    componentDidMount() {
        // threeStart();
        this.init();
    }

    init = () => {
       

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.z = 1;
    
        scene = new THREE.Scene();
    
        geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        material = new THREE.MeshNormalMaterial();
    
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    
        console.log(mesh);
        console.log(scene);
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setAnimationLoop( this.animation );
        document.getElementById('canvas-frame').appendChild( renderer.domElement );
    
    }

    animation = (time) => {

        mesh.rotation.x = time / 2000;
        mesh.rotation.y = time / 1000;
    
        renderer.render( scene, camera );
    
    }

    render() {
        return(
            <div id="canvas-frame" className="canvas_frame"></div>
        )
    }
    
}
export default MachineRoom;