/**
 * Checks if an array is unique in a history of arrays, and performs an action if it is unique.
 * @param {Array<Array<string>>} history - The array of arrays to check against.
 * @param {Array<string>} newArray - The array to check for uniqueness.
 * @param {Function} onUnique - Callback function to execute if the array is unique.
 */
export const addToHistoryIfUnique = (history, newArray, onUnique) => {
  const sortedNewArray = [...newArray].sort();

  const exists = history.some(
    (arr) =>
      arr.length === sortedNewArray.length &&
      [...arr].sort().every((str, index) => str === sortedNewArray[index])
  );

  if (!exists) {
    onUnique(newArray);
  }
};
