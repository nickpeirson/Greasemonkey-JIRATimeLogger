describe("Worklog", function() {
	var _TEN_MINS_IN_MS = 10 * 60 * 1000;
	var _TEN_MINS_IN_SECS = 10 * 60;

	var worklog;
	var clock;

	beforeEach(function() {
		clock = sinon.useFakeTimers(new Date(2013, 8, 21, 15, 30).getTime());
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
});