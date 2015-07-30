LessonMap.Lesson = function( _map ){
  var it = this;

  it.map = _map;

  it.position = {};
  it.position.x = 0.0;
  it.position.y = 0.0;

  it.velocity = {};
  it.velocity.x = 0.0;
  it.velocity.y = 0.0;

  it.selected = false;
  it.pSelected = false;
  it.selectedAni = 0.0;

  it.name = '';
  it.title = 'Untitled';
  it.description = '----';
  it.shader = '#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform float time;void main(){gl_FragColor=vec4(0.0);}';
  it.done = false;

  it.canvas = document.createElement( 'canvas' );
  it.canvas.width = 40;
  it.canvas.height = 40;
  it.context = it.canvas.getContext( '2d' );

  it.doneSelected = false;

  it.links = [];
  it.linksName = [];

  it.map.requestThumb( it );
};

LessonMap.Lesson.prototype.link = function(){
  var it = this;

  for( var i in it.linksName ){
    var name = it.linksName[ i ];
    it.map.loadLesson( name, function( _lesson ){
      it.links.push( _lesson );
      _lesson.position.x = it.position.x + 1.0;
      _lesson.position.y = it.position.y - 0.2;
    } );
  }
};

LessonMap.Lesson.prototype.unlink = function(){
  var it = this;

  it.links = [];
};

LessonMap.Lesson.prototype.update = function( _lessons ){
  var it = this;

  it.position.x += it.velocity.x;
  it.position.y += it.velocity.y;

  it.velocity.x *= 0.8;
  it.velocity.y *= 0.8;

  if( it.done ){
    for( var i in it.links ){
      var lesson = it.links[ i ];

      var radius = Math.sqrt(
        ( lesson.position.x - it.position.x ) * ( lesson.position.x - it.position.x ) +
        ( lesson.position.y - it.position.y ) * ( lesson.position.y - it.position.y )
      );
      var theta = Math.atan2(
        ( lesson.position.y - it.position.y ),
        ( lesson.position.x - it.position.x )
      );
      it.velocity.x += Math.cos( theta ) * ( radius - 70.0 ) * 0.1;
      it.velocity.y += Math.sin( theta ) * ( radius - 70.0 ) * 0.1;
      lesson.velocity.x -= Math.cos( theta ) * ( radius - 70.0 ) * 0.1;
      lesson.velocity.y -= Math.sin( theta ) * ( radius - 70.0 ) * 0.1;

      it.map.context.strokeStyle = '#dddddd';
      it.map.context.lineWidth = 8;
      it.map.context.beginPath();
      it.map.context.moveTo( it.position.x, it.position.y );
      it.map.context.lineTo( lesson.position.x, lesson.position.y );
      it.map.context.stroke();

      lesson.update( _lessons );
    }
  }

  for( var i in _lessons ){
    var lesson = _lessons[ i ];

    var radius = Math.sqrt(
      ( lesson.position.x - it.position.x ) * ( lesson.position.x - it.position.x ) +
      ( lesson.position.y - it.position.y ) * ( lesson.position.y - it.position.y )
    );
    if( radius < 140 ){
      var theta = Math.atan2(
        ( lesson.position.y - it.position.y ),
        ( lesson.position.x - it.position.x )
      );
      it.velocity.x += Math.cos( theta ) * ( radius - 140.0 ) * 0.01;
      it.velocity.y += Math.sin( theta ) * ( radius - 140.0 ) * 0.01;
      lesson.velocity.x -= Math.cos( theta ) * ( radius - 140.0 ) * 0.01;
      lesson.velocity.y -= Math.sin( theta ) * ( radius - 140.0 ) * 0.01;
    }
  }

  _lessons.push( it );

  if( Math.sqrt(
    Math.pow( ( it.position.x + 15.0 + it.map.position.x - it.map.mouse.x ), 2.0 ) +
    Math.pow( ( it.position.y - 15.0 + it.map.position.y - it.map.mouse.y ), 2.0 )
  ) < 10.0 ){
    it.doneSelected = true;
  }else{
    it.doneSelected = false;
  }

  it.pSelected = it.selected;
  if( (
    Math.abs( it.position.x + it.map.position.x - it.map.mouse.x ) < 20 &&
    Math.abs( it.position.y + it.map.position.y - it.map.mouse.y ) < 20
  ) || ( it.selected && it.doneSelected ) ){
    it.selected = true;
    it.map.mouseDescription.setText( '<span style="font-size:14px">' + it.title + '</span><br />' + it.description );
    it.map.mouseDescription.show();
  }else{
    it.selected = false;
  }

  it.selectedAni += ( ( it.selected ? 1.0 : 0.0 ) - it.selectedAni ) * 0.2;

  // handle mouse
  if( it.selected ){
    if( it.map.mouse.down ){
      if( it.map.mouse.downTime - it.map.mouse.pDownTime < 400 ){
        it.map.target = it;

        if( typeof it.onclick === 'function' ){
          it.onclick();
        }

        var a = document.createElement( 'a' );
        a.href = location.href + '#' + it.name;
        a.target = '_blank';
        a.click();
      }else if( it.doneSelected ){
        if( it.done ){
          it.done = false;
          it.unlink();
        }else{
          it.done = true;
          it.link();
        }
        it.map.storage.set( it.name + '_done', it.done );
      }
    }
  }

  // draw rect
  it.map.context.fillStyle = '#dddddd';
  it.map.context.fillRect(
    it.position.x - 20.0 - it.selectedAni * 3.0,
    it.position.y - 20.0 - it.selectedAni * 3.0,
    40.0 + it.selectedAni * 6.0,
    40.0 + it.selectedAni * 6.0
  );

  // draw thumb
  it.map.context.drawImage(
    it.canvas,
    it.position.x - 17.0 - it.selectedAni * 3.0,
    it.position.y - 17.0 - it.selectedAni * 3.0,
    34.0 + it.selectedAni * 6.0,
    34.0 + it.selectedAni * 6.0
  )

  // draw itapoly
  if( it.selected ){
    if( !it.pSelected ){
      it.map.itaPoly.createProgram( it.shader );
      it.map.itaPoly.beginTime = ( +new Date() );
    }
    if( it.map.itaPoly.ready ){
      it.map.itaPoly.update();
    }
    it.map.context.drawImage(
      it.map.itaPoly.canvas,
      it.position.x - 17.0 - it.selectedAni * 3.0,
      it.position.y - 17.0 - it.selectedAni * 3.0,
      34.0 + it.selectedAni * 6.0,
      34.0 + it.selectedAni * 6.0
    );
  }

  // draw badge
  it.map.context.globalAlpha = it.done ? 1.0 : it.selectedAni;
  if( it.doneSelected ){
    if( it.done ){ it.map.context.fillStyle = '#dd3366'; }
    else{ it.map.context.fillStyle = '#444444'; }
  }else{
    if( it.done ){ it.map.context.fillStyle = '#33cc66'; }
    else{ it.map.context.fillStyle = '#888888'; }
  }
  it.map.context.strokeStyle = '#dddddd';
  it.map.context.lineWidth = 3;
  it.map.context.beginPath();
  var r = it.done ? 10.0 : 10.0 * it.selectedAni;
  it.map.context.arc( it.position.x + 15.0, it.position.y - 15.0, r, 0, 2*Math.PI );
  it.map.context.fill();
  it.map.context.stroke();
  it.map.context.globalAlpha = 1.0;
};
