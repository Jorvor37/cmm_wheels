const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const segments = ['Ali', 'Beatriz', 'Charles', 'Diya', 'Eric', 'Fatima', 'Gabriel', 'Hanna']; // Example names
const textColors = { red: 'white', blue: 'white', green: 'black', yellow: 'black' };
const orderedColors = ['red', 'blue', 'green', 'yellow']; // Fixed color order

let currentAngle = 0; // Initial angle
let spinning = false;

// Function to draw a single segment
const drawSegment = (startAngle, endAngle, color, text) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 200;

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

// Function to draw the entire wheel
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

  // Draw the center circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();
};

// Function to spin the wheel
const spinWheel = () => {
  if (spinning) return; // Prevent multiple spins
  spinning = true;

  const spinDuration = 10000; // Spin duration in milliseconds
  const spinDeceleration = 0.005; // Deceleration rate
  let spinVelocity = Math.random() * 0.3 + 0.5; // Random initial velocity

  const spin = () => {
    spinVelocity -= spinDeceleration; // Decrease velocity
    currentAngle += spinVelocity; // Update angle
    currentAngle %= 2 * Math.PI; // Keep angle in [0, 2π]

    drawWheel();

    if (spinVelocity > 0) {
      requestAnimationFrame(spin);
    } else {
      // Calculate the winner
      const numSegments = segments.length;
      const segmentAngle = (2 * Math.PI) / numSegments; // Angle per segment

      // Adjust angle to account for pointer being on the right
      const adjustedAngle = (2 * Math.PI - currentAngle + (3 * Math.PI) / 2) % (2 * Math.PI);
      const winningIndex = Math.floor(adjustedAngle / segmentAngle); // Find the segment index

      const winningSegment = segments[winningIndex];
      alert(`Winner: ${winningSegment}`);
      spinning = false;
    }
  };

  spin();
};

// Attach spin event listener
document.getElementById('spin').addEventListener('click', spinWheel);

// Initial wheel rendering
drawWheel();