Find the neighbours in a geojson feature collection

## Problem

Imagine you have a [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3) of [LineString](https://tools.ietf.org/html/rfc7946#section-3.1.4)s that describes a connected path.
Some of the LineString have a special meaning to you, for instance stations on a rail network or intersections on a road network.

This library allows you to find the directly connected neighbours from a source feature.

## Example

Given the following geojson

```json
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "id": "a" }, "geometry": { "type": "LineString", "coordinates": [[0, 0], [0, 1]]} },
    { "type": "Feature", "properties": {           }, "geometry": { "type": "LineString", "coordinates": [[0, 1], [1, 2]]} },
    { "type": "Feature", "properties": {           }, "geometry": { "type": "LineString", "coordinates": [[1, 2], [2, 2]]} },
    { "type": "Feature", "properties": { "id": "b" }, "geometry": { "type": "LineString", "coordinates": [[2, 2], [2, 3]]} },
    { "type": "Feature", "properties": {           }, "geometry": { "type": "LineString", "coordinates": [[2, 3], [3, 5], [5, 6]]} },
    { "type": "Feature", "properties": { "id": "c" }, "geometry": { "type": "LineString", "coordinates": [[5, 6], [6, 6]]} }
  ]
}
```

This defines a line connecting `a` and `c` through `b`

The neighbours of `a` will be `b`.
The neighbours of `b` will be `a` and `b`.
The neighbours of `c` will be `b`.
