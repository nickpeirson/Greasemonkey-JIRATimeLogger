;function Worklog(issueId, token, storage, pubSub, timerType)
{
	var that = this;
    var data = {
        issueId : issueId,
        token : token
    };
    var pubSub = (typeof pubSub === 'undefined') ? { publish : function(){} } : pubSub;
    var timerType = (typeof timerType === 'undefined') ? Timer : timerType;

    function deserialiseTimer(timerJSON) {
		timer = new (that.getTimerType())();
		timer.fromJSON(timerJSON);
		return timer;
    };
    
    this.publish = function(e)
    {
    	return pubSub.publish(e);
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
    
    this.getStorage = function()
    {
        if (storage == null) {
            return {
            	getItem : function (){},
            	setItem : function (){},
            	removeItem : function (){},
            };
        }
    	return storage;
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
        started = false;
    	for (var i = 0; i < data.timers.length; i++) {
    		data.timers[i] = deserialiseTimer(data.timers[i]);
    		if (!started && data.timers[i].isRunning()) {
    			started = true;
    		}
    	}
    	if (data.currentTimer != null) {
    		data.currentTimer = deserialiseTimer(data.currentTimer);
    		if (!started && data.currentTimer.isRunning()) {
    			started = true;
    		}
    	}
    	if (started) {
    	    this.publish( this._EVENT_START );
    	} else {
    	    this.publish( this._EVENT_PAUSE );
    	}
    };
};

Worklog.prototype._MS_PER_SEC = 1000;
Worklog.prototype._MS_PER_MIN = 60 * 1000;
Worklog.prototype._EVENT_START = 'worklog/start';
Worklog.prototype._EVENT_PAUSE = 'worklog/pause';

Worklog.prototype.start = function() {
	if (this.getCurrentTimer() == null
			|| !this.getCurrentTimer().isRunning()) {
		timer = new (this.getTimerType())();
		this.addTimer(timer);
	}
	this.getCurrentTimer().start();
    this.save();
    this.publish( this._EVENT_START );
};

Worklog.prototype.pause = function() {
	if (this.getCurrentTimer() == null) {
		throw new Error("Can't pause a worklog that hasn't started");
	}
	if (!this.getCurrentTimer().isRunning()) {
		return;
	}
	this.getCurrentTimer().stop();
    this.save();
    this.publish( this._EVENT_PAUSE );
};

Worklog.prototype.elapsed = function() {
	elapsed = 0;
	if (this.getCurrentTimer() != null) {
		elapsed = this.getCurrentTimer().elapsed();
	}
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

Worklog.prototype.getStart = function()
{
	if (this.getTimers().length > 0) {
		return this.getTimers()[0].getStart();
	}
	if (this.getCurrentTimer() != null) {
		return this.getCurrentTimer().getStart();
	}
	throw new Error('Must be started to get the start timer');
};

Worklog.prototype.log = function ()
{
    if (this.elapsed() == 0){
        throw new Error('No time has been recorded to log');
    }
    
    this.pause();
    startDate = moment(this.getStart()).format("D/MMM/YY H:mm A");
    JIRAworklog = {
        "adjustEstimate" : "auto",
        "atl_token" : this.getToken(),
        "comment" : "",
        "commentLevel" : "",
        "decorator" : "dialog",
        "id" : this.getIssueId(),
        "inline" : "true",
        "startDate" : "" + startDate,
        "timeLogged" : "" + this.elapsedMins() + "m",
        "worklogId" : ""
    };
    console.log(JIRAworklog);
    //$.post('/secure/CreateWorklog.jspa', JIRAworklog);
    this.reset();
};

Worklog.prototype.getKey = function ()
{
    return 'worklog.'+this.getIssueId();
};

Worklog.prototype.save = function ()
{
    this.getStorage().setItem(this.getKey(), this.toJSON());
};

Worklog.prototype.load = function (){
    worklogData = this.getStorage().getItem(this.getKey());
    if (worklogData != null) {
        this.fromJSON(worklogData);
    }
};

Worklog.prototype.remove = function (){
    this.getStorage().removeItem(this.getKey());
    this.reset();
};