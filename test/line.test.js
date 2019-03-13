const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const readJson = (file) => readFile(path.join(__dirname, file)).then((content) => JSON.parse(content));
const { findNeighbours } = require('../index');

describe('Stations on a single line', () => {
  let GEOJSON = {};

  beforeAll(async () => {
    GEOJSON = await readJson('./line.geojson');
  });

  function ids(start) {
    return findNeighbours(start, 'id', GEOJSON).map((res) => res.id).sort();
  }

  it('finds the neighbours of the edges', async () => {
    expect(findNeighbours('5xFxGtju', 'id', GEOJSON)).toEqual([
      { id: '9jTSfYjE', distance: expect.any(Number) },
    ]);

    expect(findNeighbours('7AoOTQKZ', 'id', GEOJSON)).toEqual([
      { id: 'EnblvI4_', distance: expect.any(Number) },
    ]);
  });

  it('find the neighbours of points in the middle', async () => {
    expect(ids('9jTSfYjE')).toEqual(['5xFxGtju', 'AxvdCscF'].sort());
    expect(ids('AxvdCscF')).toEqual(['9jTSfYjE', 'Co5RNZ4W'].sort());
    expect(ids('Co5RNZ4W')).toEqual(['AxvdCscF', '8XLEUbCx'].sort());
    expect(ids('8XLEUbCx')).toEqual(['Co5RNZ4W', 'AVuFxYBt'].sort());
    expect(ids('AVuFxYBt')).toEqual(['8XLEUbCx', 'CRBWA4uj'].sort());
    expect(ids('CRBWA4uj')).toEqual(['AVuFxYBt', '05bB_fE6'].sort());
    expect(ids('05bB_fE6')).toEqual(['CRBWA4uj', 'MeJIzsxC'].sort());
    expect(ids('MeJIzsxC')).toEqual(['05bB_fE6', 'AtnV3dAd'].sort());
    expect(ids('AtnV3dAd')).toEqual(['MeJIzsxC', 'uvSeO5xZ'].sort());
    expect(ids('uvSeO5xZ')).toEqual(['AtnV3dAd', 'BgTxyd1w'].sort());
    expect(ids('BgTxyd1w')).toEqual(['uvSeO5xZ', 'CicLzTl6'].sort());
    expect(ids('CicLzTl6')).toEqual(['BgTxyd1w', 'EnblvI4_'].sort());
    expect(ids('EnblvI4_')).toEqual(['CicLzTl6', '7AoOTQKZ'].sort());
  });
});
