interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const intersectRectangles = (rectangles: Rectangle[]) => {
  if (rectangles.length === 0) {
    return null; // No rectangles to intersect
  }

  let intersection = rectangles[0];

  for (let i = 1; i < rectangles.length; i++) {
    const rect = rectangles[i];

    // Calculate intersection coordinates
    const x1 = Math.max(intersection.x, rect.x);
    const y1 = Math.max(intersection.y, rect.y);
    const x2 = Math.min(intersection.x + intersection.width, rect.x + rect.width);
    const y2 = Math.min(intersection.y + intersection.height, rect.y + rect.height);

    // Check if there's an intersection
    if (x2 <= x1 || y2 <= y1) {
      return null; // No intersection
    }

    // Update intersection rectangle
    intersection = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
  }

  return intersection;
};
