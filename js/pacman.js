var PACMAN_DIRECTION = 3;
var PACMAN_DIRECTION_TRY = -1;
var PACMAN_DIRECTION_TRY_TIMER = null;
var PACMAN_DIRECTION_TRY_CANCEL = 1000;
var PACMAN_POSITION_X = 276;
var PACMAN_POSITION_Y = 416;
var PACMAN_POSITION_STEP = 2;
var PACMAN_MOUNTH_STATE = 3;
var PACMAN_MOUNTH_STATE_MAX = 6;
var PACMAN_SIZE = 16;
var PACMAN_MOVING = false;
var PACMAN_MOVING_TIMER = -1;
var PACMAN_MOVING_SPEED = 15;
var PACMAN_CANVAS_CONTEXT = null;
var PACMAN_EAT_GAP = 15;
var PACMAN_GHOST_GAP = 20;
var PACMAN_FRUITS_GAP = 15;
var PACMAN_KILLING_TIMER = -1;
var PACMAN_KILLING_SPEED = 70;
var PACMAN_RETRY_SPEED = 2100;
var PACMAN_DEAD = false;
var PACMAN_AVOID_DISTANCE = 100;
function initPacman() { 
	var canvas = document.getElementById('canvas-pacman');
	canvas.setAttribute('width', '550');
	canvas.setAttribute('height', '550');
	if (canvas.getContext) { 
		PACMAN_CANVAS_CONTEXT = canvas.getContext('2d');
	}
}
function resetPacman() { 
	stopPacman();

	PACMAN_DIRECTION = 3;
	PACMAN_DIRECTION_TRY = -1;
	PACMAN_DIRECTION_TRY_TIMER = null;
	PACMAN_POSITION_X = 276;
	PACMAN_POSITION_Y = 416;
	PACMAN_MOUNTH_STATE = 3;
	PACMAN_MOVING = false;
	PACMAN_MOVING_TIMER = -1;
	PACMAN_KILLING_TIMER = -1;
	PACMAN_DEAD = false;
	PACMAN_SUPER = false;
}
function getPacmanCanevasContext() { 
	return PACMAN_CANVAS_CONTEXT;
}

function stopPacman() { 
	if (PACMAN_MOVING_TIMER != -1) { 
		clearInterval(PACMAN_MOVING_TIMER);
		PACMAN_MOVING_TIMER = -1;
		PACMAN_MOVING = false;
	}
	if (PACMAN_KILLING_TIMER != -1) { 
		clearInterval(PACMAN_KILLING_TIMER);
		PACMAN_KILLING_TIMER = -1;
	}
}

function pausePacman() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.pause();
	}
	
	if ( PACMAN_MOVING_TIMER != -1 ) { 
		clearInterval(PACMAN_MOVING_TIMER);
		PACMAN_MOVING_TIMER = -1;
		PACMAN_MOVING = false;
	}
}
function resumePacman() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.resume();
	}
	movePacman();
}

function tryMovePacmanCancel() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.cancel();
		PACMAN_DIRECTION_TRY = -1;
		PACMAN_DIRECTION_TRY_TIMER = null;
	}
}
function tryMovePacman(direction) { 
	PACMAN_DIRECTION_TRY = direction;
	PACMAN_DIRECTION_TRY_TIMER = new Timer('tryMovePacmanCancel()', PACMAN_DIRECTION_TRY_CANCEL);
}

// function movePacman(direction) {

// 	if (PACMAN_MOVING === false) { 
// 		PACMAN_MOVING = true;
// 		drawPacman();
// 		PACMAN_MOVING_TIMER = setInterval('movePacman()', PACMAN_MOVING_SPEED);
// 	}
	
// 	var directionTry = direction;
// 	var quarterChangeDirection = false;
	
// 	if (!directionTry && PACMAN_DIRECTION_TRY != -1) { 
// 		directionTry = PACMAN_DIRECTION_TRY;
// 	}
	
// 	if ((!directionTry || PACMAN_DIRECTION !== directionTry)) { 
	
// 		if (directionTry) { 
// 			if (canMovePacman(directionTry)) { 
// 				if (PACMAN_DIRECTION + 1 === directionTry || PACMAN_DIRECTION - 1 === directionTry || PACMAN_DIRECTION + 1 === directionTry || (PACMAN_DIRECTION === 4 && directionTry === 1) || (PACMAN_DIRECTION === 1 && directionTry === 4) ) { 
// 					quarterChangeDirection = true;
// 				}
// 				PACMAN_DIRECTION = directionTry;
// 				tryMovePacmanCancel();
// 			} else { 
// 				if (directionTry !== PACMAN_DIRECTION_TRY) { 
// 					tryMovePacmanCancel();
// 				}
// 				if (PACMAN_DIRECTION_TRY === -1) { 
// 					tryMovePacman(directionTry);
// 				}
// 			}
// 		}

// 		if (canMovePacman(PACMAN_DIRECTION)) { 
// 			erasePacman();
			
// 			if (PACMAN_MOUNTH_STATE < PACMAN_MOUNTH_STATE_MAX) { 
// 				PACMAN_MOUNTH_STATE ++; 
// 			} else { 
// 				PACMAN_MOUNTH_STATE = 0; 
// 			}
						
// 			var speedUp = 0;
// 			if (quarterChangeDirection) { 
// 				speedUp = 6;
// 			}
			
// 			// if ( PACMAN_DIRECTION === 1 ) { 
// 			// 	PACMAN_POSITION_X += PACMAN_POSITION_STEP + speedUp;
// 			// } else if ( PACMAN_DIRECTION === 2 ) { 
// 			// 	PACMAN_POSITION_Y += PACMAN_POSITION_STEP + speedUp;
// 			// } else if ( PACMAN_DIRECTION === 3 ) { 
// 			// 	PACMAN_POSITION_X -= PACMAN_POSITION_STEP + speedUp;
// 			// } else if ( PACMAN_DIRECTION === 4 ) { 
// 			// 	PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP + speedUp);
// 			// }
			
// 			var safePath = findSafePath(PACMAN_POSITION_X, PACMAN_POSITION_Y, PACMAN_DIRECTION);
// 			console.log("SAFE PATHS: " + safePath)
// 			if (safePath && safePath.length > 0) {
// 				// Move Pacman to the next safe position
// 				if ( safePath[0].direction === 1 ) { 
// 					PACMAN_POSITION_X += PACMAN_POSITION_STEP + speedUp;
// 				} else if ( safePath[0].direction === 2 ) { 
// 					PACMAN_POSITION_Y += PACMAN_POSITION_STEP + speedUp;
// 				} else if ( safePath[0].direction === 3 ) { 
// 					PACMAN_POSITION_X -= PACMAN_POSITION_STEP + speedUp;
// 				} else if ( safePath[0].direction === 4 ) { 
// 					PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP + speedUp);
// 				}
// 			} else {
// 				// If no safe path is found, move Pacman in the current direction
// 				if ( PACMAN_DIRECTION === 1 ) { 
// 					PACMAN_POSITION_X += PACMAN_POSITION_STEP + speedUp;
// 				} else if ( PACMAN_DIRECTION === 2 ) { 
// 					PACMAN_POSITION_Y += PACMAN_POSITION_STEP + speedUp;
// 				} else if ( PACMAN_DIRECTION === 3 ) { 
// 					PACMAN_POSITION_X -= PACMAN_POSITION_STEP + speedUp;
// 				} else if ( PACMAN_DIRECTION === 4 ) { 
// 					PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP + speedUp);
// 				}
// 			}
			
// 			if ( PACMAN_POSITION_X === 2 && PACMAN_POSITION_Y === 258 ) { 
// 				PACMAN_POSITION_X = 548;
// 				PACMAN_POSITION_Y = 258;
// 			} else if ( PACMAN_POSITION_X === 548 && PACMAN_POSITION_Y === 258 ) { 
// 				PACMAN_POSITION_X = 2;
// 				PACMAN_POSITION_Y = 258;
// 			}

// 			drawPacman();
			
// 			if ((PACMAN_MOUNTH_STATE) === 0 || (PACMAN_MOUNTH_STATE) === 3) { 
// 				testBubblesPacman();
// 				testGhostsPacman();
// 				testFruitsPacman();
// 			}
// 		} 
// 		// else { 
// 		// 	stopPacman();
// 		// }
// 	} else if (direction && PACMAN_DIRECTION === direction) { 
// 		tryMovePacmanCancel();
// 	}
// }
   
function movePacman() {
	if (PACMAN_MOVING === false) { 
		PACMAN_MOVING = true;
		drawPacman();
		PACMAN_MOVING_TIMER = setInterval('movePacman()', PACMAN_MOVING_SPEED);
	} else { 
	
		changePacmanDirection();

		if (canMovePacman(PACMAN_DIRECTION)) { 
			erasePacman();

			if (PACMAN_MOUNTH_STATE < PACMAN_MOUNTH_STATE_MAX) { 
				PACMAN_MOUNTH_STATE ++; 
			} else { 
				PACMAN_MOUNTH_STATE = 0; 
			}

			if ( PACMAN_DIRECTION === 1 ) { 
				PACMAN_POSITION_X += PACMAN_POSITION_STEP;
			} else if ( PACMAN_DIRECTION === 2 ) { 
				PACMAN_POSITION_Y += PACMAN_POSITION_STEP;
			} else if ( PACMAN_DIRECTION === 3 ) { 
				PACMAN_POSITION_X -= PACMAN_POSITION_STEP;
			} else if ( PACMAN_DIRECTION === 4 ) { 
				PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP);
			}
			
			if ( PACMAN_POSITION_X === 2 && PACMAN_POSITION_Y === 258 ) { 
				PACMAN_POSITION_X = 548;
				PACMAN_POSITION_Y = 258;
			} else if ( PACMAN_POSITION_X === 548 && PACMAN_POSITION_Y === 258 ) { 
				PACMAN_POSITION_X = 2;
				PACMAN_POSITION_Y = 258;
			}
			
			drawPacman();
			
			if ((PACMAN_MOUNTH_STATE) === 0 || (PACMAN_MOUNTH_STATE) === 3) { 
				testBubblesPacman();
				testGhostsPacman();
				testFruitsPacman();
			}
		} else { 
			PACMAN_DIRECTION = onePacmanDirection(PACMAN_POSITION_X, PACMAN_POSITION_Y, GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y, PACMAN_DIRECTION);
			console.log("BANGGA")
		}
	}
}

function changePacmanDirectionAvoidingGhost() {
	var pacmanX = PACMAN_POSITION_X;
	var pacmanY = PACMAN_POSITION_Y;
	var ghostX = GHOST_BLINKY_POSITION_X;
	var ghostY = GHOST_BLINKY_POSITION_Y;
	var ghostDirection = GHOST_BLINKY_DIRECTION;
	var distanceX = Math.abs(pacmanX - ghostX);
	var distanceY = Math.abs(pacmanY - ghostY);
	
	if (distanceX > PACMAN_AVOID_DISTANCE && distanceY > PACMAN_AVOID_DISTANCE) {
	  // Ghost is too far away, use oneDirection()
	  PACMAN_DIRECTION = oneDirection();
	} else {
	  // Ghost is too close, try to avoid it
	  var possibleDirections = [1, 2, 3, 4];
	  var bestDirection = PACMAN_DIRECTION;
	  var bestDistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
	  
	  for (var i = 0; i < possibleDirections.length; i++) {
		var direction = possibleDirections[i];
		if (canMovePacman(direction) && (direction != ghostDirection - 2 && direction != ghostDirection + 2)) {
		  var newX = pacmanX;
		  var newY = pacmanY;
		//   if (direction === 1) {
		// 	newX += PACMAN_POSITION_STEP;
		//   } else if (direction === 2) {
		// 	newY += PACMAN_POSITION_STEP;
		//   } else if (direction === 3) {
		// 	newX -= PACMAN_POSITION_STEP;
		//   } else if (direction === 4) {
		// 	newY -= PACMAN_POSITION_STEP;
		//   }
		  var newDistanceX = Math.abs(newX - ghostX);
		  var newDistanceY = Math.abs(newY - ghostY);
		  var newDistance = Math.sqrt(Math.pow(newDistanceX, 2) + Math.pow(newDistanceY, 2));
		  if (newDistance > bestDistance) {
			bestDirection = direction;
			bestDistance = newDistance;
		  }
		}
	  }
	  
	  PACMAN_DIRECTION = bestDirection;
	}
  }



function changePacmanDirection() {
    var direction = PACMAN_DIRECTION;
    var pacmanX = PACMAN_POSITION_X;
    var pacmanY = PACMAN_POSITION_Y;
    var ghostX = GHOST_BLINKY_POSITION_X;
    var ghostY = GHOST_BLINKY_POSITION_Y;

    // Calculate the distance between Pacman and the ghost
    var distance = Math.sqrt(Math.pow(pacmanX - ghostX, 2) + Math.pow(pacmanY - ghostY, 2));

    // If the ghost is too far away, choose a random direction
    if (distance > PACMAN_AVOID_DISTANCE) {
        var tryDirection = onePacmanDirection(pacmanX, pacmanY, ghostX, ghostY, direction);
        if (canMovePacman(tryDirection)) {
            PACMAN_DIRECTION = tryDirection;
        }
        return;
    }

    // Calculate the coordinates of the tiles adjacent to Pacman
    var leftTile = { x: pacmanX - PACMAN_POSITION_STEP, y: pacmanY };
    var rightTile = { x: pacmanX + PACMAN_POSITION_STEP, y: pacmanY };
    var upTile = { x: pacmanX, y: pacmanY - PACMAN_POSITION_STEP };
    var downTile = { x: pacmanX, y: pacmanY + PACMAN_POSITION_STEP };

    // Calculate the distance between Pacman and each adjacent tile
    var leftDistance = Math.sqrt(Math.pow(leftTile.x - ghostX, 2) + Math.pow(leftTile.y - ghostY, 2));
    var rightDistance = Math.sqrt(Math.pow(rightTile.x - ghostX, 2) + Math.pow(rightTile.y - ghostY, 2));
    var upDistance = Math.sqrt(Math.pow(upTile.x - ghostX, 2) + Math.pow(upTile.y - ghostY, 2));
    var downDistance = Math.sqrt(Math.pow(downTile.x - ghostX, 2) + Math.pow(downTile.y - ghostY, 2));

    // Choose the direction that maximizes the distance to the ghost
    var maxDistance = Math.max(leftDistance, rightDistance, upDistance, downDistance);
    if (maxDistance === leftDistance && canMovePacman(3)) {
        PACMAN_DIRECTION = 3;
    } else if (maxDistance === rightDistance && canMovePacman(1)) {
        PACMAN_DIRECTION = 1;
    } else if (maxDistance === upDistance && canMovePacman(4)) {
        PACMAN_DIRECTION = 4;
    } else if (maxDistance === downDistance && canMovePacman(2)) {
        PACMAN_DIRECTION = 2;
    }
}


function onePacmanDirection(pacmanX, pacmanY, ghostX, ghostY, currentDirection) { 
	var distances = [];
	var directions = [];

	// Calculate the distance between Pacman and the ghost for each direction
	if (canMovePacman(1) && currentDirection != 3) { // right
		distances.push(distance(pacmanX + PACMAN_POSITION_STEP, pacmanY, ghostX, ghostY));
		directions.push(1);
	}
	if (canMovePacman(2) && currentDirection != 4) { // down
		distances.push(distance(pacmanX, pacmanY + PACMAN_POSITION_STEP, ghostX, ghostY));
		directions.push(2);
	}
	if (canMovePacman(3) && currentDirection != 1) { // left
		distances.push(distance(pacmanX - PACMAN_POSITION_STEP, pacmanY, ghostX, ghostY));
		directions.push(3);
	}
	if (canMovePacman(4) && currentDirection != 2) { // up
		distances.push(distance(pacmanX, pacmanY - PACMAN_POSITION_STEP, ghostX, ghostY));
		directions.push(4);
	}

	// Sort the directions by distance
	var sortedDirections = [];
	while (distances.length > 0) {
		var minIndex = 0;
		for (var i = 1; i < distances.length; i++) {
			if (distances[i] < distances[minIndex]) {
				minIndex = i;
			}
		}
		sortedDirections.push(directions[minIndex]);
		distances.splice(minIndex, 1);
		directions.splice(minIndex, 1);
	}

	// Choose a random direction among the farthest ones
	var numFarthestDirections = Math.min(sortedDirections.length, 2);
	var randomIndex = Math.floor(Math.random() * numFarthestDirections);
	return sortedDirections[randomIndex];
}

// Helper function to calculate distance between two points
function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function getRightDirection(axe, pacmanX, pacmanY , ghostX, ghostY) { 
	if (axe === 1) { 
		if (ghostX > pacmanX) { 
		 return 3;
		} else { 
			return 1;
		}
	} else { 
		if (ghostY > pacmanY) { 
		 return 4;
		} else { 
			return 2;
		}
	}
}

function canMovePacman(direction) { 
	
	var positionX = PACMAN_POSITION_X;
	var positionY = PACMAN_POSITION_Y;
	
	if (positionX === 276 && positionY === 204 && direction === 2) return false;
	
	if ( direction === 1 ) { 
		positionX += PACMAN_POSITION_STEP;
	} else if ( direction === 2 ) { 
		positionY += PACMAN_POSITION_STEP;
	} else if ( direction === 3 ) { 
		positionX -= PACMAN_POSITION_STEP;
	} else if ( direction === 4 ) { 
		positionY -= PACMAN_POSITION_STEP;
	}
	
	for (var i = 0, imax = PATHS.length; i < imax; i ++) { 
	
		var p = PATHS[i];
		var c = p.split("-");
		var cx = c[0].split(",");
		var cy = c[1].split(",");
	
		var startX = cx[0];
		var startY = cx[1];
		var endX = cy[0];
		var endY = cy[1];

		if (positionX >= startX && positionX <= endX && positionY >= startY && positionY <= endY) { 
			return true;
		}
	}
	
	return false;
}

function drawPacman() { 

	var ctx = getPacmanCanevasContext();
	
	ctx.fillStyle = "#fff200";
	ctx.beginPath();
	
	var startAngle = 0;
	var endAngle = 2 * Math.PI;
	var lineToX = PACMAN_POSITION_X;
	var lineToY = PACMAN_POSITION_Y;
	if (PACMAN_DIRECTION === 1) { 
		startAngle = (0.35 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (1.65 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToX -= 8;
	} else if (PACMAN_DIRECTION === 2) { 
		startAngle = (0.85 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (0.15 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToY -= 8;
	} else if (PACMAN_DIRECTION === 3) { 
		startAngle = (1.35 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (0.65 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToX += 8;
	} else if (PACMAN_DIRECTION === 4) { 
		startAngle = (1.85 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (1.15 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToY += 8;
	}
	ctx.arc(PACMAN_POSITION_X, PACMAN_POSITION_Y, PACMAN_SIZE, startAngle, endAngle, false);
	ctx.lineTo(lineToX, lineToY);
	ctx.fill();
	ctx.closePath();
}

function erasePacman() { 

	var ctx = getPacmanCanevasContext();
	ctx.clearRect( (PACMAN_POSITION_X - 2) - PACMAN_SIZE, (PACMAN_POSITION_Y - 2) - PACMAN_SIZE, (PACMAN_SIZE * 2) + 5, (PACMAN_SIZE * 2) + 5);
}

function killPacman() { 
	playDieSound();

	LOCK = true;
	PACMAN_DEAD = true;
	stopPacman();
	stopGhosts();
	pauseTimes();
	stopBlinkSuperBubbles();
	PACMAN_KILLING_TIMER = setInterval('killingPacman()', PACMAN_KILLING_SPEED);
}
function killingPacman() { 
	if (PACMAN_MOUNTH_STATE > -12) { 
		erasePacman();
		PACMAN_MOUNTH_STATE --;
		drawPacman();
	} else { 
		clearInterval(PACMAN_KILLING_TIMER);
		PACMAN_KILLING_TIMER = -1;
		erasePacman();
		if (LIFES > 0) { 
			lifes(-1);
			setTimeout('retry()', (PACMAN_RETRY_SPEED));
		} else { 
			gameover();
		}
	}
}

function testGhostsPacman() { 
	testGhostPacman();
	// testGhostPacman('blinky');
	// testGhostPacman('pinky');
	// testGhostPacman('inky');
	// testGhostPacman('clyde');

}
function testGhostPacman() { 
	var positionX = GHOST_BLINKY_POSITION_X
	var positionY = GHOST_BLINKY_POSITION_Y
	// eval('var positionX = GHOST_BLINKY_POSITION_X');
	// eval('var positionY = GHOST_BLINKY_POSITION_Y');
		
	if (positionX <= PACMAN_POSITION_X + PACMAN_GHOST_GAP && positionX >= PACMAN_POSITION_X - PACMAN_GHOST_GAP && positionY <= PACMAN_POSITION_Y + PACMAN_GHOST_GAP && positionY >= PACMAN_POSITION_Y - PACMAN_GHOST_GAP ) { 
		var state = GHOST_BLINKY_STATE
		if (state === 0) { 
			killPacman();
		} else if (state === 1) { 
			startEatGhost();
		}
	}
}
function testFruitsPacman() { 
	
	if (FRUIT_CANCEL_TIMER != null) { 
		if (FRUITS_POSITION_X <= PACMAN_POSITION_X + PACMAN_FRUITS_GAP && FRUITS_POSITION_X >= PACMAN_POSITION_X - PACMAN_FRUITS_GAP && FRUITS_POSITION_Y <= PACMAN_POSITION_Y + PACMAN_FRUITS_GAP && FRUITS_POSITION_Y >= PACMAN_POSITION_Y - PACMAN_FRUITS_GAP ) { 
			eatFruit();
		}
	}
}
function testBubblesPacman() { 
	
	var r = { x: PACMAN_POSITION_X - ( PACMAN_SIZE / 2 ), y: PACMAN_POSITION_Y - ( PACMAN_SIZE / 2 ) , width: ( PACMAN_SIZE * 2 ), height: ( PACMAN_SIZE * 2 ) };
		
	for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i ++) { 
		var bubble = BUBBLES_ARRAY[i];
		
		var bubbleParams = bubble.split( ";" );
		var testX = parseInt(bubbleParams[0].split( "," )[0]);
		var testY = parseInt(bubbleParams[0].split( "," )[1]);
		var p = { x: testX, y: testY };
		
		if ( isPointInRect( p, r ) ) { 
			
			if ( bubbleParams[4] === "0" ) { 
				var type = bubbleParams[3];
							
				eraseBubble( type, testX, testY );
				BUBBLES_ARRAY[i] = bubble.substr( 0, bubble.length - 1 ) + "1"
				
				if ( type === "s" ) { 
					setSuperBubbleOnXY( testX, testY, "1" );
					score( SCORE_SUPER_BUBBLE );
					playEatPillSound();
					// affraidGhosts();
					afraidGhosts();
				} else { 
					score( SCORE_BUBBLE );
					playEatingSound();
				}
				BUBBLES_COUNTER --;
				if ( BUBBLES_COUNTER === 0 ) { 
					win();
				}
			} else { 
				stopEatingSound();
			}
			return;
		}
	}
}