LessonMap.Map = function(){
  var it = this;

  it.roots = [];

  it.width = window.innerWidth;
  it.height = window.innerHeight;

  it.position = {};
  it.position.x = it.width/2;
  it.position.y = it.height/2;

  it.positionAni = {};
  it.positionAni.x = it.width/2;
  it.positionAni.y = it.height/2;

  it.target = null;

  it.mouse = {};
  it.mouse.x = 0;
  it.mouse.y = 0;
  it.mouse.px = 0;
  it.mouse.py = 0;
  it.mouse.down = 0;
  it.mouse.up = 0;
  it.mouse.downX = 0;
  it.mouse.downY = 0;
  it.mouse.downTime = 0;
  it.mouse.pDownTime = 0;
  it.mouse.upTime = 0;

  it.canvas = document.createElement( 'canvas' );
  it.canvas.width = it.width;
  it.canvas.height = it.height;
  it.context = it.canvas.getContext( '2d' );

  it.itaPoly = new ItaPoly( 40, 40 );

  it.itaPolyThumb = new ItaPoly( 40, 40 );
  it.thumbStack = [];
  it.creatingThumb = false;

  it.mouseDescription = new MouseDescription();

  it.storage = new Storage();

  document.body.appendChild( it.canvas );
};

LessonMap.Map.prototype.loadLesson = function( _name, _callback ){
  var it = this;

  requestText( 'lessons/' + _name + '.frag', function( _frag ){
    requestText( 'lessons/' + _name + '.json', function( _json ){
      var json = JSON.parse( _json );
      var lesson = new LessonMap.Lesson( it );
      lesson.name = _name;
      lesson.title = json.title;
      lesson.description = json.description;
      lesson.shader = _frag;
      lesson.linksName = json.linksName;
      it.requestThumb( lesson );

      it.storage.get( lesson.name + '_done', function( _value ){
        if( _value ){
          lesson.done = true;
          lesson.link();
        }
      } );

      if( typeof _callback === 'function' ){
        _callback( lesson );
      }
    } );
  } );
};

LessonMap.Map.prototype.addRoot = function( _lesson ){
  var it = this;

  it.roots.push( _lesson );
};

LessonMap.Map.prototype.setTarget = function( _target ){
  var it = this;

  it.target = _target;
};

LessonMap.Map.prototype.requestThumb = function( _lesson ){
  var it = this;

  it.thumbStack.push( _lesson );
  if( !it.creatingThumb ){ it.createThumb(); }
};

LessonMap.Map.prototype.createThumb = function(){
  var it = this;

  if( it.thumbStack.length === 0 ){
    it.creatingThumb = false;
    return;
  }else{
    it.creatingThumb = true;
  }

  var lesson = it.thumbStack.shift();

  it.itaPolyThumb.createProgram( lesson.shader, function(){
    it.itaPolyThumb.beginTime = ( +new Date() );
    it.itaPolyThumb.update();
    lesson.context.drawImage( it.itaPolyThumb.canvas, 0, 0 );
    it.createThumb();
  } );
};

LessonMap.Map.prototype.update = function(){
  var it = this;

  it.context.clearRect( 0, 0, it.width, it.height );
  it.context.fillStyle = '#222222';
  it.context.fillRect( 0, 0, it.width, it.height );

  if( it.mouse.upTime < it.mouse.downTime && 200 < ( +new Date() ) - it.mouse.downTime ){
    it.target = null;
    it.position.x += it.mouse.x - it.mouse.px;
    it.position.y += it.mouse.y - it.mouse.py;
  }

  if( it.target ){
    it.position.x = it.width/2 - it.target.position.x;
    it.position.y = it.height/2 - it.target.position.y;
  }

  it.positionAni.x += ( it.position.x - it.positionAni.x ) * 0.2;
  it.positionAni.y += ( it.position.y - it.positionAni.y ) * 0.2;

  it.context.save();
  it.context.translate( it.positionAni.x, it.positionAni.y );

  var lessons = [];
  for( var i in it.roots ){
    var lesson = it.roots[ i ];
    lesson.update( lessons );
  }

  it.context.restore();

  it.mouseDescription.update();
  it.mouseDescription.hide();

  it.mouse.px = it.mouse.x;
  it.mouse.py = it.mouse.y;
  it.mouse.down = false;
  it.mouse.up = false;
};

LessonMap.Map.prototype.mousedown = function( _e ){
  var it = this;

  it.mouse.x = _e.clientX;
  it.mouse.y = _e.clientY;
  it.mouse.downX = _e.clientX;
  it.mouse.downY = _e.clientY;
  it.mouse.pDownTime = it.mouse.downTime;
  it.mouse.downTime = ( +new Date() );
  it.mouse.down = true;
};

LessonMap.Map.prototype.mousemove = function( _e ){
  var it = this;

  it.mouse.x = _e.clientX;
  it.mouse.y = _e.clientY;

  it.mouseDescription.mousemove( _e );
};

LessonMap.Map.prototype.mouseup = function( _e ){
  var it = this;

  it.mouse.upTime = ( +new Date() );
  it.mouse.up = true;
}
