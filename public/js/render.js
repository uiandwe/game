var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var canvas_ready = document.getElementById('ready');

var ctx_ready=canvas_ready.getContext('2d');
var ctx = canvas.getContext( '2d' );


var W = 300, H = 600;
var W_ready = 150, H_ready = 150;

var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
//var BLOCK_W_ready = W_ready / COLS, BLOCK_H_ready = H_ready / ROWS;

// fillRect 사각형 그리기(각 블럭 색상에 맞게)
// strockeRect 사각형 테두리 그리기(black)
function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

function drawReadyBlock( x, y ) {
    ctx_ready.fillRect( BLOCK_W+30 * x, BLOCK_H+30 * y, BLOCK_W - 1 , BLOCK_H- 1 );
    ctx_ready.strokeRect( BLOCK_W+30 * x, BLOCK_H+30 * y, BLOCK_W - 1 , BLOCK_H - 1 );
}



function render() {
    
    
    ctx.clearRect( 0, 0, W, H );
    ctx_ready.clearRect( 0, 0, W_ready, H_ready );
    
    
    ctx.strokeStyle = 'black';
    ctx_ready.strokeStyle = 'black';
    //떨어진 블럭 색상 그리기
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawBlock( x, y );
            }
        }
    }
   
   
   //선택된 객체 색상 그리기
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                drawBlock( currentX + x, currentY + y );
            }
            
            if ( current_ready[ y ][ x ] ) {
                ctx_ready.fillStyle = colors[ current_ready[ y ][ x ] - 1 ];
                drawReadyBlock(x , y );
            }
        }
    }
}

setInterval( render, 30 );