var loadState = {
	preload: function() {
		// loading screen
	},

	create: function() {
		$.get('assets/frequency-list.txt', function(data) {
			game.frequencyList = JSON.parse(data);
			game.state.start('menu');
		});
	}
}