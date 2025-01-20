chrome.commands.onCommand.addListener(function (command) {
    if (command === "jump_timecode") {
        // Send a message to the content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {command: "jump_timecode"});
        });
    }
});
  