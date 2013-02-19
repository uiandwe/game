var COLS = 10, ROWS = 20;
var board = [];
var lose;
var interval;
var current, currentX, currentY;
var current_ready;
var block= [];  //생성될 객체 배열 [0] = 현재 블럭 , [1] = 다음블럭
var score = 0;
var count = 0;
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];  // todo 블럭 모양들 
    // rotate시 4*4로 인한 모서리 버그 발견 -> 향후 4*4로 변경 예정

var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

//블럭 생성
function readyShape(){
    currentPush();
    var id = Math.floor( Math.random() * shapes.length );
    block[1] = id;
    
}

//블럭 push 
function currentPush(){
    var temp = block[1];
    block[0] = temp;    
}

function newShape() {
    readyShape();
    
    var id =  block[0];
    var id_ready = block[1];
    
    var shape = shapes[ id ];
    var shape_ready = shapes[ id_ready ];

    current = [];
    current_ready = [];
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        current_ready[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
            
            
            if ( typeof shape_ready[ i ] != 'undefined' && shape_ready[ i ] ) {
                current_ready[ y ][ x ] = id_ready + 1;
            }
            else {
                current_ready[ y ][ x ] = 0;
            }
            
        }
    }
    //시작위치 4, 0 (상단 중앙)
    currentX = 4;
    currentY = 0;
}

function init() {
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
    
    //처음 블럭 배열 초기화
    var id = Math.floor( Math.random() * shapes.length );
    block[1] = id;
    
    score = 0;
}

function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
    }
    else {
        freeze();
        clearLines();
        if (lose) {
            newGame();
            return false;
        }    
        newShape();
    }
}

function freeze() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
}

function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
}

function clearLines() {
    count = 0;
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var row = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                row = false;
                break;
            }
        }
        if ( row ) {
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                    
                }
            }
            ++y;
            count++;
        }
    }
    
    score  = score + (100*count)*count;
}

function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
            }
            break;
        case 'rotate':
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
         case 'space':
             if ( valid( 0, 2 ) ) {
                currentY= (currentY-1)+(fall()-1);
            }
            break;
        
    }
}


//for문을 통해서 유효한 거리가 어느 정도인지 계산 리턴
function fall(){
    var i=2;
    
    for(;i<19; i++){
        if(valid(0, i)){
            i++;
        }else{
            break;
        }
    }
    
    return i;
}


function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;



    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    if (offsetY == 1) lose = true;
                    return false;
                }
            }
        }
    }
    return true;
}

function newGame() {
    clearInterval(interval);
    init();
    newShape();
    lose = false;
    interval = setInterval( tick, 250 );
}

newGame();