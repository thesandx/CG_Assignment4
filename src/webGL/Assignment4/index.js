import * as THREE from '/node_modules/three/build/three.module.js';
import {OBJLoader} from '/node_modules/three/examples/jsm/loaders/OBJLoader.js';



async function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
  
    const scene = new THREE.Scene();
  
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
  
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
  
    const cube = new THREE.Mesh(geometry, material);
   scene.add(cube);


  {
    const objLoader = new OBJLoader();
    objLoader.load('./meshes/monkey/monkey.obj', (root) => {
      scene.add(root);
    });
  }


 
  
    function render(time) {
      time *= 0.001;  // convert time to seconds
  
      cube.rotation.x = time;
      cube.rotation.y = time;
  
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  
  }


  
  main();