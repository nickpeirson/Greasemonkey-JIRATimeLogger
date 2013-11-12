describe("Worklog", function() {
	var _TEN_MINS_IN_MS = 10 * 60 * 1000;
	var _TEN_MINS_IN_SECS = 10 * 60;
	var _INIT_DATE = new Date(2013, 8, 21, 15, 30);

	var worklog;
	var clock;

	beforeEach(function() {
		clock = sinon.useFakeTimers(_INIT_DATE.getTime());
		worklog = new Worklog();
	});

	it("will record the passage of time once started", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		expect(worklog.elapsed()).toBeGreaterThan(0);
	});

	it("will not start when already running", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		expect(function() {
			worklog.start();
		}).toThrow();
	});

	it("can't be paused before being started", function() {
		expect(function() {
			worklog.pause();
		}).toThrow();
	});

	it("will not record the passage of time when paused", function() {
		worklog.start();
		worklog.pause();
		elapsedAtPause = worklog.elapsed();
		clock.tick(_TEN_MINS_IN_MS);
		expect(worklog.elapsed()).toEqual(elapsedAtPause);
	});

	it("will start recording time again when unpaused", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.pause();
		elapsedAtPause = worklog.elapsed();
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		expect(worklog.elapsed()).toBeGreaterThan(elapsedAtPause);
	});

	it("will record the correct amount of time when paused an unpaused multiple times", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.pause();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.pause();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		expect(worklog.elapsed()).toEqual(3 * _TEN_MINS_IN_MS);
	});
	  
	  it("will return elapsed time in seconds", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
	    expect(worklog.elapsedSecs()).toEqual(_TEN_MINS_IN_SECS);
	  });
	  
	  it("will return elapsed time in minutes", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
	    expect(worklog.elapsedMins()).toEqual(10);
	  });
	  
	  it("will have zero elapsed time before it's started", function() {
	    expect(worklog.elapsed()).toEqual(0);
	  });
	  
	  it("elapsed will be the same after serialising and deserialising", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.pause();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.pause();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
	    elapsedBeforeSerialise = worklog.elapsed();
	    worklogJSON = worklog.toJSON();
	    deserialisedWorklog = new Worklog();
	    deserialisedWorklog.fromJSON(worklogJSON);
	    expect(deserialisedWorklog.elapsed()).toEqual(elapsedBeforeSerialise);
	  });
	  
	  it("will publish a 'worklog/start' event when deserialising a running timer", function() {
		worklogJSON = '{"currentTimer":"{\\"startTime\\":\\"2013-09-21T14:30:00.000Z\\",\\"stopTime\\":null,\\"elapsedTime\\":null}","timers":[]}';
		spyOn(worklog, 'publish');
	    worklog.fromJSON(worklogJSON);
		expect(worklog.publish).toHaveBeenCalledWith(worklog._EVENT_START);
	  });
	  
	  it("will publish a 'worklog/pause' event when deserialising a paused timer", function() {
		worklogJSON = '{"currentTimer":"{\\"startTime\\":\\"2013-09-21T14:30:00.000Z\\",\\"stopTime\\":\\"2013-09-21T14:30:00.000Z\\",\\"elapsedTime\\":null}","timers":[]}';
		spyOn(worklog, 'publish');
	    worklog.fromJSON(worklogJSON);
		expect(worklog.publish).toHaveBeenCalledWith(worklog._EVENT_PAUSE);
	  });
	  
	  it("will save when started", function() {
		spyOn(worklog, 'save');
		worklog.start();
		expect(worklog.save).toHaveBeenCalled();
	  });
	  
	  it("will save when paused", function() {
		spyOn(worklog, 'save');
		worklog.start();
		worklog.pause();
		expect(worklog.save.calls.length).toEqual(2);
	  });
	  
	  it("will save when reset", function() {
		spyOn(worklog, 'save');
		worklog.reset();
		expect(worklog.save).toHaveBeenCalled();
	  });
	  
	  it("will publish a 'worklog/start' event when the worklog is started", function() {
		spyOn(worklog, 'publish');
		worklog.start();
		expect(worklog.publish).toHaveBeenCalledWith('worklog/start');
	  });
	  
	  it("will publish a 'worklog/pause' event when the worklog is paused", function() {
		spyOn(worklog, 'publish');
		worklog.start();
		worklog.pause();
		expect(worklog.publish).toHaveBeenCalledWith('worklog/pause');
	  });
	  
	  it("will throw an exception if you try to get the start time before starting", function() {
		expect(function() {
			worklog.getStart();
		}).toThrow();
	  });
	  
	  it("will return the time from when the worklog was first started", function() {
		worklog.start();
		expect(worklog.getStart()).toEqual(_INIT_DATE);
	  });
	  
	  it("will return the time from when the worklog was first started after being paused", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.pause();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.start();
		expect(worklog.getStart()).toEqual(_INIT_DATE);
	  });
	  
	it("will throw an error if you try to log with no time on the worklog", function() {
		expect(function() {
			worklog.log();
		}).toThrow();
	});
	
	it("will pause and reset the worklog after logging", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.log();
		clock.tick(_TEN_MINS_IN_MS);
		expect(worklog.elapsed()).toEqual(0);
	});
	
	it("can be restarted after logging time", function() {
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		worklog.log();
		worklog.start();
		clock.tick(_TEN_MINS_IN_MS);
		expect(worklog.elapsed()).toEqual(_TEN_MINS_IN_MS);
	});
});