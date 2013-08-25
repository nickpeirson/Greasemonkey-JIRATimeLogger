describe("Timer", function() {
  var timer;
  var _TEN_MINS_IN_MS = 10 * 60 * 1000;
  var _TEN_MINS_IN_SECS = 10 * 60;
  
  beforeEach(function() {
	clock = sinon.useFakeTimers(new Date(2013, 8, 21, 15, 30).getTime());
    timer = new Timer();
  });

  it("will record the current time when started", function() {
	timer.start();
    expect(timer.data.startTime).toEqual(new Date(2013, 8, 21, 15, 30));
  });

  it("start time doesn't change as time passes", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    expect(timer.data.startTime).toEqual(new Date(2013, 8, 21, 15, 30));
    
  });
  
  it("will record current time when stopped", function() {
    timer.stop();
    expect(timer.data.endTime).toEqual(new Date(2013, 8, 21, 15, 30));
  });
  
  it("end time doesn't change as time passes", function() {
    timer.stop();
	clock.tick(_TEN_MINS_IN_MS);
    expect(timer.data.endTime).toEqual(new Date(2013, 8, 21, 15, 30));
  });
  
  it("elapsed time is the difference between start and stop time", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    timer.stop();
    expect(timer.elapsed()).toEqual(_TEN_MINS_IN_MS);
  });
  
  it("elapsed time can be returned in seconds", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    timer.stop();
    expect(timer.elapsedSecs()).toEqual(_TEN_MINS_IN_SECS);
  });
  
  it("elapsed time can be returned in minutes", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    timer.stop();
    expect(timer.elapsedMins()).toEqual(10);
  });
  
  it("elapsed returns zero after timer has been reset", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    timer.stop();
    timer.reset();
    expect(timer.data.endTime).toBeNull();
    expect(timer.data.startTime).toBeNull();
    expect(timer.elapsed()).toEqual(0);
  });
  
  it("timer can't be stopped twice", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
	timer.stop();
    expect(function (){ timer.stop(); }).toThrow();
  });
  
  it("once started, the timer can't be started again", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    expect(function (){ timer.start(); }).toThrow();
  });
/*
  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrow("song is already playing");
    });
  });
*/
});