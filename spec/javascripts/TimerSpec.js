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