let ai = {
    snakes: {},

    getMove: function(request) {
        var snake = this.snakes[request.body.you.id];
        if(!snake) {
            snake = this.snakes[request.body.you.id] = {
                currentDirection: 'up'
            };
        }
      
        var move = snake.currentDirection;
        move = this.avoidWalls(request, snake, move);
      
        // Try to go the closest food
        if(move === snake.currentDirection) {
          move = this.huntFood(request, snake, move);
        }

        snake.currentDirection = move;
        return move;
    },
    avoidWalls(request, snake, move) {
        var {width, height} = request.body.board;
        var head = request.body.you.body[0];

        if(head.y >= height - 1 || head.y <= 0) {
            if(snake.currentDirection === 'up' || snake.currentDirection === 'down') {
                if(head.x > width / 2) {
                move = 'left';
                } else {
                move = 'right';
                }
            }
        }
            
        if(head.x >= width - 1 || head.x <= 0) {
            if(snake.currentDirection === 'left' || snake.currentDirection === 'right') {
                if(head.y > height / 2) {
                move = 'up';
                } else {
                move = 'down';
                }
            }
        }

        return move;
    },
    huntFood(request, snake, move) {
        var head = request.body.you.body[0];

        var food = request.body.board.food;
        food.sort((a, b) => {
            var aDist = Math.abs(a.x - head.x) + Math.abs(a.y - head.y);
            var bDist = Math.abs(b.x - head.x) + Math.abs(b.y - head.y);
        
            return aDist - bDist;
        });
    
        var moveTowards = food[0];
        if((snake.currentDirection === 'up' || snake.currentDirection === 'down') && moveTowards.y === head.y) {
            if(moveTowards.x > head.x) {
                move = 'right';
            } else if(moveTowards.x < head.x) {
                move = 'left';
            }
        }
    
        if((snake.currentDirection === 'right' || snake.currentDirection === 'left') && moveTowards.x === head.x) {
            if(moveTowards.y > head.y) {
                move = 'down';
            } else if(moveTowards.y < head.y) {
                move = 'up';
            }
        }

        return move;
    }
};

module.exports = ai;