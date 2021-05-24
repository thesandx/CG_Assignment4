import * as THREE from '/node_modules/three/build/three.module.js';
import {OBJLoader} from '/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from '/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import { FlyControls } from '/node_modules/three/examples/jsm/controls/FlyControls.js';




		



async function main() {

  //1.basic setup
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

      // create a scene, that will hold all our elements such as objects, cameras and lights.
      var scene = new THREE.Scene();

      // create a camera, which defines where we're looking at.
      var camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000); //fov, aspect, near, far
      camera.position.set(0,70,-100);
  
      // create a render and set the size
      //var renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(new THREE.Color(0x000000));
      renderer.setSize(window.innerWidth*.95, window.innerHeight);
      renderer.shadowMap.enabled = true;//enable shadow
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0xfffafa, 1);

      let colliders = [];
      let unused = [];


      
      function initCamera(initialPosition) {
        var position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(0,70,-100);//30,40,0
    //debugger;
        var camera = new THREE.PerspectiveCamera(45,2,0.1,1000);
        camera.position.copy(position);
        camera.lookAt(new THREE.Vector3(-20, 50, 100));
    
        return camera;
    }
    
    
    
    function initFlyControls(camera,renderer,autoForward)
    {  
       
       var flyControls = new FlyControls(camera,renderer.domElement);
       flyControls.movementSpeed = 20;
       console.log("fly controls")
       flyControls.rollSpeed = Math.PI / 24;
       flyControls.autoForward = autoForward;
       flyControls.dragToLook = false;
       return flyControls;
    }
    var camera_selected = 1;
    var flyControls ;
    var firstPersonControl ;
    //var cam = 1;
    
        function updateCamera (cam) {
          if (cam === 1) {
            camera_selected = 1;
            flyControls = undefined;
            firstPersonControl = undefined;
            camera = initCamera(new THREE.Vector3(0,70,-150));
            console.log("default");
            renderer.render(scene, camera);
          }
          if (cam === 2) {
            camera_selected = 2;
            camera = initCamera(new THREE.Vector3(0,500,10)); //60,70,0
            firstPersonControl = undefined;
            flyControls = initFlyControls(camera, renderer,true);
            console.log("view 2");
            renderer.render(scene, camera);
          }
          if(cam===3){
            camera_selected = 3;
            //debugger;
            if(params.target===undefined){
            camera = initCamera(new THREE.Vector3(0,50,0)); 
            }//60,70,0
            else{
              camera = initCamera(new THREE.Vector3(params.target.x,50,params.target.z)); 
            }
            firstPersonControl = undefined;
            flyControls = initFlyControls(camera, renderer,false);
            console.log("view 3");
            renderer.render(scene, camera);
          }
          
        }

      let move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false,
      };

      let groundValue = 0;

      let params;

      let decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      let acceleration = new THREE.Vector3(1, 0.25, 75.0);
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
          
          case 'Keyg':
          case 'KeyG':
            console.log("g press kiya");
            groundValue = (groundValue+1)%2;  
            break;

          case 'KeyH':
          case 'Keyh':
            onReplaceTexture();

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
        //v = u+at
       
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
        //debugger;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();
    
        //v = u+at
        if (move.forward) {
          if(true){
            velocity.z += acceleration.z * timeInSeconds;
          }
         
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
        if(move.space){
         // debugger;
          console.log("kudna hai");
          velocity.y = 30;
          //velocity.y +=acceleration.y * timeInSeconds;
          velocity.y +=75*timeInSeconds ;
          velocity.y = Math.max(velocity.y,100);

        }
        else{
          velocity.y = -30;
          
          //velocity.y +=acceleration.y * timeInSeconds;
          velocity.y +=-75*timeInSeconds ;
          velocity.y = Math.max(velocity.y,-100);
          //i.e zameen ke under na jaaye
          if(controlObject.position.y<0){
            velocity.y=0;
          }
        }

        if(groundValue==0){
              currentJson = groundJson;
             //debugger;
             plane.material = new THREE.MeshStandardMaterial(currentJson);
              plane.material.needsUpdate = true;
        }
        else{
          //debugger;
          currentJson = marbleJson;
          plane.material = new THREE.MeshStandardMaterial(currentJson);
          plane.material.needsUpdate = true;
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

        const upways = new THREE.Vector3(0, 1, 0);
        upways.applyQuaternion(controlObject.quaternion);
        upways.normalize();

    
        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);
        upways.multiplyScalar(velocity.y * timeInSeconds);
        

        // let visible=[];
        // let invisible = [];

        // for(let obj of objects){
        //     obj.position.z -= timeInSeconds*speed;
        //     if(obj.position.z<0){
        //           invisible.push(obj);
        //           obj.mesh.visible = false;
        //     }
        //     else{
        //       visible.push(obj);
        //     }
        //     obj.position.copy(obj.position);
        // }


        // objects=visible;
        // unused.push(...invisible);
    
        




        // if (move.space && controlObject.position.y == 0.0) {
        //   velocity.y= 30;
        // }
  
        // acceleration.y= -75 * timeElapsed;
  
        // controlObject.position.y += timeElapsed * (
        //   controlObject.position.y + acceleration.y * 0.5);
        //   controlObject.position.y = Math.max(controlObject.position.y, 0.0);
  
        // velocity.y += acceleration.y;
        // velocity.y = Math.max(velocity.y, -100);

        controlObject.position.add(forward);
        controlObject.position.add(upways);
        controlObject.position.add(sideways);
    
        oldPosition.copy(controlObject.position);

        checkCollision();
        updateBox(timeInSeconds);
        maybeSpawn();

  

      }


      function checkCollision(){
        let playerBox = new THREE.Box3();
        playerBox.setFromObject(params.target);
        for (let cur of colliders) {
         // const cur = c.collider;
          let box = new THREE.Box3();
          box.setFromObject(cur);
          if (box.intersectsBox(playerBox)) {
            console.log("collision");
            params.target.position.x=10;
            return true;
          }
          else{
            params.target.position.x=0;
            return false;
          }
        }

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


      const START_POS = 100;
      const SEPARATION_DISTANCE = 20;

  //function to add obstacles.
  function addBox(z){


    const loader = new FBXLoader();
    loader.setPath('./resources/');
    loader.load('Cactus3.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
        //c.position(0, 1, 40*z);
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            if (texture) {
              m.map = texture;
              
            }
            m.specular = new THREE.Color(0x00FF00);
          }
        }  
        
        let colliderBox =  new THREE.Box3();
        colliderBox.setFromObject(c);

      });
      //fbx.mesh.material.needsUpdate=true;
      let  pos = new THREE.Vector3(0, 1, 100*z);
      fbx.position.add(pos);
      colliders.push(fbx);
      scene.add(fbx);

    });

      // params = {
      //   target: fbx,
      //   camera: camera,
      // }

    // const box = new THREE.Mesh(
    //   new THREE.BoxGeometry(2, 2, 2),
    //   new THREE.MeshStandardMaterial({
    //       color: 0xFF8080,
    //   }));
    // box.position.set(0, 1, 40*z);
    // box.castShadow = true;
    // box.receiveShadow = true;
  }

  function addBoxStatic(){
    const loader = new FBXLoader();
    loader.setPath('./resources/');
    loader.load('Cactus3.fbx', (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
        //c.position(0, 1, 40*z);
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            if (texture) {
              m.map = texture;
            }
            m.specular = new THREE.Color(0x000000);
          }
        }  
        let colliderBox =  new THREE.Box3();
        colliderBox.setFromObject(c);

      });

      var x = 500; // can be any number
      var randx = Math.floor(Math.random()*x) + 1;
      var y = 100; // can be any number
      var randy= Math.floor(Math.random()*y) + 1;
      var z = 500; // can be any number
      var randz = Math.floor(Math.random()*z) + 1;
      let  pos = new THREE.Vector3(randx,0,randz);
      fbx.position.add(pos);
      //colliders.push(fbx);
      scene.add(fbx);

    });

      // params = {
      //   target: fbx,
      //   camera: camera,
      // }

    // const box = new THREE.Mesh(
    //   new THREE.BoxGeometry(2, 2, 2),
    //   new THREE.MeshStandardMaterial({
    //       color: 0xFF8080,
    //   }));
    // box.position.set(0, 1, 40*z);
    // box.castShadow = true;
    // box.receiveShadow = true;

   


  }
 


  function maybeSpawn() {
    let obj = null;
    if(unused.length>0 ){
      obj = unused.pop();
     if(obj!=undefined){
      obj.visible = true;
      obj.position.z = colliders[colliders.length-1].position.z+START_POS+SEPARATION_DISTANCE+50;
      colliders.push(obj);
     }
     else{
     addBox(colliders[colliders.length-1].position.z+START_POS+SEPARATION_DISTANCE+50);
     }
    }
    
  }


  function updateBox(timeElapsed){

    const invisible = [];
      const visible = [];

    for(let obj of colliders){
      //debugger;
      if(obj!=undefined && obj.position!=undefined){ 
         if (obj.position.z < -5) {
          invisible.push(obj);
          //debugger;
          obj.visible = false;
          //obj.position.z = colliders[colliders.length-1].position.z+SEPARATION_DISTANCE+(timeElapsed * 30);
        } else {
          visible.push(obj);
          obj.position.z -= timeElapsed * 30;
        }
       
      }
    
    }
    colliders=visible;
    unused.push(...invisible);
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

//     var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
// scene.add(hemisphereLight);
// let sun = new THREE.DirectionalLight( 0xcdc1c5, 0.9);
// sun.position.set( 12,6,-7 );
// sun.castShadow = true;
// scene.add(sun);


    const controls = new OrbitControls(camera,renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.enableZoom = false;
    controls.update();

//loading resource

//load surrounding i.e mountains.
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


    //ground textures

    const textureLoader = new THREE.TextureLoader();
    const grassNormalMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_normal.jpg");
    const grassRoughnessMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_roughness.jpg");
    const grassHeightMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_height.jpg");
    const grassBasecolorMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_basecolor.jpg");
    const grassAmbientMap = textureLoader.load("./resources/ground_texture/Stylized_Grass_003_ambientOcclusion.jpg");


    const marbleNormalMap = textureLoader.load("./resources/marble_texture/Pebbles_024_Normal.jpg");
    const marbleRoughnessMap = textureLoader.load("./resources/marble_texture/Pebbles_024_Roughness.jpg");
    const marbleHeightMap = textureLoader.load("./resources/marble_texture/Pebbles_024_Height.jpg");
    const marbleBasecolorMap = textureLoader.load("./resources/marble_texture/Pebbles_024_Basecolor.jpg");
    const marbleAmbientMap = textureLoader.load("./resources/marble_texture/Pebbles_024_AmbientOcclusion.jpg");


    let groundJson = {
      // color: 0x0a7d15,
        map:grassBasecolorMap,
        normalMap:grassNormalMap,
        displacementMap:grassHeightMap,
        displacementScale:0.2,
        roughnessMap:grassRoughnessMap,

      };


      let marbleJson = {
        map:marbleBasecolorMap,
        normalMap:marbleNormalMap,
        displacementMap:marbleHeightMap,
        displacementScale:0.2,
        roughnessMap:marbleRoughnessMap,
      }

      let currentJson = groundJson;




    grassBasecolorMap.wrapS = grassBasecolorMap.wrapT = THREE.RepeatWrapping;
				grassBasecolorMap.repeat.set(500, 500);
				grassBasecolorMap.anisotropy = 16;
				grassBasecolorMap.encoding = THREE.sRGBEncoding;



        marbleBasecolorMap.wrapS = marbleBasecolorMap.wrapT = THREE.RepeatWrapping;
				marbleBasecolorMap.repeat.set(50,50 );
				marbleBasecolorMap.anisotropy = 16;
				marbleBasecolorMap.encoding = THREE.sRGBEncoding;




        // var sides=40;
        // var tiers=40;
        // var worldRadius=26;
        // var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20000,20000, 512, 512),
      new THREE.MeshStandardMaterial(groundJson));
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  //plane.position.set(15, 0, 0);
  scene.add(plane);


  for(let i=1;i<10;i++){
        addBox(i);
        addBoxStatic();
  }

  let mixers = [];
  let previousRAF = null;
  const clock = new THREE.Clock();

  //loading player
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
          child.castShadow = false;
          child.receiveShadow = true;
        }

      } );
      scene.add(fbx);
    });
    var controls2 = new function(){
      this.cam = 1;
      console.log("hi");
      this.changeCamera=function(e){
        this.cam=e;
        updateCamera(this.cam);  
        console.log("hi");
    }
    }
   
    controls2.changeCamera(1);
   
   
    
//lights 
    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // add spotlight for the shadows
    // add spotlight for the shadows
    var manLight = new THREE.SpotLight(0xffffff);
    manLight.position.set(-40, 60, -10);
    manLight.castShadow = true;
    //scene.add( spotLight );

    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 100;
    scene.add(pointLight);

    var controls1 = new function () {
      this.ambientColor = ambiColor;
      this.pointColor = pointColor;
      this.intensity = 1;
      this.distance = 100;
      
  };

  var gui = new GUI();

  gui.add(controls2,'cam',1,3).step(1).onChange(controls2.changeCamera);
  controls2.changeCamera(1);
  gui.addColor(controls1, 'ambientColor').onChange(function (e) {
    ambientLight.color = new THREE.Color(e);
});


  gui.addColor(controls1, 'pointColor').onChange(function (e) {
      pointLight.color = new THREE.Color(e);
  });

  gui.add(controls1, 'intensity', 0, 3).onChange(function (e) {
      pointLight.intensity = e;
  });

  gui.add(controls1, 'distance', 0, 100).onChange(function (e) {
      pointLight.distance = e;
  });

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
  }
  }

  loadAnimatedModel();
  let start = 1000;

  function onReplaceTexture() {
    var textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    textureLoader.load("https://picsum.photos/id/"+start+"/200/300", function (texture) {
      start++;

      // mesh is a group contains multiple sub-objects. Traverse and apply texture to all. 
      params.target.traverse(function (child) {
        if (child instanceof THREE.Mesh) {

          // apply texture
          child.material.map = texture
          child.material.needsUpdate = true;
        }
      });

    });
  }

 


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
        if (flyControls !== undefined)
          flyControls.update(clock.getDelta());
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
  }


  
  main();
