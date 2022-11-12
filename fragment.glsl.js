export default `#version 300 es
precision highp float;

in vec4 vColor;
out vec4 outColor;
uniform vec4 uColor;
uniform float check;

void main() {
    if (check == 1.0){
        outColor = vec4(vColor.rgb,vColor.a);
    }else if (check == 2.0){
        outColor = uColor;
    }
    
    // outColor = vec4(1,0,0,1);
    // outColor = vec4(vColor.rgb,uColor.a);
    // outColor = uColor;
}
`;