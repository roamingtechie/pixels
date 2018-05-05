# pixels
the pixiest repo of them all [someone please find the gobstopper image and render it here]

## polling-extension structure

/css -- contains all of the css files
/fonts -- contains font-related files
/js -- contains all of the js files

config.html - this is the page where the streamer can configure their extension (probably not where we'll let Criken live-update the polls)

live_config.html - one option for where we can let Criken update the panel live. However, we may just want to build a separate webpage. We will ask what he's interested in

video_component.html -- This is where we will build the video overlay (for displaying live polls)

viewer.html -- This is the panel where ths rules and statistics are displayed

To run this locally:
1. Clone the repo
2. cd into the project and run 'python -m SimpleHTTPServer'
3. Navigate to localhost:8000/viewer.html to see a rendering of the panel (note -- this will be loaded into a fixed iFrame, so don't worry that it's extra wide. In general, we should design these panels to be responsive). When testing, just adjust your browser width to be less wide, and we can assume the Panel will be 500px in height.

## Tasks

### Justin
- Get familiar with viewer.html, css/viewer.css, js/viewer.js
- Change top of the panel to say 'WoW Amish Challenge'
- Change the tab names and content to reflect https://spark723.wixsite.com/wowamishchallenge

### Mike
- Get basic polling system in place which can manage multiple polls, start/stop of polls with a given poll config (name, duration, choices), and management of voting (userID, voteAmount)
- Build a onPollComplete() function that will eventually broadcast a message to Twitch extension
- Ability to query results of a given poll

### Alex
- Get basic yolo helloworld stream overlay panel rendering on twitch
- Populate panel with 3 clickable choices and attack click handlers to them
- Improve design (mimic off Bits Voting Studio)