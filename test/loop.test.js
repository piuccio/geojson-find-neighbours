const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const readJson = (file) => readFile(path.join(__dirname, file)).then((content) => JSON.parse(content));
const { findNeighbours } = require('../index');

describe('Stations on a line with loops', () => {
  let GEOJSON = {};

  beforeAll(async () => {
    GEOJSON = await readJson('./loop.geojson');
  });

  it('finds the neighbours of where the loop starts', async () => {
    const near = findNeighbours('7-UVCjlY', 'id', GEOJSON).sort(byId);
    expect(near).toEqual([
      { id: 'A9sFGUAp', distance: expect.any(Number) },
      { id: '03n7uE9L', distance: expect.any(Number) },
      { id: '9JECYNwe', distance: expect.any(Number) },
    ].sort(byId));

    // The length of the station is about 150 meters -> 75 from the center
    // the two stations on the east are connected by 75m of shared line
    let distance = 600 + 75 + 70;
    expect(near.find((n) => n.id === 'A9sFGUAp').distance).toBeGreaterThan(distance - 1);
    expect(near.find((n) => n.id === 'A9sFGUAp').distance).toBeLessThan(distance + 50);
    distance = 520 + 75 + 75 + 75;
    expect(near.find((n) => n.id === '03n7uE9L').distance).toBeGreaterThan(distance - 1);
    expect(near.find((n) => n.id === '03n7uE9L').distance).toBeLessThan(distance + 50);
    distance = 680 + 75 + 75 + 50;
    expect(near.find((n) => n.id === '9JECYNwe').distance).toBeGreaterThan(distance - 1);
    expect(near.find((n) => n.id === '9JECYNwe').distance).toBeLessThan(distance + 50);
  });
});

const byId = (a, b) => a.id.localeCompare(b.id);
