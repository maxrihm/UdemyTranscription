setTimeout(function () {
  // Find the header element by its class name
  const header = document.querySelector('.header--header--g2QGk');

  // Only proceed if the header is found
  if (header) {
      // Create a new button for copying text
      const copyButton = document.createElement('button');
      copyButton.innerText = 'Copy Text';
      copyButton.style.marginLeft = '20px';
      header.appendChild(copyButton);

      // Create a new button for taking a single screenshot
      const screenshotButton = document.createElement('button');
      screenshotButton.innerText = 'Take Screenshot';
      screenshotButton.style.marginLeft = '20px';
      header.appendChild(screenshotButton);
      
      // -----------------------------------------
      // Create a new button for taking 10 screenshots
      const screenshotTenButton = document.createElement('button');
      screenshotTenButton.innerText = 'Take 10 Screenshots';
      screenshotTenButton.style.marginLeft = '20px';
      header.appendChild(screenshotTenButton);
      // -----------------------------------------

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

      // Add click event listener to the single-screenshot button
      screenshotButton.addEventListener('click', takeScreenshot);

      // -----------------------------------------
      // Add click event listener to the 10-screenshot button
      screenshotTenButton.addEventListener('click', takeTenScreenshots);
      // -----------------------------------------
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

// OPTIONAL: Run updateActiveCue every 500 milliseconds to keep track of the active transcript cue
// setInterval(updateActiveCue, 500);

function takeScreenshot() {
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

// -----------------------------------------
// NEW FUNCTION: Take 10 screenshots
function takeTenScreenshots() {
  const video = document.querySelector('video');
  if (!video) {
    console.error("No video found on this page.");
    return;
  }

  const totalDuration = video.duration;
  if (!totalDuration || totalDuration === Infinity) {
    console.error("Video duration not available or invalid.");
    return;
  }

  // We want 10 evenly spaced timecodes (skipping 0, but including end).
  // For simplicity, let's define a step that goes from 10% to 100% of the video in 10 steps.
  // step = totalDuration / 10 => timecodes = 1*step, 2*step, ... , 10*step
  // 10*step will be totalDuration.
  const step = totalDuration / 10;
  const timecodes = [];
  for (let i = 1; i <= 10; i++) {
    timecodes.push(i * step);
  }

  let currentIndex = 0;

  // We will do this sequentially: seek to a timecode, wait for the "seeked" event, take a screenshot, then move on.
  function seekAndCapture() {
    if (currentIndex >= timecodes.length) {
      console.log("All 10 screenshots captured.");
      return;
    }

    // Move video to the next timecode
    const targetTime = timecodes[currentIndex];
    video.currentTime = targetTime;

    // Once the video has seeked, take a screenshot
    video.addEventListener('seeked', onSeeked);
  }

  function onSeeked() {
    // Remove the event listener or we'll capture multiple times
    video.removeEventListener('seeked', onSeeked);

    // Now take a screenshot
    takeScreenshot();

    // Move on to the next timecode after a short delay (to let the video frame update properly)
    currentIndex++;
    setTimeout(seekAndCapture, 500);
  }

  // Start the process
  seekAndCapture();
}
// -----------------------------------------

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
