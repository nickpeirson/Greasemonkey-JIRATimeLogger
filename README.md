Greasemonkey-JIRATimeLogger
===========================

A [Greasemonkey](http://www.greasespot.net/) script that adds a stop watch to the bottom of JIRA ticket pages. The stopwatch can be started, paused and unpaused. The recorded time can then be logged to JIRA.

Project status
--------------

The tests pass, most things are tested. The call to actually log the time is currently disabled as I want to extract that out of the Worklog class and do a little bit of tidy up there. The script currently isn't published, so you're on your own for now if you want to try running it.

Running tests
-------------

If you have the [Jasmine](http://pivotal.github.io/jasmine/) ruby gem installed, tests can be run by running

    rake jasmine
in the project directory and pointing your browser at http://localhost:8888/
