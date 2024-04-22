import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
// 3D model used: Little Fox by Rachael Hosein [CC-BY] via Poly Pizza


function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 4;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, color, x, textured = false) {

		// const material = new THREE.MeshPhongMaterial( { color } );
    let material;

    if (textured) {
      function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      }

      const loader = new THREE.TextureLoader();
      material = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama1.webp')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama2.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama3.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama4.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama5.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama6.png')})
      ];
    }
    else {
      material = new THREE.MeshPhongMaterial( { color } );
    }

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

	const cubes = [
		makeInstance( geometry, 0x44aa88, 0, true ),
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
	];


  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
     mtlLoader.load('public/materials.mtl', (mtl) => {
       mtl.preload();
       objLoader.setMaterials(mtl);
     });

    objLoader.load('public/model.obj', (root) => {
      root.position.set(5, 0, 0); // Move the model 5 units to the right
      scene.add(root);
    });
    // });
  }

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();