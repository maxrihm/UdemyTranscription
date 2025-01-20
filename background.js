chrome.commands.onCommand.addListener(function (command) {
    if (command === "jump_timecode") {
        // Send a message to the content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "jump_timecode"});
        });
    } else if (command === "reset_timecodes") {
        // Send a message to the content script to reset timecodes
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "reset_timecodes"});
        });
    }
});
  