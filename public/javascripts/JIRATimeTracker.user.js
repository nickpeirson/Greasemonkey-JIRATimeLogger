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
// @require     http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.1.0/moment.min.js
// ==/UserScript==

//token = $("meta#atlassian-token").attr('content');
token = $("input[name='atl_token']").val()
issueId = $("input[name='id']").val()

timer = new Timer(issueId, token, localStorage);
timer.load();

GM_addStyle ( "                                     \
    #staticpanel {                                  \
        bottom:0;                                   \
        padding:2px 0 2px;                          \
        position:fixed;                             \
        width:100%;                                 \
        z-index:100;                                \
    }                                               \
    #stopwatch {                                    \
        border:1px solid #C3702C;                   \
        margin: 0 auto;                             \
        width:200px;                                \
        background: rgba(195, 112, 44, 0.60);       \
    }                                               \
    div#staticpanel span#elapsed {                  \
        color: rgba(255, 255, 255, 0.9);            \
        font-weight: bold;                          \
        padding-left: 5px;                          \
    }                                               \
" );

startButton = '<button type="button" id="start">Start</button>';
stopButton = '<button type="button" id="stop">Stop</button>';
logButton = '<button type="button" id="log">Log</button>';
elapsedDisplay = '<span id="elapsed"></span>';
$("body").append('<div id="staticpanel"><div id="stopwatch">' + 
    startButton + stopButton + logButton + elapsedDisplay + '</div></div>');

$("div#staticpanel button#start").click(function() {
    timer.start()
});
$("div#staticpanel button#stop").click(function() {
    timer.stop()
});
$("div#staticpanel button#log").click(function() {
    timer.log();
});

(function displayElapsed(){
    setTimeout(function(){
          $('div#staticpanel span#elapsed').html(timer.elapsedSecs().toHHMMSS());
          displayElapsed();
    }, 1000);
})();
