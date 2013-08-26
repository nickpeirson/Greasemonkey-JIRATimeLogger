describe("Timer", function() {
  var _TEN_MINS_IN_MS = 10 * 60 * 1000;
  var _TEN_MINS_IN_SECS = 10 * 60;
	  
  var timer;
  var clock;
  
  beforeEach(function() {
	clock = sinon.useFakeTimers(new Date(2013, 8, 21, 15, 30).getTime());
    timer = new Timer();
  });

  it("will record the current time when started", function() {
	timer.start();
    expect(timer.getStart()).toEqual(new Date(2013, 8, 21, 15, 30));
  });

  it("will report that it's not running before being started", function() {
    expect(timer.isRunning()).toBe(false);
  });

  it("will report that it's running after being started", function() {
	timer.start();
    expect(timer.isRunning()).toBe(true);
  });

  it("will report that it's running after being started", function() {
	timer.start();
	timer.stop();
    expect(timer.isRunning()).toBe(false);
  });

  it("start time doesn't change as time passes", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    expect(timer.getStart()).toEqual(new Date(2013, 8, 21, 15, 30));
    
  });
  
  it("will record current time when stopped", function() {
    timer.stop();
    expect(timer.getStop()).toEqual(new Date(2013, 8, 21, 15, 30));
  });
  
  it("end time doesn't change as time passes", function() {
    timer.stop();
	clock.tick(_TEN_MINS_IN_MS);
    expect(timer.getStop()).toEqual(new Date(2013, 8, 21, 15, 30));
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
    expect(timer.getStop()).toBeNull();
    expect(timer.getStart()).toBeNull();
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
  
  it("elapsed will be the same after serialising and deserialising", function() {
	timer.start();
	clock.tick(_TEN_MINS_IN_MS);
    timer.stop();
    elapsed = timer.elapsed();
    timerJSON = timer.toJSON();
    deserialisedTimer = new Timer();
    deserialisedTimer.fromJSON(timerJSON);
    expect(timer.elapsed()).toEqual(elapsed);
  });
});