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