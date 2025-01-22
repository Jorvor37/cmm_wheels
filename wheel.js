const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Data Lists
const segments = [ ];
const textColors = { red: 'white', blue: 'white', green: 'black', yellow: 'black' };
const orderedColors = ['red', 'blue', 'green', 'yellow']; // Fixed color order

let currentAngle = 0;
let spinning = false;

// Draw single segment
const drawSegment = (startAngle, endAngle, color, text) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 230;

  // Draw the segment
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  // Add the text
  const angle = (startAngle + endAngle) / 2;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.textAlign = 'right';
  ctx.fillStyle = textColors[color];
  ctx.font = '16px Arial';
  ctx.fillText(text, radius - 20, 10);
  ctx.restore();
};

// Draw the entire wheel
const drawWheel = () => {
  const numSegments = segments.length;
  const anglePerSegment = (2 * Math.PI) / numSegments;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startAngle = currentAngle;
  for (let i = 0; i < numSegments; i++) {
      const endAngle = startAngle + anglePerSegment;
      const color = orderedColors[i % orderedColors.length];
      drawSegment(startAngle, endAngle, color, segments[i]);
      startAngle = endAngle;
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();

  // Draw the center image
  const centerImage = new Image();
  centerImage.src = 'CMMLOGO.png'; // Replace with the actual image file name
  centerImage.onload = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Set maximum width and height for the image
      const maxImageSize = 105; // Adjust this to fit the center properly
      let imageWidth = centerImage.width;
      let imageHeight = centerImage.height;

      // Scale down the image to fit the maxImageSize
      if (imageWidth > imageHeight) {
          const scaleFactor = maxImageSize / imageWidth;
          imageWidth = maxImageSize;
          imageHeight = imageHeight * scaleFactor;
      } else {
          const scaleFactor = maxImageSize / imageHeight;
          imageHeight = maxImageSize;
          imageWidth = imageWidth * scaleFactor;
      }

      // Draw the image centered
      ctx.drawImage(
          centerImage,
          centerX - imageWidth / 2, // Center horizontally
          centerY - imageHeight / 2, // Center vertically
          imageWidth,
          imageHeight
      );
  };
};

// Spin wheel function
const spinWheel = () => {
  if (spinning) return; // Prevent multiple spins
  spinning = true;

  const spinDuration = 5000;
  const totalSpins = Math.random() * 5 + 5; // Random number of spins (5-10 full rotations)
  const startTime = performance.now(); // Timestamp

  const spin = () => {
    const elapsedTime = performance.now() - startTime; // Time elapsed since the spin started
    const progress = Math.min(elapsedTime / spinDuration, 1); // Progress between 0 and 1
    const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease-out effect

    // Calculate the current angle based on progress
    currentAngle = easeOutProgress * totalSpins * 2 * Math.PI; // Total rotation based on ease-out

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(spin); // Continue spinning
    } else {
      // Calculate the winner
      const numSegments = segments.length;
      const segmentAngle = (2 * Math.PI) / numSegments; // Angle per segment

      // Adjust angle for pointer at the top and ensure it's positive
      let adjustedAngle = (2 * Math.PI - currentAngle + (3 * Math.PI) / 2) % (2 * Math.PI);
      if (adjustedAngle < 0) {
        adjustedAngle += 2 * Math.PI; // Ensure adjustedAngle is positive
      }

      // Calculate the winning index
      const winningIndex = Math.floor(adjustedAngle / segmentAngle) % numSegments; // Ensure index is valid
      const winningSegment = segments[winningIndex];

      // Remove the winning entry
      segments.splice(winningIndex, 1);

      // Redraw the wheel with the updated list
      if (segments.length > 0) {
          drawWheel();
      } else {
          alert("No more segments left! Add new entries.");
      }
      spinning = false;

      console.log('Winning Index:', winningIndex); 
      console.log('Winning Segment:', winningSegment);

      alert(`Winner: ${winningSegment}`);
      spinning = false;
    }
  };

  spin();
};



//Add player
const popup = document.getElementById('popup');
const addButton = document.getElementById('add');
const saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');

addButton.addEventListener('click', () => {
    popup.style.display = 'block'; // Show popup
});

cancelButton.addEventListener('click', () => {
    popup.style.display = 'none'; // Hide popup
});
saveButton.addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const number = document.getElementById('number').value.trim();
  const quantity = parseInt(document.getElementById('quantity').value, 10);

  if (!name || !number || quantity <= 0) {
      alert('Please fill out all fields with valid values.');
      return;
  }

  for (let i = 0; i < quantity; i++) {
      segments.push(`${name}(${number})`);
  }

  popup.style.display = 'none'; // Hide popup after saving
  drawWheel(); // Redraw the wheel with new segments
});


//Edit List
const listContainer = document.getElementById('list-container');
const editButton = document.getElementById('edit');

listContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
      const index = parseInt(event.target.dataset.index, 10);
      removeEntry(index);
  }
});

// Show the current list with delete buttons
const showList = () => {
  if (segments.length === 0) {
      listContainer.innerHTML = "<p>No entries in the list. Add some!</p>";
      return;
  }

  const listHTML = segments.map((segment, index) => `
  <li>
      <span>${segment}</span>
      <button data-index="${index}">Remove</button>
  </li>
`).join('');

  listContainer.innerHTML = `<ul>${listHTML}</ul>`;
};

const resizeCanvas = () => {
  const wheelContainer = document.querySelector('.wheel-container');
  const canvas = document.getElementById('canvas');
  canvas.width = wheelContainer.offsetWidth;
  canvas.height = wheelContainer.offsetWidth; // Maintain square aspect ratio
};

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Remove a specific entry
const removeEntry = (index) => {
    segments.splice(index, 1); // Remove the entry at the specified index
    showList(); // Refresh the list display
    drawWheel(); // Redraw the wheel
};

// Attach event listener for the "Edit" button
editButton.addEventListener('click', () => {
  if (listContainer.style.display === 'block') {
      listContainer.style.display = 'none'; // Hide the list if already visible
  } else {
      showList(); // Display the list for editing
      listContainer.style.display = 'block';
  }
});

// Attach spin event listener
document.getElementById('spin').addEventListener('click', spinWheel);

// Initial wheel rendering
drawWheel();