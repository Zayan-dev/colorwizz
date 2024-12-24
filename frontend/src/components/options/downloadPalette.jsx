import chroma from "chroma-js";

export const drawPalette = (canvas, colors) => {
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions
  const canvasHeight = 600;
  const maxColors = 10;
  const colorWidth = Math.min(200, canvasHeight / 2); // Maximum reasonable width per color
  const canvasWidth = Math.min(colors.length, maxColors) * colorWidth;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const borderRadius = 15; // Set the desired border radius

  // Draw a rounded rectangle for the canvas background
  ctx.fillStyle = "#fff"; // Background color (white)
  ctx.beginPath();
  ctx.moveTo(borderRadius, 0);
  ctx.lineTo(canvas.width - borderRadius, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, borderRadius);
  ctx.lineTo(canvas.width, canvas.height - borderRadius);
  ctx.quadraticCurveTo(
    canvas.width,
    canvas.height,
    canvas.width - borderRadius,
    canvas.height
  );
  ctx.lineTo(borderRadius, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - borderRadius);
  ctx.lineTo(0, borderRadius);
  ctx.quadraticCurveTo(0, 0, borderRadius, 0);
  ctx.closePath();
  ctx.fill();

  // Now clip the canvas to the rounded rectangle
  ctx.clip();

  // Calculate width per color
  const blockWidth = canvasWidth / Math.min(colors.length, maxColors);

  colors.slice(0, maxColors).forEach((color, index) => {
    const textColor = chroma(color).luminance() > 0.5 ? "#000000" : "#ffffff";
    // Set fill color
    ctx.fillStyle = color;

    // Draw color block
    ctx.fillRect(index * blockWidth, 0, blockWidth, canvasHeight);

    // Draw hex code in the center of each block
    ctx.fillStyle = textColor; // Set font color (black)
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      color.toUpperCase(),
      index * blockWidth + blockWidth / 2, // Correct x-coordinate
      canvasHeight / 2 // y-coordinate remains the same
    );
  });
};

// downloadPalette.js
export const downloadPalette = (canvas) => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "palette.png";
  link.click();
};
