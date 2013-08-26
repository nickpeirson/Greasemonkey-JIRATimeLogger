function Worklog(issueId, token, storage, timerType)
{
	var that = this;
    var data = {
        issueId : issueId,
        token : token
    };
    var timerType = (typeof timerType === 'undefined') ? Timer : timerType;

    function deserialiseTimer(timerJSON) {
		timer = new (that.getTimerType())();
		timer.fromJSON(timerJSON);
		return timer;
    };
    
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
    
    this.getIssueId = function()
    {
    	return data.issueId;
    };
    
    this.getToken = function()
    {
    	return data.getToken;
    };
    
    this.addTimer = function(timer)
    {
    	if (this.getCurrentTimer() != null) {
    		if (this.getCurrentTimer().isRunning()) {
    			this.getCurrentTimer().stop();
    		}
        	data.timers.push(this.getCurrentTimer());
    	}
    	data.currentTimer = timer;
    };
    
    this.getTimerType = function()
    {
    	return timerType;
    };
    
    this.getTimers = function()
    {
    	return data.timers;
    };

    this.toJSON = function ()
    {
        return JSON.stringify(data);
    };

    this.fromJSON = function (jsonString)
    {
        data = JSON.parse(jsonString);
    	for (var i = 0; i < data.timers.length; i++) {
    		data.timers[i] = deserialiseTimer(data.timers[i]);
    	}
    	if (data.currentTimer != null) {
    		data.currentTimer = deserialiseTimer(data.currentTimer);
    	}
    	console.log(data);
    };
};

Worklog.prototype._MS_PER_SEC = 1000;
Worklog.prototype._MS_PER_MIN = 60 * 1000;

Worklog.prototype.start = function() {
	if (this.getCurrentTimer() == null
			|| !this.getCurrentTimer().isRunning()) {
		timer = new (this.getTimerType())();
		this.addTimer(timer);
	}
	this.getCurrentTimer().start();
};

Worklog.prototype.pause = function() {
	if (this.getCurrentTimer() == null) {
		throw new Error("Can't pause a worklog that hasn't started");
	}
	if (!this.getCurrentTimer().isRunning()) {
		throw new Error("Worklog is already paused");
	}
	this.getCurrentTimer().stop();
};

Worklog.prototype.elapsed = function() {
	elapsed = this.getCurrentTimer().elapsed();
	for (var i = 0; i < this.getTimers().length; i++) {
		timer = this.getTimers()[i];
		elapsed += timer.elapsed();
	}
	return elapsed;
};

Worklog.prototype.elapsedSecs = function()
{
    return Math.ceil(this.elapsed() / this._MS_PER_SEC);
};

Worklog.prototype.elapsedMins = function()
{
    return Math.ceil(this.elapsed() / this._MS_PER_MIN);
};

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

Worklog.prototype.getKey = function ()
{
    return 'worklog.'+this.getIssueId();
};

Worklog.prototype.save = function ()
{
    if (this.storage == null) {
        return;
    }
    this.storage.setItem(this.getKey(), this.toJSON());
};

Worklog.prototype.load = function (){
    if (this.storage == null) {
        return;
    }
    worklogData = this.storage.getItem(this.getKey());
    if (worklogData != null) {
        timer.fromJSON(worklogData);
    }
};

Worklog.prototype.remove = function (){
    if (this.storage == null) {
        return;
    }
    this.storage.removeItem(this.getKey());
};