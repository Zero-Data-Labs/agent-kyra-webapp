/**
 * Wait for a given number of milliseconds
 *
 * @param ms - Number of milliseconds to wait
 * @returns A promise that resolves after the given number of milliseconds
 */
export async function wait(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Moves an element in an array from one position to another.
 *
 * @param array - The source array to modify
 * @param from - The index to move from
 * @param to - The index to move to (can be negative to count from end)
 * @returns A new array with the element moved to the new position
 */
export function moveItemInArray<T>(array: T[], from: number, to: number): T[] {
  if (!array.length) {
    throw new Error("Cannot move items in an empty array")
  }

  // Convert negative 'from' index to positive
  const fromIndex = from < 0 ? array.length + from : from

  // Validate 'from' index
  if (fromIndex < 0 || fromIndex >= array.length) {
    throw new Error("Source index out of bounds")
  }

  // Convert and validate 'to' index
  let toIndex = to < 0 ? array.length + to : to
  if (toIndex < 0) toIndex = 0
  if (toIndex > array.length) toIndex = array.length

  const newArray = array.slice()
  newArray.splice(toIndex, 0, newArray.splice(fromIndex, 1)[0]!)
  return newArray
}
