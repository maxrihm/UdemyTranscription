setTimeout(function () {
  // Find the header element by its class name
  const header = document.querySelector('.header--header--g2QGk');

  // Only proceed if the header is found
  if (header) {
      // Create a new button for copying text
      const copyButton = document.createElement('button');
      copyButton.innerText = 'Copy Text';
      copyButton.style.marginLeft = '20px'; // Add some margin to separate it from other header elements
      header.appendChild(copyButton);

      // Create a new button for taking a screenshot
      const screenshotButton = document.createElement('button');
      screenshotButton.innerText = 'Take Screenshot';
      screenshotButton.style.marginLeft = '20px'; // Add some margin to separate it from other header elements
      header.appendChild(screenshotButton);

      // Add click event listener to the copy text button
      copyButton.addEventListener('click', async () => {
          const elements = document.querySelectorAll('.transcript--cue-container--Vuwj6');
          let allSpanText = '';
          elements.forEach(element => {
              const spans = element.querySelectorAll('span');
              spans.forEach(span => allSpanText += span.innerText + ' ');
          });

          let sectionText = '';
          let section = document.querySelector('section[class^="lecture-view--container"]');
          if (section) {
              let ariaLabel = section.getAttribute('aria-label');
              let lastIndex = ariaLabel.lastIndexOf(':');
              if (lastIndex !== -1) {
                  sectionText = ariaLabel.substring(lastIndex + 1).trim();
              } else {
                  console.log('No colon found in the aria-label text');
              }
          } else {
              console.log('Section with class starting "lecture-view--container" not found');
          }

          let combinedText = allSpanText.trim() + "\n" + sectionText;

          try {
              await navigator.clipboard.writeText(combinedText);
              console.log('Text copied to clipboard.');
          } catch (error) {
              console.error('Error copying text: ', error);
          }
      });

      // Add click event listener to the screenshot button
      screenshotButton.addEventListener('click', takeScreenshot);
  } else {
      console.log("Header not found. Can't append the button.");
  }
}, 7500); // Wait for 7.5 seconds to account for dynamically loaded content

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "take_screenshot") {
    takeScreenshot();
  }
});

let lastActiveCue = null;

function updateActiveCue() {
  const activeCue = document.querySelector('p[data-purpose="transcript-cue-active"]');
  if (activeCue) {
    lastActiveCue = activeCue;
  }
}

// Run updateActiveCue every 500 milliseconds to keep track of the active transcript cue
setInterval(updateActiveCue, 500);

function takeScreenshot() {
    addScreenshotToLastActiveCue(); // Update to use the last active cue

    try {
      var video = document.querySelector('video');
      if (!video) {
        console.error('No video found on this page.');
        return;
      }
  
      var canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
  
        var date = new Date();
        var fileName = 'screenshot_' + date.toISOString().replace(/[:.]/g, '-') + '.png';
  
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  }
  
function addScreenshotToLastActiveCue() {
  // Use the last known active cue
  if (lastActiveCue) {
    var cueText = lastActiveCue.querySelector('span[data-purpose="cue-text"]');
    if (cueText) {
      cueText.textContent = '[Screenshot] ' + cueText.textContent;
    }
  } else {
    console.error("No active cue available for prefixing.");
  }
}
