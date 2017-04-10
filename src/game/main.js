// CONSTANTS
var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var MARGIN = 10;

var gameConfig = {
    "width": GAME_WIDTH,
    "height": GAME_HEIGHT,
    "parent": "phaser", 
    "renderer": Phaser.CANVAS,
    "resolution": window.devicePixelRatio
};

var game = new Phaser.Game(gameConfig);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');

var vue = new Vue({
	el: '#overlay',
	data: {
		start: menuState.start, 
		numEntries: 100
	}
});
