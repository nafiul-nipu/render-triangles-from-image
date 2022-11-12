import vertexShaderSrc from './vertex.glsl.js';
import fragmentShaderSrc from './fragment.glsl.js'
import {initialize} from './graphics.webgl.js'

// console.log(vertexShaderSrc)
// console.log(fragmentShaderSrc)
// console.log('first line of the module js')

let fileLoaded = false;
let data = null;
const checkbox = document.querySelector('#toggleCheck');

document.querySelector('#rSlider').addEventListener('input', updateRGB)
document.querySelector('#gSlider').addEventListener('input', updateRGB)
document.querySelector('#bSlider').addEventListener('input', updateRGB)

document.querySelector('#triangles').addEventListener('input', updateTri)

document.querySelector('#toggleCheck').addEventListener('change', checkBoxChange);

//  load the file
document.querySelector('#fileInput')
    .addEventListener('change', fileInput)


function fileInput(event){
    // console.log('file input')
    let file = event.target.files[0]
    let reader = new FileReader()

    reader.onload = function(e){
        console.log("file loaded")
        // console.log(e.target.result)
        data = JSON.parse(e.target.result)

        // console.log(data.hasOwnProperty('positions'))
        // console.log(data)

        if(data.hasOwnProperty('positions') && data.hasOwnProperty('colors')){
            let totalTriangles = Math.round(data.positions.length / 9)

            // updating the triangles information
            document.getElementById('triangles').max = totalTriangles
            document.getElementById('triangles').value = totalTriangles
            document.getElementById('tri').innerHTML = totalTriangles
            // console.log(data)
            // console.log(data.positions.length / 3)
    
            let rVal = document.getElementById('rSlider').value;
            let gVal = document.getElementById('gSlider').value;
            let bVal = document.getElementById('bSlider').value;
    
            let newColor = [+rVal / 255, +gVal / 255, +bVal / 255, 1]
            // console.log(newColor)
    
            if(checkbox.checked){
                // json file
                initialize(data, totalTriangles, newColor)
            }else{
                // RGB
                initialize(data, totalTriangles, newColor, 'slider')
            }
    
            fileLoaded = true;

        }else{
            fileLoaded = false;
            alert("file does not follow the specified format. Choose another file")
        }


    }
    
    // console.log('read')
    reader.readAsText(file)
}




function updateRGB(){
    let rVal = document.getElementById('rSlider').value;
    let gVal = document.getElementById('gSlider').value;
    let bVal = document.getElementById('bSlider').value;

    let newColor = [+rVal / 255, +gVal / 255, +bVal / 255, 1]
    // console.log(newColor)

    document.getElementById('rValue').innerHTML = rVal
    document.getElementById('gValue').innerHTML = gVal
    document.getElementById('bValue').innerHTML = bVal

    if(fileLoaded){
        
        if(!checkbox.checked){
            // color change according to the value
            let tri = document.getElementById('triangles').value;
            initialize(data, tri, newColor, 'slider')

        }else{
            // document.getElementById('rSlider').value = initr 
            // document.getElementById('gSlider').value = initg 
            // document.getElementById('bSlider').value = initb 

            alert("To see the effect Uncheck the Json File Checkbox")       
            
        }

    }else{
        alert("upload a file first")
    }


    
}

function updateTri(){
    let tri = document.getElementById('triangles').value;

    document.getElementById('tri').innerHTML = tri

    let rVal = document.getElementById('rSlider').value;
    let gVal = document.getElementById('gSlider').value;
    let bVal = document.getElementById('bSlider').value;

    let newColor = [+rVal / 255, +gVal / 255, +bVal / 255, 1];

    if(fileLoaded){
        if(checkbox.checked){
            initialize(data, tri, newColor)
        }else{

            initialize(data, tri, newColor, 'slider')
        }

        

    }else{
        // document.getElementById('triangles').value = initT 

        alert('Please upload a file first')
        
    }

}

function checkBoxChange(){
    // console.log(checkbox.checked);
    let rVal = document.getElementById('rSlider').value;
    let gVal = document.getElementById('gSlider').value;
    let bVal = document.getElementById('bSlider').value;

    let newColor = [+rVal / 255, +gVal / 255, +bVal / 255, 1];

    let tri = document.getElementById('triangles').value;


    if(checkbox.checked){
        // json file
        initialize(data, tri, newColor)

    }else{
        // RGB
        initialize(data, tri, newColor, 'slider')
    }
}

