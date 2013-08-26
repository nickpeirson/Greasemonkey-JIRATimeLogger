;
// ==UserScript==
// @name        JIRATimeTracker
// @namespace   nickpeirson
// @include     /^https://[a-z]+\.atlassian\.net/browse/[A-Z]+-[0-9]+/
// @version     1
// @grant       GM_addStyle
// @require     Duration.js
// @require     Timer.js
// @require     Worklog.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @require     Pubsub.jquery.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.1.0/moment.min.js
// ==/UserScript==

//token = $("meta#atlassian-token").attr('content');
token = $("input[name='atl_token']").val();
issueId = $("input[name='id']").val();

function togglePause(){
	$("div#staticpanel button#start").html('Pause').one('click',
		function() {
		    worklog.pause();
		});
}
function toggleStart(){
	$("div#staticpanel button#start").html('Start').one('click',
		function() {
		    worklog.start();
		});
}

$.subscribe(Worklog.prototype._EVENT_START, togglePause);
$.subscribe(Worklog.prototype._EVENT_PAUSE, toggleStart);

GM_addStyle ( "                                     \
    #staticpanel {                                  \
        bottom:0;                                   \
        padding:2px 0 2px;                          \
        position:fixed;                             \
        width:100%;                                 \
        z-index:100;                                \
        display: none;                            \
    }                                               \
    #stopwatch {                                    \
        border:1px solid #C3702C;                   \
        margin: 0 auto;                             \
        width:180px;                                \
        background: rgba(195, 112, 44, 0.60);       \
    }                                               \
    div#staticpanel div#elapsed {                   \
        color: rgba(255, 255, 255, 0.9);            \
        font-weight: bold;                          \
        padding-right: 2px;                         \
        width: 95px;                                \
        text-align: right;                          \
        float: right;                               \
    }                                               \
" );

startButton = '<button type="button" id="start">Start</button>';
logButton = '<button type="button" id="log">Log</button>';
elapsedDisplay = '<div id="elapsed">00h 00m 00s</span>';
$("body").append('<div id="staticpanel"><div id="stopwatch">' + 
    startButton + logButton + elapsedDisplay + '</div></div>');

$("div#staticpanel button#log").click(function() {
    try {
		worklog.log();
	    if (confirm('Continue work on this ticket?')) {
	        worklog.start();
	    }
    } catch(e) {
    	alert("Couldn't log timer:\n" + e.message);
    }
});

(function displayElapsed(){
    setTimeout(function(){
          $('div#staticpanel div#elapsed').html(worklog.elapsedSecs().toHHMMSS());
          displayElapsed();
    }, 1000);
})();

worklog = new Worklog(issueId, token, localStorage, jQuery);
worklog.load();
if (worklog.elapsed() == 0) {
	toggleStart();
}
$("div#staticpanel").toggle();