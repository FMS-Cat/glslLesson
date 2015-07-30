// http://dev.classmethod.jp/ria/html5/html5-indexed-database-api/

var Storage = function(){
  var it = this;

  it.database = null;

  var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
  var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
  var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;
  var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

  var request = indexedDB.open( 'archives', 20150730 );

  request.onupgradeneeded = function( _event ){
    it.database = request.result;

    var store = it.database.createObjectStore( 'store', { keyPath : 'key' } );

    store.createIndex( 'valueIndex', 'value' );
  };

  request.onerror = function( _event ){
    console.error( 'Storage error' );
  };

  request.onsuccess = function( _event ){
    it.database = request.result;
  };
};

Storage.prototype.set = function( _key, _value, _callback ){
  var it = this;

  var transaction = it.database.transaction( [ 'store' ], 'readwrite' );
  var store = transaction.objectStore( 'store' );
  var request = store.put( {
    key : [ _key ],
    value : [ _value ]
  } );
  request.onsuccess = function( _event ){
    if( typeof _callback === 'function' ){
      _callback();
    }
  }
};

Storage.prototype.get = function( _key, _callback ){
  var it = this;

  var transaction = it.database.transaction( [ 'store' ], 'readwrite' );
  var store = transaction.objectStore( 'store' );
  var request = store.get( [ _key ] );
  request.onsuccess = function( _event ){
    if( typeof _callback === 'function' ){
      if( request.result ){
        _callback( request.result.value[ 0 ] );
      }
    }
  }
};

Storage.prototype.delete = function( _key, _callback ){
  var it = this;

  var transaction = it.database.transaction( [ 'store' ], 'readwrite' );
  var store = transaction.objectStore( 'store' );
  var request = store.delete( [ _key ] );
  request.onsuccess = function( _event ){
    if( typeof _callback === 'function' ){
      _callback();
    }
  }
};
