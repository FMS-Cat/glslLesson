var Title = function(){
  var it = this;

  it.element = document.createElement( 'div' );
  it.element.style.position = 'fixed';
  it.element.style.top = '20px';
  it.element.style.left = '20px';
  it.element.style.padding = '10px';
  it.element.style.background = '#dddddd';
  it.element.style.color = '#222222';
  it.element.style.font = '800 12px/1.2 Hiragino Kaku Gothic StdN';
  it.element.style.opacity = '0.5';

  document.body.appendChild( it.element );
};

Title.prototype.setText = function( _text ){
  var it = this;

  it.element.innerHTML = _text;
};
