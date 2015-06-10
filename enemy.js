/*var Enemy = function();
{
	this.sprite = new  Sprite("ChuckNorris.png");
	// idling left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7]);
	//jump left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[8, 9, 10, 11, 12]);
	//walk left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	//shoot left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
	//climb
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);
	//idle right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52, 53, 54, 55, 56, 57, 58, 59]);
	//jump right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[60, 61, 62, 63, 64]);
	//walk right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	//shoot right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92]);

		
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	this.position = new Vector2();
	this.position.set ( 9*TILE, 0*TILE );
	
	this.width = 159;
	this.height = 163;
	
	this.velocity = new Vector2(0,0);
	
	this.falling = true;
	this.jumping = false;
	
	this.direction = LEFT;
	
	this.cooldownTimer = 0;
};

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;
var ANIM_CLIMB = 4;
var ANIM_IDLE_RIGHT = 5;
var ANIM_JUMP_RIGHT = 6;
var ANIM_WALK_RIGHT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MAX = 9;

var ENEMY_SPEED = 300; */

var Enemy = function(x, y)
{
	this.sprite = new Sprite("bat.png");
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3, [0,1]);
	this.sprite.setAnimationOffset(0, -35, -45);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.moveRight = true;
	this.pause = 0;
}

Enemy.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	if(this.pause > 0)
	{				// suspicious
		this.pause -= (deltaTime);
	}
	else
	{
		var ddx = 0						// acceleration
		
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE;		// true if enemy overlaps right
		var ny = (this.position.y)%TILE;		// true if enemy overlaps left
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		
		if(this.moveRight)
		{
			if(celldiag && !cellright) 
			{
				ddx = ddx - ENEMY_ACCEL;		// enemy wants to go right 
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = false;
				this.pause = 0.5;
			}
		}
		
		if(!this.moveRight)
		{
			if(celldown && !cell)
			{
				ddx = ddx - ENEMY_ACCEL;		// enemy wants to go left
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}
													// here
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx),
									-ENEMY_MAXDX, ENEMY_MAXDX);
	}
}

Enemy.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX , this.position.y);
}