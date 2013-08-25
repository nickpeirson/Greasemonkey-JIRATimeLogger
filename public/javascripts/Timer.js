function Timer(dateType)
{
    this.data = {};
    this.reset();
}

Timer.prototype._MS_PER_SEC = 1000;
Timer.prototype._MS_PER_MIN = 60 * 1000;

Timer.prototype.reset = function() {
    this.data.startTime = null;
    this.data.endTime = null;
    this.data.elapsedTime = null;
};

Timer.prototype.toJSON = function ()
{
    return JSON.stringify(this.data);
};

Timer.prototype.fromJSON = function (jsonString)
{
    this.data = JSON.parse(jsonString);
    if (this.data.startTime != null) {
        this.data.startTime = new Date(this.data.startTime);
    }
    if (this.data.endTime != null) {
        this.data.endTime = new Date(this.data.endTime);
    }
};

Timer.prototype.start = function ()
{
	if (this.data.startTime != null) {
		throw "Timer has already been started";
	}
    this.data.startTime = new Date();
    this.data.elapsedTime = null;
    this.save();
};

Timer.prototype.getKey = function ()
{
    return 'timer.'+this.data.issueId;
};

Timer.prototype.save = function ()
{
    if (this.storage == null) {
        return;
    }
    this.storage.setItem(this.getKey(), this.toJSON());
};

Timer.prototype.load = function (){
    if (this.storage == null) {
        return;
    }
    timerData = this.storage.getItem(this.getKey());
    console.log(timerData);
    if (timerData != null) {
        timer.fromJSON(timerData);
    }
};

Timer.prototype.remove = function (){
    if (this.storage == null) {
        return;
    }
    this.storage.removeItem(this.getKey());
};

Timer.prototype.stop = function ()
{
	if (this.data.elapsedTime != null) {
		throw "Timer has already been stopped";
	}
    this.data.endTime = new Date();
    this.data.elapsedTime = this.elapsed();
    this.save();
};

Timer.prototype.elapsed = function ()
{
    if (this.data.elapsedTime != null) {
        return this.data.elapsedTime;
    }
    
    endTime = this.data.endTime;
    startTime = this.data.startTime;
    if (startTime == null && endTime == null) {
        return 0;
    }
    
    if (endTime == null) {
        endTime = new Date();
    } 
    if (startTime == null) {
        startTime = new Date();
    }
    return endTime - this.data.startTime;
};

Timer.prototype.elapsedSecs = function()
{
    return Math.ceil(this.elapsed() / this._MS_PER_SEC);
};

Timer.prototype.elapsedMins = function()
{
    return Math.ceil(this.elapsed() / this._MS_PER_MIN);
};