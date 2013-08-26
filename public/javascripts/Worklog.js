function Worklog(issueId, token, storage, timerType)
{
    var data = {
        issueId : issueId,
        token : token
    };
    var timerType = (typeof timerType === 'undefined') ? Timer : timerType;
    
    this.reset = function()
    {
        data.currentTimer = null;
        data.timers = new Array();
    };
    this.reset();
    
    this.getCurrentTimer = function()
    {
    	return data.currentTimer;
    };
    
    this.addTimer = function(timer)
    {
    	if (this.getCurrentTimer() != null && currentTimer.isRunning()) {
    		this.getCurrentTimer().stop();
    	}
    	data.currentTimer = timer;
    	data.timers.push(timer);
    };
    
    this.getTimerType = function()
    {
    	return timerType;
    };
    
    this.getTimers = function()
    {
    	return data.timers;
    };
};

Worklog.prototype.start = function() {
	currentTimer = this.getCurrentTimer();
	if (currentTimer == null || !currentTimer.isRunning()) {
		currentTimer = new (this.getTimerType())();
		this.addTimer(currentTimer);
	}
	currentTimer.start();
};

Worklog.prototype.pause = function() {
	currentTimer = this.getCurrentTimer();
	if (currentTimer == null) {
		throw "Can't pause a worklog that hasn't started"
	}
	if (!currentTimer.isRunning()) {
		throw "Worklog is already paused"
	}
	currentTimer.stop();
};

Worklog.prototype.elapsed = function() {
	elapsed = 0;
	for (var i = 0; i < this.getTimers().length; i++) {
		timer = this.getTimers()[i];
		elapsed += timer.elapsed();
	}
	return elapsed;
};

Worklog.prototype.toJSON = function ()
{
    return JSON.stringify(this.data);
}

Worklog.prototype.fromJSON = function (jsonString)
{
    this.data = JSON.parse(jsonString);
}

Worklog.prototype.log = function ()
{
    data = this.data;
    console.log(data);
    if (this.data.startTime == null){
        alert('No time has been recorded to log');
        return;
    }
    
    this.stop();
    startDate = moment(this.data.startTime).format("D/MMM/YY H:mm A");
    worklog = {
        "adjustEstimate" : "auto",
        "atl_token" : token,
        "comment" : "",
        "commentLevel" : "",
        "decorator" : "dialog",
        "id" : issueId,
        "inline" : "true",
        "startDate" : "" + startDate,
        "timeLogged" : "" + this.elapsedMins() + "m",
        "worklogId" : ""
    };
    console.log(worklog);
    //$.post('/secure/CreateWorklog.jspa', worklog);
    this.remove();
    if (confirm('Continue work on this ticket?')) {
        this.start();
    }
}; 