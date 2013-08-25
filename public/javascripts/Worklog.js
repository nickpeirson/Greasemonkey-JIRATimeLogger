function Worklog(issueId, token, storage, timerType)
{
    this.data = {
        issueId : issueId,
        token : token
    }
    this.reset();
    this.storage = storage;
    this.timerType = (typeof timerType === 'undefined') ? Timer : timerType;
}

Worklog.prototype.reset = function() {
    this.data.elapsedTime = null;
    this.data.currentTimer = null;
    this.data.timers = new Array();
}

Worklog.prototype.toJSON = function ()
{
    return JSON.stringify(this.data);
}

Worklog.prototype.fromJSON = function (jsonString)
{
    this.data = JSON.parse(jsonString);
}