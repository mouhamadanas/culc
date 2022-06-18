/////////////////
//
//
//
//
//start
//
//
//
//
//
///////////////////
let sattaliteMass = 4000,
  airDensity,
  sattaliteX = 5,
  sattalitey = 4,
  vx = 0,
  vy = 0,
  forceGravity,
  forceGravityX,
  forceGravityY,
  PushingForce,
  PushingForceX,
  PushingForceY,
  fx,
  fy,
  theta = 0,
  ax,
  ay,
  start = 0,
  tempX = 0,
  tempy = 0,
  r;
const selectxElement = document.querySelector(".x_speed");
const selectyElement = document.querySelector(".y_speed");
const reset = document.querySelector("#reset");
const Start = document.getElementById("start");
const x_posintion = document.querySelector(".x_position");
const y_posintion = document.querySelector(".y_position");

selectxElement.addEventListener("change", (event) => {
  if (event.target.value) tempX = event.target.value;
});
selectyElement.addEventListener("change", (event) => {
  if (event.target.value) tempy = event.target.value;
});
reset.onclick = () => {
  start = 0;
  tempX = 0;
  tempy = 0;
  sattaliteX = 5;
  sattalitey = 4;
  vx = 0;
  vy = 0;
  x_posintion.value = sattaliteX;
  y_posintion.value = sattalitey;
  selectxElement.value = 0;
  selectyElement.value = 0;
};
Start.onclick = function (event) {
  start = 1;
  vx = Number(tempX);
  vy = Number(tempy);
};
x_posintion.addEventListener("change", (e) => {
  sattaliteX = Number(e.target.value);
});
y_posintion.addEventListener("change", (e) => {
  sattalitey = Number(e.target.value);
});
let G = 6.673 * Math.pow(10, -11);
let earthMass = 5.97 * Math.pow(10, 24);
var scene = new THREE.Scene();
var camira = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
///////////////////////////////////////////////////////////////
const orbitControls = new THREE.OrbitControls(camira, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;
orbitControls.minDistance = 3;
///////////////////////////////
const geometry1 = new THREE.SphereGeometry(1, 100, 100);
const material1 = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("earth.jpg"),
});
const earth = new THREE.Mesh(geometry1, material1);
scene.add(earth);
////////////////////////////////////////
const geometry2 = new THREE.SphereGeometry(0.5, 100, 100);
geometry2.translate(10, 0, 0);
const material2 = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("moon.jpg"),
});
const moon = new THREE.Mesh(geometry2, material2);
scene.add(moon);
/////////////////////////////////
const loader = new THREE.GLTFLoader();
let root;
loader.load("scene.gltf", (gltf) => {
  root = gltf.scene;
  root.scale.set(0.01, 0.01, 0.01);
  root.position.set(sattaliteX, sattalitey, 0);
  root.rotation.x = 2;
  root.children[0].up.z = 40;
  scene.add(root);
});
///////////////////////////
const light1 = new THREE.HemisphereLight();
light1.position.set(-2, -2, -5);
scene.add(light1);
const light2 = new THREE.HemisphereLight();
light2.position.set(2, 2, 5);
scene.add(light2);
const light3 = new THREE.HemisphereLight();
light3.position.set(-2, 2, 5);
scene.add(light3);
const light4 = new THREE.HemisphereLight();
light4.position.set(-2, 2, -5);
scene.add(light4);
/////////////////////
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
////////////////////////////

const update = () => {
  if (start === 0 && root) {
    root.position.set(sattaliteX, sattalitey, 0);
  }
  if (start === 1 && sattaliteX !== NaN && sattalitey !== NaN) {
    // console.log(vx + "  " + vy + "   " + theta);

    if (
      (sattaliteX >= 0 && sattalitey >= 0) ||
      (sattaliteX >= 0 && sattalitey <= 0)
    )
      theta = (Math.atan((0 - sattalitey) / (0 - sattaliteX)) * 180) / Math.PI;
    else if (
      (sattaliteX <= 0 && sattalitey <= 0) ||
      (sattaliteX <= 0 && sattalitey >= 0)
    )
      theta =
        180 + (Math.atan((0 - sattalitey) / (0 - sattaliteX)) * 180) / Math.PI;

    r = Math.sqrt(
      Math.pow(sattaliteX * 10000 - 0, 2) + Math.pow(sattalitey * 10000 - 0, 2)
    );
    if (Math.abs(sattaliteX) > 0.85 || Math.abs(sattalitey) > 0.85) {
      forceGravity = (G * sattaliteMass * earthMass) / (Math.pow(r, 2) * 100);
      forceGravityX = -forceGravity * Math.cos((theta * Math.PI) / 180);
      forceGravityY = -forceGravity * Math.sin((theta * Math.PI) / 180);
    } else {
      vx = 0;
      vy = 0;
      forceGravity = 0;
      forceGravityX = 0;
      forceGravityY = 0;
    }
    ax = forceGravityX / sattaliteMass;
    ay = forceGravityY / sattaliteMass;
    vx += ax / 100;
    vy += ay / 100;
    sattaliteX += vx / 100000;
    sattalitey += vy / 100000;
    if (root) {
      root.position.x = sattaliteX;
      root.position.y = sattalitey;
      sattaliteX = root.position.x;
      sattalitey = root.position.y;
    }
    orbitControls.update();
    earth.rotation.y += 0.01;
    moon.rotation.y += 0.005;
    ax = 0;
    ay = 0;
  }
};
////////////////////////////
const render = () => {
  renderer.render(scene, camira);
};
//////////////////////////////
const animate = () => {
  requestAnimationFrame(animate);
  update();
  render();
};
animate();
/////////////////////////////
