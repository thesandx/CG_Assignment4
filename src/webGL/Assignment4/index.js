import * as THREE from '/node_modules/three/build/three.module.js';
import {OBJLoader} from '/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from '/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';



		



async function main() {

  //1.basic setup
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      var scene = new THREE.Scene();

      // create a camera, which defines where we're looking at.
      var camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000); //fov, aspect, near, far
      camera.position.set(75, 20, 0);
  
      // create a render and set the size
      //var renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(new THREE.Color(0x000000));
      renderer.setSize(window.innerWidth*0.9, window.innerHeight);


      let move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false,
      };

      let params;

      let decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      let acceleration = new THREE.Vector3(1, 0.25, 50.0);
      let velocity = new THREE.Vector3(0, 0, 0);


     

      const onKeyDown = function ( event ) {

        switch ( event.code ) {

          case 'ArrowUp':
          case 'KeyW':
            move.forward = true;
            break;

          case 'ArrowLeft':
          case 'KeyA':
            move.left = true;
            break;

          case 'ArrowDown':
          case 'KeyS':
            move.backward = true;
            break;

          case 'ArrowRight':
          case 'KeyD':
            move.right = true;
            break;

          case 'Space':
            move.space=true;
            break;

          case 'Shift':
            move.shift=true;
            break;

          

        }

      };

      const onKeyUp = function ( event ) {

        switch ( event.code ) {

          case 'ArrowUp':
          case 'KeyW':
            move.forward = false;
            console.log("up press kiya")
            break;

          case 'ArrowLeft':
          case 'KeyA':
            move.left = false;
            break;

          case 'ArrowDown':
          case 'KeyS':
            move.backward=false;
            break;

          case 'ArrowRight':
          case 'KeyD':
            move.right=false;
            break;

          case 'Space':
            move.space=false;
            break;

          case 'Shift':
            move.shift=false;
            break;

        }

      };


      document.addEventListener( 'keydown', onKeyDown );
			document.addEventListener( 'keyup', onKeyUp );




      function Update(timeInSeconds) {
        const frameDecceleration = new THREE.Vector3(
            velocity.x * decceleration.x,
            velocity.y * decceleration.y,
            velocity.z * decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));
    
        velocity.add(frameDecceleration);
    
        const controlObject = params.target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();
    
        if (move.forward) {
          velocity.z += acceleration.z * timeInSeconds;
        }
        if (move.backward) {
          velocity.z -= acceleration.z * timeInSeconds;
        }
        if (move.left) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * acceleration.y);
          _R.multiply(_Q);
        }
        if (move.right) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * acceleration.y);
          _R.multiply(_Q);
        }
    
        controlObject.quaternion.copy(_R);
    
        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);
    
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();
    
        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();
    
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
    
        controlObject.position.add(forward);
        controlObject.position.add(sideways);
    
        oldPosition.copy(controlObject.position);
      }

      function Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (mixers) {
          mixers.map(m => m.update(timeElapsedS));
        }
    
        if (controls && params!=undefined) {
          Update(timeElapsedS);
        }
      }








      // light
      let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    scene.add(light);


    const controls = new OrbitControls(camera,renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

//loading resource
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './resources/posx.jpg',
        './resources/negx.jpg',
        './resources/posy.jpg',
        './resources/negy.jpg',
        './resources/posz.jpg',
        './resources/negz.jpg',
    ]);
    scene.background = texture;


    const textureLoader = new THREE.TextureLoader();
    const grassNormalMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_normal.jpg");
    const grassRoughnessMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_roughness.jpg");
    const grassHeightMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_height.jpg");
    const grassBasecolorMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_basecolor.jpg");
    const grassAmbientMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_ambientOcclusion.jpg");





    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 512, 512),
      new THREE.MeshStandardMaterial({
         color: 0x0a7d15,
          map:grassBasecolorMap,
          normalMap:grassNormalMap,
          displacementMap:grassHeightMap,
          displacementScale:0.2,
          roughnessMap:grassRoughnessMap
        }));
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  //plane.position.set(15, 0, 0);
  scene.add(plane);


  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({
        color: 0x808080,
    }));
  box.position.set(0, 1, 0);
  box.castShadow = true;
  box.receiveShadow = true;
  //scene.add(box);

  let mixers = [];
  let previousRAF = null;
  const clock = new THREE.Clock();

  async function loadAnimatedModel(){
    const loader = new FBXLoader();
    loader.setPath('./resources/');
    loader.load('remy.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      params = {
        target: fbx,
        camera: camera,
      }
      //controls = new BasicCharacterControls(params);

      const anim = new FBXLoader();
      anim.setPath('./resources/');
      anim.load('walk_idle.fbx', (anim) => {
       let m = new THREE.AnimationMixer(fbx);
        mixers.push(m)
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
        
      });
      fbx.traverse( function ( child ) {

        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

      } );
      scene.add(fbx);
    });
  }

  loadAnimatedModel();


  // const anim = new FBXLoader();
  //     anim.setPath('./resources/');
  //     anim.load('mutant.fbx', (anim) => {
  //       const m = new THREE.AnimationMixer(fbx);
  //       this._mixers.push(m);
  //       const idle = m.clipAction(anim.animations[0]);
  //       idle.play();
  //     });
  //     scene.add(anim);



  // {
  //   const objLoader = new OBJLoader();
  //   objLoader.load('./meshes/monkey/monkey.obj', (root) => {
  //     scene.add(root);
  //   });
  // }
  





    camera.lookAt(scene.position);
  
    // add the output of the renderer to the html element
    //document.getElementById("webgl-output").appendChild(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);


    function render() {

      requestAnimationFrame((t) => {
        if (previousRAF === null) {
          previousRAF = t;
        }

        render();
    
      renderer.render(scene, camera);
      Step(t -previousRAF);
      previousRAF = t;
    //   const delta = clock.getDelta();

		// if ( mixers ) mixers.update( delta );

  
      //requestAnimationFrame(render);
    });
  }
  render();
    //requestAnimationFrame(render);








  
      // // show axes in the screen
      // var axes = new THREE.AxesHelper(20);
      // scene.add(axes);
  
      // // create the ground plane
      // var planeGeometry = new THREE.PlaneGeometry(60, 20);
      // var planeMaterial = new THREE.MeshBasicMaterial({
      //     color: 0xAAAAAA
      // });
      // var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  
      // // rotate and position the plane
      // plane.rotation.x = -0.5 * Math.PI;
      // plane.position.set(15, 0, 0);
  
      // // add the plane to the scene
      // scene.add(plane);
  
      // // create a cube
      // var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
      // var cubeMaterial = new THREE.MeshBasicMaterial({
      //     color: 0xFF0000,
      //     wireframe: true
      // });
      // var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  
      // // position the cube
      // cube.position.set(-4, 3, 0);
  
      // // add the cube to the scene
      // scene.add(cube);
  
      // // create a sphere
      // var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      // var sphereMaterial = new THREE.MeshBasicMaterial({
      //     color: 0x7777FF,
      //     wireframe: true
      // });
      // var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  
      // // position the sphere
      // sphere.position.set(20, 4, 2);
  
      // // add the sphere to the scene
      // scene.add(sphere);
  
      // // position and point the camera to the center of the scene
      // camera.position.set(-30, 40, 30);
  
  
  //   const fov = 75;
  //   const aspect = 2;  // the canvas default
  //   const near = 0.1;
  //   const far = 5;
  //   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  //   camera.position.z = 2;
  
  //   const scene = new THREE.Scene();
  
  //   {
  //     const color = 0xFFFFFF;
  //     const intensity = 1;
  //     const light = new THREE.DirectionalLight(color, intensity);
  //     light.position.set(-1, 2, 4);
  //     scene.add(light);
  //   }
  
  //   const boxWidth = 1;
  //   const boxHeight = 1;
  //   const boxDepth = 1;
  //   const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  
  //   const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
  
  //   const cube = new THREE.Mesh(geometry, material);
  //  scene.add(cube);


  // {
  //   const objLoader = new OBJLoader();
  //   objLoader.load('./meshes/monkey/monkey.obj', (root) => {
  //     scene.add(root);
  //   });
  // }


 
  
  //   function render(time) {
  //     time *= 0.001;  // convert time to seconds
  
  //     cube.rotation.x = time;
  //     cube.rotation.y = time;
  
  //     renderer.render(scene, camera);
  
  //     requestAnimationFrame(render);
  //   }
  //   requestAnimationFrame(render);


  
  
  }


  
  main();
