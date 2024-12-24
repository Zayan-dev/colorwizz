// Shuffle function
export const shuffleArray = (array, lockedColors) => {
  for (let i = array.length - 1; i > 0; i--) {
    if (!lockedColors.includes(i)) {
      let j;
      do {
        j = Math.floor(Math.random() * (i + 1)); // Random index
      } while (lockedColors.includes(j)); // Ensure j is not a locked index

      // Swap only if both i and j are unlocked
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  return array;
};

export const urlParameters = (colors) => {
  return colors.map((color) => color.replace("#", "")).join("-");
}

export const urlColorsParsing = (params) => {
  return params.split("-").map((color) => `#${color}`);
};


  // useEffect(() => {
    //   const updatedNames = [...colorNames];
    //   colors.forEach((color, index) => {
    //     if (color !== prevColorsRef.current[index]) {
    //       updatedNames[index] = namer(color).ntc[0]?.name || "Unknown";
    //     }
    //   });

    //   setColorNames(updatedNames);
    //   prevColorsRef.current = colors;
    // }, [colors]);



        // const handleDragStart = (index) => {
    //     setDraggedIndex(index);
    // };
    // const handleDragOver = (e) => {
    //     e.preventDefault();
    // };
    // const handleDrop = (index) => {
    //     const updatedColors = [...colors];
    //     let updatedLockedColors = [...lockedColors];
    //     if (draggedIndex < index) {
    //         if (updatedLockedColors.includes(draggedIndex)) {
    //             // setLockedColors((lockedcolor) => lockedcolor.filter(item => item !== draggedIndex))
    //             updatedLockedColors = updatedLockedColors.filter(item => item !== draggedIndex)
    //         }
    //         for (let i = draggedIndex; i <= index; i++) {
    //             if (updatedLockedColors.includes(i)) {
    //                 const elementIndex = updatedLockedColors.indexOf(i)
    //                 updatedLockedColors[elementIndex] = updatedLockedColors[elementIndex] - 1;
    //             }
    //         }
    //         if (lockedColors.includes(draggedIndex)) {
    //             updatedLockedColors.push(index)
    //         }
    //     }
    //     console.log(draggedIndex, index)
    //     if (draggedIndex > index) {
    //         if (updatedLockedColors.includes(draggedIndex)) {
    //             updatedLockedColors = updatedLockedColors.filter(item => item !== draggedIndex)
    //         }
    //         for (let i = draggedIndex; i >= index; i--) {
    //             if (updatedLockedColors.includes(i)) {
    //                 const elementIndex = updatedLockedColors.indexOf(i)
    //                 updatedLockedColors[elementIndex] = updatedLockedColors[elementIndex] + 1;
    //             }
    //         }
    //         if (lockedColors.includes(draggedIndex)) {
    //             updatedLockedColors.push(index)
    //         }
    //     }
    //     console.log("Old locked: ", lockedColors);
    //     console.log("New Locked: ", updatedLockedColors);
    //     const [movedColor] = updatedColors.splice(draggedIndex, 1); // Remove the dragged color
    //     updatedColors.splice(index, 0, movedColor); // Insert it at the drop location
    //     setColors(updatedColors);
    //     setLockedColors(updatedLockedColors);
    //     setDraggedIndex(null); // Clear the dragged index
    // };

    // const handleCopy = (e) => {
    //     navigator.clipboard.writeText(e.target.innerHTML);
    //     toast("Color copied to clipboard!");
    // };
    // const handleColorChange = (e, index) => {
    //     const newColor = e.target.value; // Get the new color from the color picker
    //     setColors((prevColors) => {
    //         const updatedColors = [...prevColors];
    //         updatedColors[index] = newColor; // Update the specific color in the array
    //         return updatedColors;
    //     });
    //     // const colorName = namer(newColor).ntc[0]?.name || "Unknown";
    //     // setName(colorName);
    // };

    // const handleColorPickEnd = (color, index) => {
    //     const updatedColorName = namer(color).ntc[0]?.name || "Unknown";
    //     setColorNames((prevNames) => {
    //       const newNames = [...prevNames];
    //       newNames[index] = updatedColorName;
    //       return newNames;
    //     });
    // }
    // const toggleLockColor = (index) => {
    //     setLockedColors((prevLocked) =>
    //         prevLocked.includes(index)
    //             ? prevLocked.filter((i) => i !== index)  // Unlock the color
    //             : [...prevLocked, index]                 // Lock the color
    //     );
    // };
