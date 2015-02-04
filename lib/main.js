prefs = require("sdk/preferences/service");
simprefs = require("sdk/simple-prefs");
tmr = require("sdk/timers");

var enabled = simprefs.prefs.enabled;
var dayTime = prefs.get(['extensions', require('sdk/self').id, 'day'].join('.'));
var nightTime = prefs.get(['extensions', require('sdk/self').id, 'night'].join('.'));

// Enable the dev theme to allow for color changing
prefs.set("browser.devedition.theme.enabled", true);


// Check if the current time is considered daytime
function timeCheck() {
	if (enabled) {
		var dayTime = simprefs.prefs['day'];
		var nightTime = simprefs.prefs['night'];
		var currentTime = new Date().getHours();
		var stylishEnabled = simprefs.prefs['extension.stylish.toggled'];	

		if (currentTime >= dayTime && currentTime <= nightTime) {
			prefs.set("devtools.theme", "light");
			
			// If it's daytime then turn off all dark Stylish styles
			if (stylishEnabled) {
				prefs.set("extensions.stylish.styleRegistrationEnabled", false);
			}
		} else {
			prefs.set("devtools.theme", "dark");

			// If it's nighttime then turn on all dark Stylish styles
			if (stylishEnabled) {
				prefs.set("extensions.stylish.styleRegistrationEnabled", true);
			}	
		}
	}
}

timeCheck();
// Recheck if in daytime when user updates preferences
function onPrefChange() {
	timeCheck();
}


// Button to enable/disable addon
/**
var { ActionButton } = require("sdk/ui/button/action");
var button = ActionButton ({
	id: "toggle-enable",
	label: "Toggle TimedNightTheme",
	icon: {
		"16": "./Logo_ToolBar_16x16.png",
		"18": "./Logo_Light_ToolBar_18x18.png",
		"32": "./Logo_ToolBar_32x32.png",
		"36": "./Logo_Light_ToolBar_36x36.png",
		"64": "./Logo_ToolBar_64x64.png"
	},
	onClick: toggleEnabled
});

function toggleEnabled(state) {
	var enabled = simprefs.prefs['enabled'];

	if (enabled) {
		simprefs.prefs.enabled = false;
	} else {
		simprefs.prefs.enabled = true;
	}
	console.log(enabled);
}
**/

// Listener to recheck time parameter when set config time changes.
simprefs.on("", onPrefChange);

// Run every 10 minutes
tmr.setInterval(timeCheck, 30000);




// This was supposed to work
/**
// Check if it is daytime at configs daytime
var now = new Date();

var isDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), dayTime, 0, 0, 0) - now;
if (isDay < 0) {
	isDay += 86400000; // It's daytime now, check again tomorrow
}
tmr.setTimeout(timeCheck, isDay);


// Check if is nighttime at configs nighttime
var isNight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), nightTime, 0, 0, 0) - now;
if (isNight < 0) {
        isNight += 86400000; // It's nighttime now, check again tomorrow
}
tmr.setTimeout(timeCheck, isNight);
**/
