function Timer()
{
    var data = {};
    this.reset = function() {
        data.startTime = null;
        data.stopTime = null;
        data.elapsedTime = null;
    };
    this.reset();
    
    this.setStart = function (start) {
    	data.startTime = start;
    };
    
    this.getStart = function () {
    	return data.startTime;
    };
    
    this.setStop = function (stop) {
    	data.stopTime = stop;
    };
    
    this.getStop = function () {
    	return data.stopTime;
    };
    
    this.setElapsed = function (elapsed) {
    	data.elapsedTime = elapsed;
    };
    
    this.getElapsed = function () {
    	return data.elapsedTime;
    };

    this.toJSON = function ()
    {
        return JSON.stringify(data);
    };

    this.fromJSON = function (jsonString)
    {
        data = JSON.parse(jsonString);
        if (data.startTime != null) {
            data.startTime = new Date(data.startTime);
        }
        if (data.endTime != null) {
            data.endTime = new Date(data.endTime);
        }
    };
}

Timer.prototype.start = function ()
{
	if (this.getStart() != null) {
		throw new Error("Timer has already been started");
	}
    this.setStart(new Date());
    this.setElapsed(null);
    this.save();
};

Timer.prototype.stop = function ()
{
	if (this.getStop() != null) {
		throw new Error("Timer has already been stopped");
	}
    this.setStop(new Date());
    this.setElapsed(this.elapsed());
    this.save();
};

Timer.prototype.isRunning = function ()
{
	return !(this.getStart() == null || this.getStop() != null);
};

Timer.prototype.elapsed = function ()
{
    if (this.getElapsed() != null) {
        return this.getElapsed();
    }
    
    endTime = this.getStop();
    startTime = this.getStart();
    if (startTime == null && endTime == null) {
        return 0;
    }
    
    if (endTime == null) {
        endTime = new Date();
    } 
    if (startTime == null) {
        startTime = new Date();
    }
    elapsed = endTime - this.getStart();
    if (!this.isRunning()) {
    	this.setElapsed(elapsed);
    }
    return elapsed;
};