// lockAndDrag.js

export const handleDrop = (
  index,
  draggedIndex,
  colors,
  lockedColors,
  setColors,
  setLockedColors
) => {
  const updatedColors = [...colors];
  let updatedLockedColors = [...lockedColors];

  // Adjust positions based on dragging direction
  if (draggedIndex < index) {
    if (updatedLockedColors.includes(draggedIndex)) {
      updatedLockedColors = updatedLockedColors.filter(
        (item) => item !== draggedIndex
      );
    }
    for (let i = draggedIndex; i <= index; i++) {
      if (updatedLockedColors.includes(i)) {
        const elementIndex = updatedLockedColors.indexOf(i);
        updatedLockedColors[elementIndex] -= 1;
      }
    }
    if (lockedColors.includes(draggedIndex)) updatedLockedColors.push(index);
  } else {
    if (updatedLockedColors.includes(draggedIndex)) {
      updatedLockedColors = updatedLockedColors.filter(
        (item) => item !== draggedIndex
      );
    }
    for (let i = draggedIndex; i >= index; i--) {
      if (updatedLockedColors.includes(i)) {
        const elementIndex = updatedLockedColors.indexOf(i);
        updatedLockedColors[elementIndex] += 1;
      }
    }
    if (lockedColors.includes(draggedIndex)) updatedLockedColors.push(index);
  }

  const [movedColor] = updatedColors.splice(draggedIndex, 1);
  updatedColors.splice(index, 0, movedColor);

  setColors(updatedColors);
  setLockedColors(updatedLockedColors);
};

export const toggleLockColor = (index, lockedColors, setLockedColors) => {
  setLockedColors((prevLocked) =>
    prevLocked.includes(index)
      ? prevLocked.filter((i) => i !== index)
      : [...prevLocked, index]
  );
  console.log(lockedColors)
};
