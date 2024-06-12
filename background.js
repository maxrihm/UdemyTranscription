chrome.commands.onCommand.addListener(function (command) {
    if (command === "take_screenshot") {
      // Send a message to the content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "take_screenshot"});
      });
    }
  });
  