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

      // Create Reset button
      const resetButton = document.createElement('button');
      resetButton.innerText = 'Reset Timecodes';
      resetButton.style.marginLeft = '10px';
      header.appendChild(resetButton);

      // Add click event listener to the reset button
      resetButton.addEventListener('click', resetTimecodes);

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

          let combinedText = sectionText + "\n" + allSpanText.trim();

          try {
              await navigator.clipboard.writeText(combinedText);
              console.log('Text copied to clipboard.');
          } catch (error) {
              console.error('Error copying text: ', error);
          }
      });

      // Initialize timecode jumping after header is found
      initializeTimecodeJumping();
  } else {
      console.log("Header not found. Can't append the button.");
  }
}, 7500); // Wait for 7.5 seconds to account for dynamically loaded content

let timecodes = [];
let currentIndex = 0;
let isJumpingEnabled = false;

function resetTimecodes() {
    console.log('Resetting timecodes...');
    timecodes = [];
    currentIndex = 0;
    isJumpingEnabled = false;
    
    const video = document.querySelector('video');
    if (!video || !video.duration || video.duration === Infinity) {
        console.log('Video not ready yet');
        return;
    }

    const totalDuration = video.duration;
    const step = totalDuration / 10;
    
    for (let i = 1; i <= 10; i++) {
        timecodes.push(i * step);
    }

    console.log('Generated new timecodes:', timecodes);
    console.log('Total video duration:', totalDuration);
    isJumpingEnabled = true;
}

function initializeTimecodeJumping() {
    console.log('Initializing timecode jumping...');
    resetTimecodes();
}

// Function to jump to next timecode
function jumpToNextTimecode() {
    console.log('Jump attempt triggered');
    
    if (!isJumpingEnabled) {
        console.log('Jumping not enabled yet - waiting for video to load');
        return;
    }

    const video = document.querySelector('video');
    if (!video) {
        console.log('Video element not found during jump');
        return;
    }

    if (currentIndex >= timecodes.length) {
        console.log('Resetting to beginning of timecodes');
        currentIndex = 0;
        return;
    }

    const targetTime = timecodes[currentIndex];
    console.log(`Jumping to timecode ${currentIndex + 1}/10:`, targetTime);
    video.currentTime = targetTime;
    currentIndex++;

    // Wait for 1 second before allowing next jump
    isJumpingEnabled = false;
    setTimeout(() => {
        isJumpingEnabled = true;
        console.log('Ready for next jump');
    }, 1000);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command === "jump_timecode") {
        console.log('Jump command received from Chrome');
        jumpToNextTimecode();
    } else if (message.command === "reset_timecodes") {
        console.log('Reset command received from Chrome');
        resetTimecodes();
    }
});
