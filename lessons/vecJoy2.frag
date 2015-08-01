#ifdef GL_ES
precision mediump float;
#endif

void main(){
  vec3 v = vec3( 0.0 );
  vec3 v2 = vec3( 0.0, 0.5, 1.0 );

  v += v2;
  v *= 0.5;

  gl_FragColor = vec4( v, 1.0 );
}
