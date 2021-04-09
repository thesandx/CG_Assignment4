import Render from "./render.js";
import {vec3,mat4} from 'https://cdn.skypack.dev/gl-matrix';
import OBJ from 'https://cdn.skypack.dev/webgl-obj-loader'



const renderer = new Render();
const gl = renderer.webGlContext();


var lastDownTarget, canvas;
let mode = 0;
let shading = 0;
let currsel=2;
let meshdiana;
let meshmonkey;
let meshamongus;


window.onload = function() {
    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    let jsondiana = {
        "rotationMatirx":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "camera":{
            "x":5,
            "y":5,
            "z":-15
        },
        "trans":{
            "x":-0.5,
            "y":0.5,
            "z":0.5
        },
        "scale":{
            "x":1,
            "y":1,
            "z":1
        },
        
        "objcolor":{
            "x":0,
            "y":1,
            "z":0
        },
        "lightcolor":{
            "x":1,
            "y":1,
            "z":1
        },
        "speccolor":{
            "x":1,
            "y":1,
            "z":1
        },
        "lightpos":{
            "x":-20,
            "y":10,
            "z":-50
        },
        "coff":{
            "ka":1,
            "ks":1,
            "kd":1
        },
        "shininess":150,
        "phong":false
        
    };

    let jsonmonkey = {

        "camera":{
            "x":5,
            "y":5,
            "z":-15
        },
        "trans":{
            "x":0.8,
            "y":-0.5,
            "z":-0.5
        },
        "scale":{
            "x":1,
            "y":1,
            "z":1
        },
        
        "objcolor":{
            "x":1,
            "y":0,
            "z":0
        },
        "lightcolor":{
            "x":1,
            "y":1,
            "z":1
        },
        "speccolor":{
            "x":1,
            "y":1,
            "z":1
        },
        "lightpos":{
            "x":20,
            "y":0,
            "z":-50
        },
        "coff":{
            "ka":1,
            "ks":1,
            "kd":1
        },

        "shininess":300,
        "phong":false
    };
    let jsonamongus = {

        "camera":{
            "x":5,
            "y":5,
            "z":-15
        },
        "trans":{
            "x":0.9,
            "y":0.5,
            "z":0.5
        },
        "scale":{
            "x":1,
            "y":1,
            "z":1
        },
        
        "objcolor":{
            "x":0,
            "y":0,
            "z":1
        },
        "lightcolor":{
            "x":1,
            "y":1,
            "z":1
        },
        "speccolor":{
            "x":1,
            "y":1,
            "z":1
        },
        "lightpos":{
            "x":20,
            "y":10,
            "z":-50
        },
        "coff":{
            "ka":1,
            "ks":1,
            "kd":1
        },
        "shininess":128,
        "phong":false
    };

    
    canvas = renderer.getCanvas();


    document.addEventListener('keydown',function(event){

        switch(event.key){
            case "m":
                console.log("m is pressed");
                mode = (mode+1)%2;
                if(mode==0){
                    document.getElementById("p1").innerHTML = "mesh-transformation mode is <b>InActive</b>";
                }
                else{
                    document.getElementById("p1").innerHTML = " mesh-transformation mode is <b>Active</b> ";
                }
                break;
            case "s":
                console.log("s is pressed");
                shading = (shading+1)%2;
                if(shading==0){
                    if(currsel==3){
                        jsonmonkey.phong=false;
                        document.getElementById("p3").innerHTML = "shading-model-choice mode - <b>Gourand</b>";
                    }
                    if(currsel==4){
                        jsondiana.phong=false;
                        document.getElementById("p3").innerHTML = "shading-model-choice mode - <b>Gourand</b>";
                    }
                    if(currsel==5){
                        jsonamongus.phong=false;
                        document.getElementById("p3").innerHTML = "shading-model-choice mode - <b>Gourand</b>";
                    }
                    drawAll(jsondiana,jsonmonkey,jsonamongus);
                    
                }
                else{
                    
                    if(currsel==3){
                        jsonmonkey.phong=true;
                        document.getElementById("p3").innerHTML = " shading-model-choice mode - <b>Phong</b> ";
                    }
                    if(currsel==4){
                        jsondiana.phong=true;
                        document.getElementById("p3").innerHTML = " shading-model-choice mode - <b>Phong</b> ";
                    }
                    if(currsel==5){
                        jsonamongus.phong=true;
                        document.getElementById("p3").innerHTML = " shading-model-choice mode - <b>Phong</b> ";
                    }
                    drawAll(jsondiana,jsonmonkey,jsonamongus);
                }
                break;
            case "+":
                if(mode==1) {
                    //scale(currentSel,0.1);
                    if(currsel==3){
                        jsonmonkey.scale.x += 0.1;
                        jsonmonkey.scale.y += 0.1;
                        jsonmonkey.scale.z += 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                        

                    }
                    if(currsel==4){
                    jsondiana.scale.x += 0.1;
                    jsondiana.scale.y += 0.1;
                    jsondiana.scale.z += 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus);  

                    }
                    if(currsel==5){
                        jsonamongus.scale.x += 0.1;
                        jsonamongus.scale.y += 0.1;
                        jsonamongus.scale.z += 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                    }
                    
                      
                }
                break;
               
            case "a":
                if(mode==1) {
                    //scale(currentSel,0.1);
                    if(currsel==3){
                        jsonmonkey.trans.x += 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                        

                    }
                    if(currsel==4){
                    jsondiana.trans.x += 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus);  

                    }
                    if(currsel==5){
                        jsonamongus.trans.x += 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                    }
                    
                      
                }

                break;
            case "d":
                if(mode==1) {
                    if(currsel==3){
                        jsonmonkey.trans.x -= 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                        
    
                    }
                    if(currsel==4){
                    jsondiana.trans.x -= 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus);  
    
                    }
                    if(currsel==5){
                        jsonamongus.trans.x -= 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                    }
                    
                }
                break;
            case "x":
                if(mode==1) {
                    if(currsel==3){
                        jsonmonkey.trans.y -= 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                        
    
                    }
                    if(currsel==4){
                    jsondiana.trans.y -= 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus);  
    
                    }
                    if(currsel==5){
                        jsonamongus.trans.y -= 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                    }
                    
                }
                break;
            case "w":
                if(mode==1) {
                    //scale(currentSel,0.1);
                    if(currsel==3){
                        jsonmonkey.trans.y += 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                        

                    }
                    if(currsel==4){
                    jsondiana.trans.y += 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus);  

                    }
                    if(currsel==5){
                        jsonamongus.trans.y += 0.1;
                        drawAll(jsondiana,jsonmonkey,jsonamongus); 
                    }
                    
                      
                }
                break;

            case "-":
            if(mode==1) {
                if(currsel==3){
                    jsonmonkey.scale.x -= 0.1;
                    jsonmonkey.scale.y -= 0.1;
                    jsonmonkey.scale.z -= 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus); 
                    

                }
                if(currsel==4){
                jsondiana.scale.x -= 0.1;
                jsondiana.scale.y -= 0.1;
                jsondiana.scale.z -= 0.1;
                drawAll(jsondiana,jsonmonkey,jsonamongus);  

                }
                if(currsel==5){
                    jsonamongus.scale.x -= 0.1;
                    jsonamongus.scale.y -= 0.1;
                    jsonamongus.scale.z -= 0.1;
                    drawAll(jsondiana,jsonmonkey,jsonamongus); 
                }
                
            }
            break;
            case "2":
                currsel=2;
                document.getElementById("p5").innerHTML = "Current mesh id is <b>2</b> (None)";

                break;
            case "3":
                console.log("3 dabaya");
                currsel=3;
                document.getElementById("p5").innerHTML = "Current mesh id is <b>3</b> (Monkey)";
                break;
            case "4":
                console.log("4 dabaya");
                currsel=4;
                document.getElementById("p5").innerHTML = "Current mesh id is <b>4</b> (Dianasour)";
                break;
            case "5":
                console.log("5 dabaya");
                currsel=5;
                document.getElementById("p5").innerHTML = "Current mesh id is <b>5</b> (AmongUs)";
                break;
            default:
                console.log("kuch bhi");

        }

    },false);

    Trackball.RotationWithQuaternion.onRotationChanged = function (updatedRotationMatrix) {
        //console.log("trackball wala "+updatedRotationMatrix);
        if(mode==1){
            if(currsel==3){
                console.log("3 update hua");
                jsonmonkey.rotationMatrix  = updatedRotationMatrix;
                jsondiana.rotationMatrix=undefined;
                jsonamongus.rotationMatrix=undefined;
                drawAll(jsondiana,jsonmonkey,jsonamongus);
            }
            else if(currsel==4){
                console.log("4 update hua");
                jsondiana.rotationMatrix  = updatedRotationMatrix;
                jsonmonkey.rotationMatrix=undefined;
                jsonamongus.rotationMatrix=undefined;
                drawAll(jsondiana,jsonmonkey,jsonamongus);
            }
            else if(currsel==5){
                console.log("5 update hua");
                jsonamongus.rotationMatrix  = updatedRotationMatrix;
                jsondiana.rotationMatrix=undefined;
                jsonmonkey.rotationMatrix=undefined;
                drawAll(jsondiana,jsonmonkey,jsonamongus);

            }
        }
        

    }
    


    var objStr5 = document.getElementById('monkey.obj').innerHTML;
    meshmonkey = new OBJ.Mesh(objStr5);
   // console.log(meshmonkey);

    var objStr6 = document.getElementById('dinasour.obj').innerHTML;
    meshdiana = new OBJ.Mesh(objStr6);

    var objStr7 = document.getElementById('amongus.obj').innerHTML;
    meshamongus = new OBJ.Mesh(objStr7);

   renderer.clear();

    drawAll(jsondiana,jsonmonkey,jsonamongus);

   
    
    
    
}



if (!gl) {
    throw new Error('WebGL not supported');
}

function drawAll(jsondiana,jsonmonkey,jsonamongus){
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    draw(meshdiana,jsondiana);
    draw(meshmonkey,jsonmonkey);
    draw(meshamongus,jsonamongus);
}



 function draw(meshcube,jsondiana){
    //create vertex data

	//
	// Create buffer
    //
    


    
    //debugger;

    OBJ.initMeshBuffers(gl, meshcube);

    var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshcube.vertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshcube.indices), gl.STATIC_DRAW);



   // debugger;

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshcube.vertexNormals), gl.STATIC_DRAW);
 
    

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
if(jsondiana.phong==undefined){
    jsondiana.phong=false;
}
if(!jsondiana.phong){

gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;




uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;
uniform mat4 u_world;

varying vec3 vNormal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform vec3 ambient; 
uniform vec3 sunlight; 
uniform vec3 specularColor; //speccolor
uniform vec3 sundir; 
uniform vec3 lightPosition;

uniform float u_shininess;
uniform float ka;
uniform float kd;   
uniform float ks;

attribute vec3 color;
varying vec3 vColor;

void main() {

    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    
    vNormal = mat3(mWorld) * vertNormal;

    vec3 surfaceWorldPosition = (u_world * vec4(vertPosition, 1.0)).xyz;
    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

    vec3 adjustNormal = normalize(vNormal);


    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float light = max(dot(adjustNormal,surfaceToLightDirection),0.0);
    

    float specular = 0.0;
   if (light > 0.0) {
       specular = pow(dot(adjustNormal, halfVector), u_shininess);
   }

   vec3 lightIntensity = ka*ambient+ kd*sunlight * light;

    vColor =lightIntensity;
    vColor.rgb += ks*specular*specularColor;
}
`
    );
gl.shaderSource(fragmentShader, `

precision mediump float;
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
}
else{

	gl.shaderSource(vertexShader, `
    precision mediump float;
 
    //i.e buffer wala
    attribute vec3 vertPosition;
    attribute vec3 vertNormal;
    

    
    
//value pass wala
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    uniform vec3 u_lightWorldPosition;
    uniform vec3 u_viewWorldPosition;

    uniform mat4 u_world;


//local varaible yhan use hone wala

    varying vec3 vNormal;
    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToView;
   

  
    
    void main() {
        

        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
        
        vNormal = mat3(mWorld) * vertNormal;

        vec3 surfaceWorldPosition = (u_world * vec4(vertPosition, 1.0)).xyz;
        v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
        v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

    }
    `
        );
    gl.shaderSource(fragmentShader, `

     precision mediump float;

     varying vec3 vNormal;
     varying vec3 v_surfaceToLight;
     varying vec3 v_surfaceToView;



     

     uniform vec3 ambient; //ambientcolr
     uniform vec3 sunlight; //diffusecolor
     uniform vec3 specularColor; //speccolor
     uniform vec3 sundir;  //diffuse location
     uniform vec3 lightPosition;

     uniform float u_shininess;
     uniform float ka;
     uniform float kd;   
     uniform float ks;
    


     void main() {        
        
         vec3 adjustNormal = normalize(vNormal);


         vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
         vec3 surfaceToViewDirection = normalize(v_surfaceToView);
         vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

         float light = max(dot(adjustNormal,surfaceToLightDirection),0.0);
         

         float specular = 0.0;
        if (light > 0.0) {
            specular = pow(dot(adjustNormal, halfVector), u_shininess);
        }

         vec3 lightIntensity = ka*ambient+ kd*sunlight * light;

         gl_FragColor = vec4(lightIntensity,1.0);
         gl_FragColor.rgb += ks*specular*specularColor;

     }
    `);
}
    
    gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
     

   let camera = [jsondiana.camera.x,jsondiana.camera.y,jsondiana.camera.z]

    //let camera = [5,5,-15]
    


        //create program
    const program = gl.createProgram();
    
    //attach shaders to program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER,boxVertexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        meshcube.vertexBuffer.itemSize, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        0, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
        normalAttribLocation, // Attribute location
        meshcube.normalBuffer.itemSize, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE ,
        0, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(normalAttribLocation);
    
    
    gl.useProgram(program);
    
    
    
    
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var ambientUniformLocation = gl.getUniformLocation(program, 'ambient');
    var sunlightUniformLocation = gl.getUniformLocation(program, 'sunlight');
    var specColorUniformLocation = gl.getUniformLocation(program, 'specularColor');

    // var lightPositionUniformLocation = gl.getUniformLocation(program, 'lightPosition');

    var lightWorldPositionLocation =
    gl.getUniformLocation(program, "u_lightWorldPosition");

    var viewWorldPositionLocation =
    gl.getUniformLocation(program, "u_viewWorldPosition");

    var shininessLocation = gl.getUniformLocation(program, "u_shininess");
    var ka = gl.getUniformLocation(program, "ka");
    var kd = gl.getUniformLocation(program, "kd");
    var ks = gl.getUniformLocation(program, "ks");
     

    

    





    
    // var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    //   var colorLocation = gl.getUniformLocation(program, "u_color");
    //   //var reverseLightDirectionLocation =
    // //gl.getUniformLocation(program, "u_reverseLightDirection");
    
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    //var worldViewProjectionMatrix = new Float32Array(16);
    
    mat4.identity(worldMatrix);
    mat4.translate(worldMatrix,worldMatrix,[jsondiana.trans.x,jsondiana.trans.y,jsondiana.trans.z]);
    mat4.scale(worldMatrix,worldMatrix,[jsondiana.scale.x,jsondiana.scale.y,jsondiana.scale.z]);
    if(jsondiana.rotationMatrix!=undefined){
    mat4.mul(worldMatrix,worldMatrix,jsondiana.rotationMatrix);
    }
        

    
    
    mat4.lookAt(viewMatrix, camera, [0, 0, 0], [0, 1, 0]); //out,eye,centre,up
    mat4.perspective(projMatrix, Math.PI/8, renderer.getCleintVal(), 0.1, 1000.0); //out, fovy, aspect, near, far
    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);




    gl.uniform3f(ambientUniformLocation,jsondiana.objcolor.x,jsondiana.objcolor.y,jsondiana.objcolor.z);  //color of object
   // gl.uniform3f(sundirUniformLocation,-5.0,0.0,0.0);
    gl.uniform3f(sunlightUniformLocation,jsondiana.lightcolor.x,jsondiana.lightcolor.y,jsondiana.lightcolor.z); //color of light 

    //gl.uniform3f(lightPositionUniformLocation,-5.0,0.0,0.0);

    gl.uniform3f(lightWorldPositionLocation,jsondiana.lightpos.x,jsondiana.lightpos.y,jsondiana.lightpos.z);
    gl.uniform3f(specColorUniformLocation,jsondiana.speccolor.x,jsondiana.speccolor.y,jsondiana.speccolor.z);

    // set the camera/view position
    gl.uniform3fv(viewWorldPositionLocation, camera);

    //var shininess = 150;
    var shininess=jsondiana.shininess;

    gl.uniform1f(shininessLocation, shininess);
    gl.uniform1f(ka, jsondiana.coff.ka);
    gl.uniform1f(kd, jsondiana.coff.kd);
    gl.uniform1f(ks, jsondiana.coff.ks);

    

//     // Set the color to use
//      gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green
 
//   // set the light direction.

//      gl.uniform3fv(reverseLightDirectionLocation, mat4.normalize([0.5, 0.7, 1]));
   /// gl.uniformMatrix4fv(matrixLocation, gl.FALSE, worldViewProjectionMatrix);
    
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    
    //
    // Main render loop
    //
  //var loop = function () {
    // var identityMatrix = new Float32Array(16);
    // mat4.identity(identityMatrix);
    // var angle = 0;
    
    //     angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    //    mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    //    mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
    //     mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
       // gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    
       // gl.clearColor(0.75, 0.85, 0.8, 1.0);
        //gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, meshcube.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.deleteShader(vertexShader);
       gl.deleteShader(fragmentShader);
        gl.deleteProgram(program);
        //requestAnimationFrame(loop);

    // requestAnimationFrame(loop); 
    }
    
     






