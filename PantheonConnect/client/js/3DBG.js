import * as THREE from 'three';

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1 ); 
const material = new THREE.MeshBasicMaterial({
    color: "#000000",
    });
const mesh = new Three.Mesh( geometry, material );
const cube = new THREE.Mesh( geometry, material ); 
scene.add(cube);

const camera = new THREE.PerspectiveCamera(50, 800,600);
scene.add(camera);

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setSize(800, 600);
renderer.render(scene, camera);
