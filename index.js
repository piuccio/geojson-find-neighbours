const turfLength = require('@turf/length').default;

exports.findNeighbours = function (from, key, json) {
  const isDestination = (feature) => !!feature.properties[key];
  const isStart = (feature) => feature.properties[key] === from;

  const startingPoint = json.features.find(isStart);
  if (!startingPoint) {
    throw new Error(`Could not find a feature with ${key}: ${from}`);
  }
  // Keep a list of features we've already visited
  const visited = [startingPoint];

  // Finds all features that are connected to the current one
  function connectedTo(feature, initialDistance) {
    // I'm going to use a naive approach here
    // The first point in the coordinates must be the same as the last
    // and vice versa
    const referenceBegin = feature.geometry.coordinates[0].join();
    const referenceEnd = feature.geometry.coordinates[feature.geometry.coordinates.length - 1].join();

    return json.features.map((item) => {
      if (item === feature || visited.includes(item)) {
        return false;
      }
      const begin = item.geometry.coordinates[0].join();
      const end = item.geometry.coordinates[item.geometry.coordinates.length - 1].join();

      if (
        referenceBegin === begin || referenceBegin === end
        || referenceEnd === begin || referenceEnd === end
      ) {
        return { feature: item, distance: initialDistance };
      }
    }).filter(Boolean);
  }

  const neighbours = []; // the list of results
  // The queue contains higher level representation of the features that need to be processed
  // additional information for instance include the length traveled so far
  const queue = [...connectedTo(startingPoint, length(startingPoint) / 2)];
  while (queue.length > 0 && queue.length < 10) {
    const next = queue.shift();
    if (isDestination(next.feature)) {
      neighbours.push({
        [key]: next.feature.properties[key],
        distance: Math.round(next.distance + (length(next.feature) / 2)),
      });
    } else {
      const connections = connectedTo(next.feature, length(next.feature) + next.distance);
      queue.push(...connections);
      // Also store these connections inside the visited array because when there is
      // an intersection and we look at connections of the firs element in the queue
      // we don't want to push the same connection again if it's already queued
      visited.push(...connections.map((conn) => conn.feature));
    }
  }
  return neighbours;
};


// Return the length of the feature in meters
function length(feature) {
  return turfLength(feature, { units: 'kilometers' }) * 1000;
}
