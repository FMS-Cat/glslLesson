#ifdef GL_ES
precision mediump float;
#endif

void main(){
  vec3 v = vec3( 0.0, 0.5, 1.0 );
  gl_FragColor = v.zyxz;
}
