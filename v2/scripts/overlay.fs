#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;

void main(void) {

        vec2 p = gl_FragCoord.xy / resolution.xy;
        float darkness = 3.45;
        vec2 textureCoords = p - 0.5;
        float vignette = 1.0 - (dot(textureCoords, textureCoords) * darkness);
        gl_FragColor= vec4(vignette, vignette, vignette, 1.0-vignette);
	gl_FragColor=vec4(1,0,0,1);
} 