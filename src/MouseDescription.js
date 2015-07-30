var MouseDescription = function(){
  var it = this;

  it.element = document.createElement( 'div' );
  it.element.style.position = 'fixed';
  it.element.style.whiteSpace = 'nowrap';
  it.element.style.padding = '4px';
  it.element.style.background = '#dddddd';
  it.element.style.color = '#222222';
  it.element.style.font = '600 8px/1.2 Hiragino Kaku Gothic ProN';

  it.opacity = 0.0;
  it.visibility = false;

  document.body.appendChild( it.element );
};

MouseDescription.prototype.setText = function( _text ){
  var it = this;

  it.element.innerHTML = _text;
};

MouseDescription.prototype.show = function(){
  var it = this;

  it.visibility = true;
};

MouseDescription.prototype.hide = function(){
  var it = this;

  it.visibility = false;
};

MouseDescription.prototype.update = function(){
  var it = this;

  it.opacity += ( ( it.visibility ? 0.8 : 0.0 ) - it.opacity ) * 0.4;
  it.element.style.opacity = it.opacity;
};

MouseDescription.prototype.mousemove = function( _e ){
  var it = this;

  it.element.style.left = _e.clientX + 10 + 'px';
  it.element.style.top = _e.clientY + 20 + 'px';
};
