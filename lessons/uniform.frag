#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265

uniform float time;

void main(){
  gl_FragColor = vec4(
    sin( time * PI ) * 0.5 + 0.5, // r
    0.0, // g
    0.0, // b
    1.0 // a
  );
}
