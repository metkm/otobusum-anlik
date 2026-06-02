export const mapStyles = {
  dark: {
    version: 8,
    sources: {
      ne2_shaded: {
        maxzoom: 6,
        tileSize: 256,
        tiles: [
          'https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png',
        ],
        type: 'raster',
      },
      openmaptiles: {
        type: 'vector',
        url: 'https://tiles.openfreemap.org/planet',
      },
    },
    sprite: 'https://tiles.openfreemap.org/sprites/ofm_f384/ofm',
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': 'rgb(12,12,12)',
        },
      },
      {
        'id': 'water',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'water',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '!=',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'paint': {
          'fill-antialias': false,
          'fill-color': 'rgb(27 ,27 ,29)',
        },
      },
      {
        'id': 'landcover_ice_shelf',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'maxzoom': 8,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'subclass',
            ],
            'ice_shelf',
          ],
        ],
        'paint': {
          'fill-color': 'rgb(12,12,12)',
          'fill-opacity': 0.7,
        },
      },
      {
        'id': 'landcover_glacier',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'maxzoom': 8,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'subclass',
            ],
            'glacier',
          ],
        ],
        'paint': {
          'fill-color': 'hsl(0,1%,2%)',
          'fill-opacity': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 1, 8, 0.5],
        },
      },
      {
        'id': 'landuse_residential',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'maxzoom': 9,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'residential',
          ],
        ],
        'paint': {
          'fill-color': 'hsl(0,2%,5%)',
          'fill-opacity': 0.4,
        },
      },
      {
        'id': 'landcover_wood',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'minzoom': 10,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'wood',
          ],
        ],
        'paint': {
          'fill-color': 'rgb(32,32,32)',
          'fill-opacity': [
            'interpolate',
            [
              'exponential',
              0.3],
            [
              'zoom',
            ],
            8, 0, 10, 0.8, 13, 0.4],
          'fill-pattern': 'wood-pattern',
          'fill-translate': [0, 0],
        },
      },
      {
        'id': 'landuse_park',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'park',
          ],
        ],
        'paint': {
          'fill-color': 'rgb(32,32,32)',
        },
      },
      {
        'id': 'waterway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'waterway',
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'LineString',
            'MultiLineString',
          ],
          true, false],
        'paint': {
          'line-color': 'rgb(27 ,27 ,29)',
        },
      },
      {
        'id': 'water_name',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'water_name',
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'LineString',
            'MultiLineString',
          ],
          true, false],
        'layout': {
          'symbol-placement': 'line',
          'symbol-spacing': 500,
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'map',
          'text-size': 12,
        },
        'paint': {
          'text-color': 'hsla(0,0%,0%,0.7)',
          'text-halo-color': 'hsl(0,0%,27%)',
        },
      },
      {
        'id': 'building',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'minzoom': 12,
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'MultiPolygon',
            'Polygon',
          ],
          true, false],
        'paint': {
          'fill-antialias': true,
          'fill-color': 'rgb(10,10,10)',
          'fill-outline-color': 'rgb(27 ,27 ,29)',
        },
      },
      {
        'id': 'building-3d',
        'type': 'fill-extrusion',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'minzoom': 14,
        'paint': {
          'fill-extrusion-base': [
            'get',
            'render_min_height',
          ],
          'fill-extrusion-color': '#171717',
          'fill-extrusion-height': [
            'get',
            'render_height',
          ],
          'fill-extrusion-opacity': 0.8,
        },
      },
      {
        'id': 'aeroway-taxiway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 12,
        'filter': [
          'match',
          [
            'get',
            'class',
          ],
          [
            'taxiway',
          ],
          true, false],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#181818',
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.55],
            [
              'zoom',
            ],
            13, 1.8, 20, 20],
        },
      },
      {
        'id': 'aeroway-runway-casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 11,
        'filter': [
          'match',
          [
            'get',
            'class',
          ],
          [
            'runway',
          ],
          true, false],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgba(60,60,60,0.8)',
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.5],
            [
              'zoom',
            ],
            11, 5, 17, 55],
        },
      },
      {
        'id': 'aeroway-area',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 4,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'runway',
              'taxiway',
            ],
            true, false],
        ],
        'paint': {
          'fill-color': '#000',
          'fill-opacity': 1,
        },
      },
      {
        'id': 'aeroway-runway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 11,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'runway',
            ],
            true, false],
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#000',
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.5],
            [
              'zoom',
            ],
            11, 4, 17, 50],
        },
      },
      {
        'id': 'road_area_pier',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPolygon',
              'Polygon',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'pier',
          ],
        ],
        'paint': {
          'fill-antialias': true,
          'fill-color': 'rgb(12,12,12)',
        },
      },
      {
        'id': 'road_pier',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'pier',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(12,12,12)',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15, 1, 17, 4],
        },
      },
      {
        'id': 'highway_path',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'path',
          ],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(27 ,27 ,29)',
          'line-dasharray': [1.5, 1.5],
          'line-opacity': 0.9,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            13, 1, 20, 10],
        },
      },
      {
        'id': 'highway_minor',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 8,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'minor',
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#181818',
          'line-opacity': 0.9,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.55],
            [
              'zoom',
            ],
            13, 1.8, 20, 20],
        },
      },
      {
        'id': 'highway_major_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 11,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'secondary',
              'tertiary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'butt',
          'line-join': 'miter',
        },
        'paint': {
          'line-color': 'rgba(60,60,60,0.8)',
          'line-dasharray': [12, 0],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.3],
            [
              'zoom',
            ],
            10, 3, 20, 23],
        },
      },
      {
        'id': 'highway_major_inner',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 11,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'secondary',
              'tertiary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'hsl(0,0%,7%)',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.3],
            [
              'zoom',
            ],
            10, 2, 20, 20],
        },
      },
      {
        'id': 'highway_major_subtle',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 6,
        'maxzoom': 11,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'secondary',
              'tertiary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#2a2a2a',
          'line-width': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            6, 0, 8, 2],
        },
      },
      {
        'id': 'highway_motorway_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 6,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
        ],
        'layout': {
          'line-cap': 'butt',
          'line-join': 'miter',
        },
        'paint': {
          'line-color': 'rgba(60,60,60,0.8)',
          'line-dasharray': [2, 0],
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            5.8, 0, 6, 3, 20, 40],
        },
      },
      {
        'id': 'highway_motorway_inner',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 6,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            5.8, 'hsla(0,0%,85%,0.53)',
            6, '#000',
          ],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            4, 2, 6, 1.3, 20, 30],
        },
      },
      {
        'id': 'road_oneway',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 15,
        'filter': [
          '==',
          [
            'get',
            'oneway',
          ],
          1],
        'layout': {
          'icon-image': 'oneway',
          'icon-padding': 2,
          'icon-rotate': 0,
          'icon-rotation-alignment': 'map',
          'icon-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            15, 0.5, 19, 1],
          'symbol-placement': 'line',
          'symbol-spacing': 200,
        },
        'paint': {
          'icon-opacity': 0.5,
        },
      },
      {
        'id': 'road_oneway_opposite',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 15,
        'filter': [
          '==',
          [
            'get',
            'oneway',
          ],
          -1],
        'layout': {
          'icon-image': 'oneway',
          'icon-padding': 2,
          'icon-rotate': 180,
          'icon-rotation-alignment': 'map',
          'icon-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            15, 0.5, 19, 1],
          'symbol-placement': 'line',
          'symbol-spacing': 200,
        },
        'paint': {
          'icon-opacity': 0.5,
        },
      },
      {
        'id': 'highway_motorway_subtle',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'maxzoom': 6,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#181818',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            4, 2, 6, 1.3],
        },
      },
      {
        'id': 'railway_transit',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 16,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'all',
            [
              '==',
              [
                'get',
                'class',
              ],
              'transit',
            ],
            [
              'match',
              [
                'get',
                'brunnel',
              ],
              [
                'tunnel',
              ],
              false, true],
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(35,35,35)',
          'line-width': 3,
        },
      },
      {
        'id': 'railway_transit_dashline',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 16,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'all',
            [
              '==',
              [
                'get',
                'class',
              ],
              'transit',
            ],
            [
              'match',
              [
                'get',
                'brunnel',
              ],
              [
                'tunnel',
              ],
              false, true],
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(12,12,12)',
          'line-dasharray': [3, 3],
          'line-width': 2,
        },
      },
      {
        'id': 'railway_minor',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 16,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'all',
            [
              '==',
              [
                'get',
                'class',
              ],
              'rail',
            ],
            [
              'has',
              'service',
            ],
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(35,35,35)',
          'line-width': 3,
        },
      },
      {
        'id': 'railway_minor_dashline',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 16,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'all',
            [
              '==',
              [
                'get',
                'class',
              ],
              'rail',
            ],
            [
              'has',
              'service',
            ],
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(12,12,12)',
          'line-dasharray': [3, 3],
          'line-width': 2,
        },
      },
      {
        'id': 'railway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 13,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
          [
            '!',
            [
              'has',
              'service',
            ],
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(35,35,35)',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.3],
            [
              'zoom',
            ],
            16, 3, 20, 7],
        },
      },
      {
        'id': 'railway_dashline',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 13,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
          [
            '!',
            [
              'has',
              'service',
            ],
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'rgb(12,12,12)',
          'line-dasharray': [3, 3],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.3],
            [
              'zoom',
            ],
            16, 2, 20, 6],
        },
      },
      {
        'id': 'highway_name_other',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'filter': [
          'all',
          [
            '!=',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
        ],
        'layout': {
          'symbol-placement': 'line',
          'symbol-spacing': 350,
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              ' ',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-max-angle': 30,
          'text-pitch-alignment': 'viewport',
          'text-rotation-alignment': 'map',
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgba(80, 78, 78, 1)',
          'text-halo-blur': 0,
          'text-halo-color': 'rgba(0, 0, 0, 1)',
          'text-halo-width': 1,
          'text-translate': [0, 0],
        },
      },
      {
        'id': 'highway_name_motorway',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
        ],
        'layout': {
          'symbol-placement': 'line',
          'symbol-spacing': 350,
          'text-field': [
            'to-string',
            [
              'get',
              'ref',
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-pitch-alignment': 'viewport',
          'text-rotation-alignment': 'viewport',
          'text-size': 10,
        },
        'paint': {
          'text-color': 'hsl(0,0%,37%)',
          'text-translate': [0, 2],
        },
      },
      {
        'id': 'boundary_state',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'boundary',
        'filter': [
          '==',
          [
            'get',
            'admin_level',
          ],
          4],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-blur': 0.4,
          'line-color': 'hsl(0,0%,21%)',
          'line-dasharray': [2, 2],
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.3],
            [
              'zoom',
            ],
            3, 1, 22, 15],
        },
      },
      {
        'id': 'boundary_country_z0-4',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'boundary',
        'maxzoom': 5,
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'admin_level',
            ],
            2],
          [
            '!',
            [
              'has',
              'claimed_by',
            ],
          ],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-blur': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 0.4, 22, 4],
          'line-color': 'hsl(0,0%,23%)',
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.1],
            [
              'zoom',
            ],
            3, 1, 22, 20],
        },
      },
      {
        'id': 'boundary_country_z5-',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'boundary',
        'minzoom': 5,
        'filter': [
          '==',
          [
            'get',
            'admin_level',
          ],
          2],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-blur': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 0.4, 22, 4],
          'line-color': 'hsl(0,0%,23%)',
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.1],
            [
              'zoom',
            ],
            3, 1, 22, 20],
        },
      },
      {
        'id': 'place_other',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 14,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'hamlet',
              'isolated_dwelling',
              'neighbourhood',
            ],
            true, false],
        ],
        'layout': {
          'text-anchor': 'center',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-justify': 'center',
          'text-offset': [0.5, 0],
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_suburb',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 15,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'suburb',
          ],
        ],
        'layout': {
          'text-anchor': 'center',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-justify': 'center',
          'text-offset': [0.5, 0],
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_village',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 14,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'village',
          ],
        ],
        'layout': {
          'icon-size': 0.4,
          'text-anchor': 'left',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-justify': 'left',
          'text-offset': [0.5, 0.2],
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'icon-opacity': 0.7,
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_town',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 15,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'town',
          ],
        ],
        'layout': {
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle-11',
            9, '',
          ],
          'icon-size': 0.4,
          'text-anchor': [
            'step',
            [
              'zoom',
            ],
            'left',
            8, 'center',
          ],
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-justify': 'left',
          'text-offset': [0.5, 0.2],
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'icon-opacity': 0.7,
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_city',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 14,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'city',
          ],
          [
            '\u003E',
            [
              'get',
              'rank',
            ],
            3],
        ],
        'layout': {
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle-11',
            9, '',
          ],
          'icon-size': 0.4,
          'text-anchor': [
            'step',
            [
              'zoom',
            ],
            'left',
            8, 'center',
          ],
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-justify': 'left',
          'text-offset': [0.5, 0.2],
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'icon-opacity': 0.7,
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_city_large',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 12,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '\u003C=',
            [
              'get',
              'rank',
            ],
            3],
          [
            '==',
            [
              'get',
              'class',
            ],
            'city',
          ],
        ],
        'layout': {
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle-11',
            9, '',
          ],
          'icon-size': 0.4,
          'text-anchor': [
            'step',
            [
              'zoom',
            ],
            'left',
            8, 'center',
          ],
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-justify': 'left',
          'text-offset': [0.5, 0.2],
          'text-size': 14,
          'text-transform': 'uppercase',
        },
        'paint': {
          'icon-opacity': 0.7,
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_state',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 12,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'state',
          ],
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-size': 10,
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgb(101,101,101)',
          'text-halo-blur': 1,
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'place_country_other',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 8,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'country',
          ],
          [
            '!',
            [
              'has',
              'iso_a2',
            ],
          ],
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 9, 1, 11],
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgb(101,101,101)',
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1.4,
        },
      },
      {
        'id': 'place_country_minor',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 8,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'country',
          ],
          [
            '\u003E=',
            [
              'get',
              'rank',
            ],
            2],
          [
            'has',
            'iso_a2',
          ],
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 10, 6, 12],
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgb(101,101,101)',
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1.4,
        },
      },
      {
        'id': 'place_country_major',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 6,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '\u003C=',
            [
              'get',
              'rank',
            ],
            1],
          [
            '==',
            [
              'get',
              'class',
            ],
            'country',
          ],
          [
            'has',
            'iso_a2',
          ],
        ],
        'layout': {
          'text-anchor': 'center',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-size': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            0, 10, 3, 12, 4, 14],
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': 'rgb(101,101,101)',
          'text-halo-color': 'rgba(0,0,0,0.7)',
          'text-halo-width': 1.4,
        },
      },
    ],
  },
  liberty: {
    version: 8,
    sources: {
      ne2_shaded: {
        maxzoom: 6,
        tileSize: 256,
        tiles: [
          'https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png',
        ],
        type: 'raster',
      },
      openmaptiles: {
        type: 'vector',
        url: 'https://tiles.openfreemap.org/planet',
      },
    },
    sprite: 'https://tiles.openfreemap.org/sprites/ofm_f384/ofm',
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#f8f4f0',
        },
      },
      {
        id: 'natural_earth',
        type: 'raster',
        source: 'ne2_shaded',
        maxzoom: 7,
        paint: {
          'raster-opacity': [
            'interpolate',
            [
              'exponential',
              1.5],
            [
              'zoom',
            ],
            0, 0.6, 6, 0.1],
        },
      },
      {
        'id': 'park',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'park',
        'paint': {
          'fill-color': '#d8e8c8',
          'fill-opacity': 0.7,
          'fill-outline-color': 'rgba(95, 208, 100, 1)',
        },
      },
      {
        'id': 'park_outline',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'park',
        'paint': {
          'line-color': 'rgba(228, 241, 215, 1)',
          'line-dasharray': [1, 1.5],
        },
      },
      {
        'id': 'landuse_residential',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'maxzoom': 12,
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'residential',
        ],
        'paint': {
          'fill-color': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            9, 'hsla(0,3%,85%,0.84)',
            12, 'hsla(35,57%,88%,0.49)',
          ],
        },
      },
      {
        'id': 'landcover_wood',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'wood',
        ],
        'paint': {
          'fill-antialias': false,
          'fill-color': 'hsla(98,61%,72%,0.7)',
          'fill-opacity': 0.4,
        },
      },
      {
        'id': 'landcover_grass',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'grass',
        ],
        'paint': {
          'fill-antialias': false,
          'fill-color': 'rgba(176, 213, 154, 1)',
          'fill-opacity': 0.3,
        },
      },
      {
        'id': 'landcover_ice',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'ice',
        ],
        'paint': {
          'fill-antialias': false,
          'fill-color': 'rgba(224, 236, 236, 1)',
          'fill-opacity': 0.8,
        },
      },
      {
        'id': 'landcover_wetland',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'minzoom': 12,
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'wetland',
        ],
        'paint': {
          'fill-antialias': true,
          'fill-opacity': 0.8,
          'fill-pattern': 'wetland_bg_11',
          'fill-translate-anchor': 'map',
        },
      },
      {
        'id': 'landuse_pitch',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'pitch',
        ],
        'paint': {
          'fill-color': '#DEE3CD',
        },
      },
      {
        'id': 'landuse_track',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'track',
        ],
        'paint': {
          'fill-color': '#DEE3CD',
        },
      },
      {
        'id': 'landuse_cemetery',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'cemetery',
        ],
        'paint': {
          'fill-color': 'hsl(75,37%,81%)',
        },
      },
      {
        'id': 'landuse_hospital',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'hospital',
        ],
        'paint': {
          'fill-color': '#fde',
        },
      },
      {
        'id': 'landuse_school',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landuse',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'school',
        ],
        'paint': {
          'fill-color': 'rgb(236,238,204)',
        },
      },
      {
        'id': 'waterway_tunnel',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'waterway',
        'filter': [
          '==',
          [
            'get',
            'brunnel',
          ],
          'tunnel',
        ],
        'paint': {
          'line-color': '#a0c8f0',
          'line-dasharray': [3, 3],
          'line-gap-width': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            12, 0, 20, 6],
          'line-opacity': 1,
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            8, 1, 20, 2],
        },
      },
      {
        'id': 'waterway_river',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'waterway',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'river',
          ],
          [
            '!=',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-cap': 'round',
        },
        'paint': {
          'line-color': '#a0c8f0',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            11, 0.5, 20, 6],
        },
      },
      {
        'id': 'waterway_other',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'waterway',
        'filter': [
          'all',
          [
            '!=',
            [
              'get',
              'class',
            ],
            'river',
          ],
          [
            '!=',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-cap': 'round',
        },
        'paint': {
          'line-color': '#a0c8f0',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.3],
            [
              'zoom',
            ],
            13, 0.5, 20, 6],
        },
      },
      {
        'id': 'water',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'water',
        'filter': [
          '!=',
          [
            'get',
            'brunnel',
          ],
          'tunnel',
        ],
        'paint': {
          'fill-color': 'rgb(158,189,255)',
        },
      },
      {
        'id': 'landcover_sand',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'landcover',
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'sand',
        ],
        'paint': {
          'fill-color': 'rgba(247, 239, 195, 1)',
        },
      },
      {
        'id': 'aeroway_fill',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 11,
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'MultiPolygon',
            'Polygon',
          ],
          true, false],
        'paint': {
          'fill-color': 'rgba(229, 228, 224, 1)',
          'fill-opacity': 0.7,
        },
      },
      {
        'id': 'aeroway_runway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 11,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'runway',
          ],
        ],
        'paint': {
          'line-color': '#f0ede9',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            11, 3, 20, 16],
        },
      },
      {
        'id': 'aeroway_taxiway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'aeroway',
        'minzoom': 11,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'class',
            ],
            'taxiway',
          ],
        ],
        'paint': {
          'line-color': '#f0ede9',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            11, 0.5, 20, 6],
        },
      },
      {
        'id': 'tunnel_motorway_link_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-dasharray': [0.5, 0.25],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 1, 13, 3, 14, 4, 20, 15],
        },
      },
      {
        'id': 'tunnel_service_track_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#cfcdca',
          'line-dasharray': [0.5, 0.25],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15, 1, 16, 4, 20, 11],
        },
      },
      {
        'id': 'tunnel_link_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 1, 13, 3, 14, 4, 20, 15],
        },
      },
      {
        'id': 'tunnel_street_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'street',
              'street_limited',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#cfcdca',
          'line-opacity': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            12, 0, 12.5, 1],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 0.5, 13, 1, 14, 4, 20, 15],
        },
      },
      {
        'id': 'tunnel_secondary_tertiary_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'secondary',
              'tertiary',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            8, 1.5, 20, 17],
        },
      },
      {
        'id': 'tunnel_trunk_primary_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0.4, 6, 0.7, 7, 1.75, 20, 22],
        },
      },
      {
        'id': 'tunnel_motorway_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-dasharray': [0.5, 0.25],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0.4, 6, 0.7, 7, 1.75, 20, 22],
        },
      },
      {
        'id': 'tunnel_path_pedestrian',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'path',
              'pedestrian',
            ],
            true, false],
        ],
        'paint': {
          'line-color': 'hsl(0,0%,100%)',
          'line-dasharray': [1, 0.75],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            14, 0.5, 20, 10],
        },
      },
      {
        'id': 'tunnel_motorway_link',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fc8',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12.5, 0, 13, 1.5, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'tunnel_service_track',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15.5, 0, 16, 2, 20, 7.5],
        },
      },
      {
        'id': 'tunnel_link',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff4c6',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12.5, 0, 13, 1.5, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'tunnel_minor',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'minor',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            13.5, 0, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'tunnel_secondary_tertiary',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'secondary',
              'tertiary',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff4c6',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            6.5, 0, 7, 0.5, 20, 10],
        },
      },
      {
        'id': 'tunnel_trunk_primary',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff4c6',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0, 7, 1, 20, 18],
        },
      },
      {
        'id': 'tunnel_motorway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#ffdaa6',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0, 7, 1, 20, 18],
        },
      },
      {
        'id': 'tunnel_major_rail',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'rail',
            ],
            true, false],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14, 0.4, 15, 0.75, 20, 2],
        },
      },
      {
        'id': 'tunnel_major_rail_hatching',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-dasharray': [0.2, 8],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14.5, 0, 15, 3, 20, 8],
        },
      },
      {
        'id': 'tunnel_transit_rail',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'transit',
            ],
            true, false],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14, 0.4, 15, 0.75, 20, 2],
        },
      },
      {
        'id': 'tunnel_transit_rail_hatching',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'tunnel',
          ],
          [
            '==',
            [
              'get',
              'class',
            ],
            'transit',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-dasharray': [0.2, 8],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14.5, 0, 15, 3, 20, 8],
        },
      },
      {
        'id': 'road_area_pattern',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'MultiPolygon',
            'Polygon',
          ],
          true, false],
        'paint': {
          'fill-pattern': 'pedestrian_polygon',
        },
      },
      {
        'id': 'road_motorway_link_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 12,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 1, 13, 3, 14, 4, 20, 15],
        },
      },
      {
        'id': 'road_service_track_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#cfcdca',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15, 1, 16, 4, 20, 11],
        },
      },
      {
        'id': 'road_link_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 13,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'motorway',
              'path',
              'pedestrian',
              'service',
              'track',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 1, 13, 3, 14, 4, 20, 15],
        },
      },
      {
        'id': 'road_minor_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'minor',
            ],
            true, false],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#cfcdca',
          'line-opacity': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            12, 0, 12.5, 1],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 0.5, 13, 1, 14, 4, 20, 20],
        },
      },
      {
        'id': 'road_secondary_tertiary_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'secondary',
              'tertiary',
            ],
            true, false],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            8, 1.5, 20, 17],
        },
      },
      {
        'id': 'road_trunk_primary_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0.4, 6, 0.7, 7, 1.75, 20, 22],
        },
      },
      {
        'id': 'road_motorway_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 5,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0.4, 6, 0.7, 7, 1.75, 20, 22],
        },
      },
      {
        'id': 'road_path_pedestrian',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 14,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'path',
              'pedestrian',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'hsl(0,0%,100%)',
          'line-dasharray': [1, 0.7],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            14, 1, 20, 10],
        },
      },
      {
        'id': 'road_motorway_link',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 12,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fc8',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12.5, 0, 13, 1.5, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'road_service_track',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15.5, 0, 16, 2, 20, 7.5],
        },
      },
      {
        'id': 'road_link',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 13,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'motorway',
              'path',
              'pedestrian',
              'service',
              'track',
            ],
            false, true],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fea',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12.5, 0, 13, 1.5, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'road_minor',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'minor',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            13.5, 0, 14, 2.5, 20, 18],
        },
      },
      {
        'id': 'road_secondary_tertiary',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'secondary',
              'tertiary',
            ],
            true, false],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fea',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            6.5, 0, 8, 0.5, 20, 13],
        },
      },
      {
        'id': 'road_trunk_primary',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fea',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0, 7, 1, 20, 18],
        },
      },
      {
        'id': 'road_motorway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 5,
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            5, 'hsl(26,87%,62%)',
            6, '#fc8',
          ],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0, 7, 1, 20, 18],
        },
      },
      {
        'id': 'road_major_rail',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14, 0.4, 15, 0.75, 20, 2],
        },
      },
      {
        'id': 'road_major_rail_hatching',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-dasharray': [0.2, 8],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14.5, 0, 15, 3, 20, 8],
        },
      },
      {
        'id': 'road_transit_rail',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'transit',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14, 0.4, 15, 0.75, 20, 2],
        },
      },
      {
        'id': 'road_transit_rail_hatching',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'get',
              'brunnel',
            ],
            [
              'bridge',
              'tunnel',
            ],
            false, true],
          [
            '==',
            [
              'get',
              'class',
            ],
            'transit',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-dasharray': [0.2, 8],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14.5, 0, 15, 3, 20, 8],
        },
      },
      {
        'id': 'road_one_way_arrow',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 16,
        'filter': [
          '==',
          [
            'get',
            'oneway',
          ],
          1],
        'layout': {
          'icon-image': 'arrow',
          'symbol-placement': 'line',
        },
      },
      {
        'id': 'road_one_way_arrow_opposite',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'minzoom': 16,
        'filter': [
          '==',
          [
            'get',
            'oneway',
          ],
          -1],
        'layout': {
          'icon-image': 'arrow',
          'icon-rotate': 180,
          'symbol-placement': 'line',
        },
      },
      {
        'id': 'bridge_motorway_link_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 1, 13, 3, 14, 4, 20, 15],
        },
      },
      {
        'id': 'bridge_service_track_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#cfcdca',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15, 1, 16, 4, 20, 11],
        },
      },
      {
        'id': 'bridge_link_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'link',
          ],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 1, 13, 3, 14, 4, 20, 15],
        },
      },
      {
        'id': 'bridge_street_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'street',
              'street_limited',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'hsl(36,6%,74%)',
          'line-opacity': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            12, 0, 12.5, 1],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12, 0.5, 13, 1, 14, 4, 20, 25],
        },
      },
      {
        'id': 'bridge_path_pedestrian_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'path',
              'pedestrian',
            ],
            true, false],
        ],
        'paint': {
          'line-color': 'hsl(35,6%,80%)',
          'line-dasharray': [1, 0],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            14, 1.5, 20, 18],
        },
      },
      {
        'id': 'bridge_secondary_tertiary_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'secondary',
              'tertiary',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            8, 1.5, 20, 17],
        },
      },
      {
        'id': 'bridge_trunk_primary_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0.4, 6, 0.7, 7, 1.75, 20, 22],
        },
      },
      {
        'id': 'bridge_motorway_casing',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#e9ac77',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0.4, 6, 0.7, 7, 1.75, 20, 22],
        },
      },
      {
        'id': 'bridge_path_pedestrian',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'path',
              'pedestrian',
            ],
            true, false],
        ],
        'paint': {
          'line-color': 'hsl(0,0%,100%)',
          'line-dasharray': [1, 0.3],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            14, 0.5, 20, 10],
        },
      },
      {
        'id': 'bridge_motorway_link',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '==',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fc8',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12.5, 0, 13, 1.5, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'bridge_service_track',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            15.5, 0, 16, 2, 20, 7.5],
        },
      },
      {
        'id': 'bridge_link',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'link',
          ],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fea',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            12.5, 0, 13, 1.5, 14, 2.5, 20, 11.5],
        },
      },
      {
        'id': 'bridge_street',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'minor',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fff',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            13.5, 0, 14, 2.5, 20, 18],
        },
      },
      {
        'id': 'bridge_secondary_tertiary',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'secondary',
              'tertiary',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fea',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            6.5, 0, 7, 0.5, 20, 10],
        },
      },
      {
        'id': 'bridge_trunk_primary',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'primary',
              'trunk',
            ],
            true, false],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fea',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0, 7, 1, 20, 18],
        },
      },
      {
        'id': 'bridge_motorway',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'motorway',
          ],
          [
            '!=',
            [
              'get',
              'ramp',
            ],
            1],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'layout': {
          'line-join': 'round',
        },
        'paint': {
          'line-color': '#fc8',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            5, 0, 7, 1, 20, 18],
        },
      },
      {
        'id': 'bridge_major_rail',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14, 0.4, 15, 0.75, 20, 2],
        },
      },
      {
        'id': 'bridge_major_rail_hatching',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'rail',
          ],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-dasharray': [0.2, 8],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14.5, 0, 15, 3, 20, 8],
        },
      },
      {
        'id': 'bridge_transit_rail',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'transit',
          ],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14, 0.4, 15, 0.75, 20, 2],
        },
      },
      {
        'id': 'bridge_transit_rail_hatching',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'transportation',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'transit',
          ],
          [
            '==',
            [
              'get',
              'brunnel',
            ],
            'bridge',
          ],
        ],
        'paint': {
          'line-color': '#bbb',
          'line-dasharray': [0.2, 8],
          'line-width': [
            'interpolate',
            [
              'exponential',
              1.4],
            [
              'zoom',
            ],
            14.5, 0, 15, 3, 20, 8],
        },
      },
      {
        'id': 'building',
        'type': 'fill',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'minzoom': 13,
        'maxzoom': 14,
        'paint': {
          'fill-color': 'hsl(35,8%,85%)',
          'fill-outline-color': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            13, 'hsla(35,6%,79%,0.32)',
            14, 'hsl(35,6%,79%)',
          ],
        },
      },
      {
        'id': 'building-3d',
        'type': 'fill-extrusion',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'minzoom': 14,
        'paint': {
          'fill-extrusion-base': [
            'get',
            'render_min_height',
          ],
          'fill-extrusion-color': 'hsl(35,8%,85%)',
          'fill-extrusion-height': [
            'get',
            'render_height',
          ],
          'fill-extrusion-opacity': 0.8,
        },
      },
      {
        'id': 'boundary_3',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'boundary',
        'minzoom': 5,
        'filter': [
          'all',
          [
            '\u003E=',
            [
              'get',
              'admin_level',
            ],
            3],
          [
            '\u003C=',
            [
              'get',
              'admin_level',
            ],
            6],
          [
            '!=',
            [
              'get',
              'maritime',
            ],
            1],
          [
            '!=',
            [
              'get',
              'disputed',
            ],
            1],
          [
            '!',
            [
              'has',
              'claimed_by',
            ],
          ],
        ],
        'paint': {
          'line-color': 'hsl(0,0%,70%)',
          'line-dasharray': [1, 1],
          'line-width': [
            'interpolate',
            [
              'linear',
              1],
            [
              'zoom',
            ],
            7, 1, 11, 2],
        },
      },
      {
        'id': 'boundary_2',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'boundary',
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'admin_level',
            ],
            2],
          [
            '!=',
            [
              'get',
              'maritime',
            ],
            1],
          [
            '!=',
            [
              'get',
              'disputed',
            ],
            1],
          [
            '!',
            [
              'has',
              'claimed_by',
            ],
          ],
        ],
        'layout': {
          'line-cap': 'round',
          'line-join': 'round',
        },
        'paint': {
          'line-color': 'hsl(248,1%,41%)',
          'line-opacity': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 0.4, 4, 1],
          'line-width': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            3, 1, 5, 1.2, 12, 3],
        },
      },
      {
        'id': 'boundary_disputed',
        'type': 'line',
        'source': 'openmaptiles',
        'source-layer': 'boundary',
        'filter': [
          'all',
          [
            '!=',
            [
              'get',
              'maritime',
            ],
            1],
          [
            '==',
            [
              'get',
              'disputed',
            ],
            1],
        ],
        'paint': {
          'line-color': 'hsl(248,1%,41%)',
          'line-dasharray': [1, 2],
          'line-width': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            3, 1, 5, 1.2, 12, 3],
        },
      },
      {
        'id': 'waterway_line_label',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'waterway',
        'minzoom': 10,
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'LineString',
            'MultiLineString',
          ],
          true, false],
        'layout': {
          'symbol-placement': 'line',
          'symbol-spacing': 350,
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              ' ',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-letter-spacing': 0.2,
          'text-max-width': 5,
          'text-size': 14,
        },
        'paint': {
          'text-color': '#74aee9',
          'text-halo-color': 'rgba(255,255,255,0.7)',
          'text-halo-width': 1.5,
        },
      },
      {
        'id': 'water_name_point_label',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'water_name',
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'MultiPoint',
            'Point',
          ],
          true, false],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-letter-spacing': 0.2,
          'text-max-width': 5,
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            0, 10, 8, 14],
        },
        'paint': {
          'text-color': '#495e91',
          'text-halo-color': 'rgba(255,255,255,0.7)',
          'text-halo-width': 1.5,
        },
      },
      {
        'id': 'water_name_line_label',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'water_name',
        'filter': [
          'match',
          [
            'geometry-type',
          ],
          [
            'LineString',
            'MultiLineString',
          ],
          true, false],
        'layout': {
          'symbol-placement': 'line',
          'symbol-spacing': 350,
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              ' ',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-letter-spacing': 0.2,
          'text-max-width': 5,
          'text-size': 14,
        },
        'paint': {
          'text-color': '#495e91',
          'text-halo-color': 'rgba(255,255,255,0.7)',
          'text-halo-width': 1.5,
        },
      },
      {
        'id': 'poi_r20',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'poi',
        'minzoom': 17,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '\u003E=',
            [
              'get',
              'rank',
            ],
            20],
        ],
        'layout': {
          'icon-image': [
            'match',
            [
              'get',
              'subclass',
            ],
            [
              'florist',
              'furniture',
            ],
            [
              'get',
              'subclass',
            ],
            [
              'get',
              'class',
            ],
          ],
          'text-anchor': 'top',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-max-width': 9,
          'text-offset': [0, 0.6],
          'text-size': 12,
        },
        'paint': {
          'text-color': '#666',
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'poi_r7',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'poi',
        'minzoom': 16,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '\u003E=',
            [
              'get',
              'rank',
            ],
            7],
          [
            '\u003C',
            [
              'get',
              'rank',
            ],
            20],
        ],
        'layout': {
          'icon-image': [
            'match',
            [
              'get',
              'subclass',
            ],
            [
              'florist',
              'furniture',
            ],
            [
              'get',
              'subclass',
            ],
            [
              'get',
              'class',
            ],
          ],
          'text-anchor': 'top',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-max-width': 9,
          'text-offset': [0, 0.6],
          'text-size': 12,
        },
        'paint': {
          'text-color': '#666',
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'poi_r1',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'poi',
        'minzoom': 15,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'MultiPoint',
              'Point',
            ],
            true, false],
          [
            '\u003E=',
            [
              'get',
              'rank',
            ],
            1],
          [
            '\u003C',
            [
              'get',
              'rank',
            ],
            7],
        ],
        'layout': {
          'icon-image': [
            'match',
            [
              'get',
              'subclass',
            ],
            [
              'florist',
              'furniture',
            ],
            [
              'get',
              'subclass',
            ],
            [
              'get',
              'class',
            ],
          ],
          'text-anchor': 'top',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-max-width': 9,
          'text-offset': [0, 0.6],
          'text-size': 12,
        },
        'paint': {
          'text-color': '#666',
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'poi_transit',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'poi',
        'filter': [
          'match',
          [
            'get',
            'class',
          ],
          [
            'airport',
            'bus',
            'rail',
          ],
          true, false],
        'layout': {
          'icon-image': [
            'to-string',
            [
              'get',
              'class',
            ],
          ],
          'icon-size': 0.7,
          'text-anchor': 'left',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-max-width': 9,
          'text-offset': [0.9, 0],
          'text-size': 12,
        },
        'paint': {
          'text-color': '#2e5a80',
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'highway-name-path',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'minzoom': 15.5,
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'path',
        ],
        'layout': {
          'symbol-placement': 'line',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              ' ',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'map',
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            13, 12, 14, 13],
        },
        'paint': {
          'text-color': 'hsl(30,23%,62%)',
          'text-halo-color': '#f8f4f0',
          'text-halo-width': 0.5,
        },
      },
      {
        'id': 'highway-name-minor',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'minzoom': 15,
        'filter': [
          'all',
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'class',
            ],
            [
              'minor',
              'service',
              'track',
            ],
            true, false],
        ],
        'layout': {
          'symbol-placement': 'line',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              ' ',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'map',
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            13, 12, 14, 13],
        },
        'paint': {
          'text-color': '#666',
          'text-halo-blur': 0.5,
          'text-halo-width': 1,
        },
      },
      {
        'id': 'highway-name-major',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'minzoom': 12.2,
        'filter': [
          'match',
          [
            'get',
            'class',
          ],
          [
            'primary',
            'secondary',
            'tertiary',
            'trunk',
          ],
          true, false],
        'layout': {
          'symbol-placement': 'line',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              ' ',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'map',
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            13, 12, 14, 13],
        },
        'paint': {
          'text-color': '#666',
          'text-halo-blur': 0.5,
          'text-halo-width': 1,
        },
      },
      {
        'id': 'highway-shield-non-us',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'minzoom': 8,
        'filter': [
          'all',
          [
            '\u003C=',
            [
              'get',
              'ref_length',
            ],
            6],
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'network',
            ],
            [
              'us-highway',
              'us-interstate',
              'us-state',
            ],
            false, true],
        ],
        'layout': {
          'icon-image': [
            'concat',
            'road_',
            [
              'get',
              'ref_length',
            ],
          ],
          'icon-rotation-alignment': 'viewport',
          'icon-size': 1,
          'symbol-placement': [
            'step',
            [
              'zoom',
            ],
            'point',
            11, 'line',
          ],
          'symbol-spacing': 200,
          'text-field': [
            'to-string',
            [
              'get',
              'ref',
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'viewport',
          'text-size': 10,
        },
      },
      {
        'id': 'highway-shield-us-interstate',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'minzoom': 7,
        'filter': [
          'all',
          [
            '\u003C=',
            [
              'get',
              'ref_length',
            ],
            6],
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'network',
            ],
            [
              'us-interstate',
            ],
            true, false],
        ],
        'layout': {
          'icon-image': [
            'concat',
            [
              'get',
              'network',
            ],
            '_',
            [
              'get',
              'ref_length',
            ],
          ],
          'icon-rotation-alignment': 'viewport',
          'icon-size': 1,
          'symbol-placement': [
            'step',
            [
              'zoom',
            ],
            'point',
            7, 'line',
            8, 'line',
          ],
          'symbol-spacing': 200,
          'text-field': [
            'to-string',
            [
              'get',
              'ref',
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'viewport',
          'text-size': 10,
        },
      },
      {
        'id': 'road_shield_us',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'transportation_name',
        'minzoom': 9,
        'filter': [
          'all',
          [
            '\u003C=',
            [
              'get',
              'ref_length',
            ],
            6],
          [
            'match',
            [
              'geometry-type',
            ],
            [
              'LineString',
              'MultiLineString',
            ],
            true, false],
          [
            'match',
            [
              'get',
              'network',
            ],
            [
              'us-highway',
              'us-state',
            ],
            true, false],
        ],
        'layout': {
          'icon-image': [
            'concat',
            [
              'get',
              'network',
            ],
            '_',
            [
              'get',
              'ref_length',
            ],
          ],
          'icon-rotation-alignment': 'viewport',
          'icon-size': 1,
          'symbol-placement': [
            'step',
            [
              'zoom',
            ],
            'point',
            11, 'line',
          ],
          'symbol-spacing': 200,
          'text-field': [
            'to-string',
            [
              'get',
              'ref',
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-rotation-alignment': 'viewport',
          'text-size': 10,
        },
      },
      {
        'id': 'airport',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'aerodrome_label',
        'minzoom': 10,
        'filter': [
          'all',
          [
            'has',
            'iata',
          ],
        ],
        'layout': {
          'icon-image': 'airport_11',
          'icon-size': 1,
          'text-anchor': 'top',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-max-width': 9,
          'text-offset': [0, 0.6],
          'text-optional': true,
          'text-padding': 2,
          'text-size': 12,
        },
        'paint': {
          'text-color': '#666',
          'text-halo-blur': 0.5,
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_other',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 8,
        'filter': [
          'match',
          [
            'get',
            'class',
          ],
          [
            'city',
            'continent',
            'country',
            'state',
            'town',
            'village',
          ],
          false, true],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-letter-spacing': 0.1,
          'text-max-width': 9,
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            8, 9, 12, 10],
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': '#333',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_village',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 9,
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'village',
        ],
        'layout': {
          'icon-allow-overlap': true,
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle_11_black',
            10, '',
          ],
          'icon-optional': false,
          'icon-size': 0.2,
          'text-anchor': 'bottom',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-max-width': 8,
          'text-size': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            7, 10, 11, 12],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_town',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 6,
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'town',
        ],
        'layout': {
          'icon-allow-overlap': true,
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle_11_black',
            10, '',
          ],
          'icon-optional': false,
          'icon-size': 0.2,
          'text-anchor': 'bottom',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-max-width': 8,
          'text-size': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            7, 12, 11, 14],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_state',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 5,
        'maxzoom': 8,
        'filter': [
          '==',
          [
            'get',
            'class',
          ],
          'state',
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Italic',
          ],
          'text-letter-spacing': 0.2,
          'text-max-width': 9,
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            5, 10, 8, 14],
          'text-transform': 'uppercase',
        },
        'paint': {
          'text-color': '#333',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_city',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 3,
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'city',
          ],
          [
            '!=',
            [
              'get',
              'capital',
            ],
            2],
        ],
        'layout': {
          'icon-allow-overlap': true,
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle_11_black',
            9, '',
          ],
          'icon-optional': false,
          'icon-size': 0.4,
          'text-anchor': 'bottom',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Regular',
          ],
          'text-max-width': 8,
          'text-offset': [0, -0.1],
          'text-size': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            4, 11, 7, 13, 11, 18],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_city_capital',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 3,
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'city',
          ],
          [
            '==',
            [
              'get',
              'capital',
            ],
            2],
        ],
        'layout': {
          'icon-allow-overlap': true,
          'icon-image': [
            'step',
            [
              'zoom',
            ],
            'circle_11_black',
            9, '',
          ],
          'icon-optional': false,
          'icon-size': 0.5,
          'text-anchor': 'bottom',
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Bold',
          ],
          'text-max-width': 8,
          'text-offset': [0, -0.2],
          'text-size': [
            'interpolate',
            [
              'exponential',
              1.2],
            [
              'zoom',
            ],
            4, 12, 7, 14, 11, 20],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_country_3',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'minzoom': 2,
        'maxzoom': 9,
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'country',
          ],
          [
            '\u003E=',
            [
              'get',
              'rank',
            ],
            3],
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Bold',
          ],
          'text-max-width': 6.25,
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            3, 9, 7, 17],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_country_2',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 9,
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'country',
          ],
          [
            '==',
            [
              'get',
              'rank',
            ],
            2],
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Bold',
          ],
          'text-max-width': 6.25,
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            2, 9, 5, 17],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
      {
        'id': 'label_country_1',
        'type': 'symbol',
        'source': 'openmaptiles',
        'source-layer': 'place',
        'maxzoom': 9,
        'filter': [
          'all',
          [
            '==',
            [
              'get',
              'class',
            ],
            'country',
          ],
          [
            '==',
            [
              'get',
              'rank',
            ],
            1],
        ],
        'layout': {
          'text-field': [
            'case',
            [
              'has',
              'name:nonlatin',
            ],
            [
              'concat',
              [
                'get',
                'name:latin',
              ],
              '\n',
              [
                'get',
                'name:nonlatin',
              ],
            ],
            [
              'coalesce',
              [
                'get',
                'name_en',
              ],
              [
                'get',
                'name',
              ],
            ],
          ],
          'text-font': [
            'Noto Sans Bold',
          ],
          'text-max-width': 6.25,
          'text-size': [
            'interpolate',
            [
              'linear',
            ],
            [
              'zoom',
            ],
            1, 9, 4, 17],
        },
        'paint': {
          'text-color': '#000',
          'text-halo-blur': 1,
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      },
    ],
  },
  bright: 'https://tiles.openfreemap.org/styles/bright',
  // night: [
  //   {
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#242f3e',
  //       },
  //     ],
  //   },
  //   {
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#746855',
  //       },
  //     ],
  //   },
  //   {
  //     elementType: 'labels.text.stroke',
  //     stylers: [
  //       {
  //         color: '#242f3e',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'administrative.locality',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#d59563',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#d59563',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi.park',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#263c3f',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi.park',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#6b9a76',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#38414e',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road',
  //     elementType: 'geometry.stroke',
  //     stylers: [
  //       {
  //         color: '#212a37',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#9ca5b3',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#746855',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway',
  //     elementType: 'geometry.stroke',
  //     stylers: [
  //       {
  //         color: '#1f2835',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#f3d19c',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'transit',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#2f3948',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'transit.station',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#d59563',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'water',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#17263c',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'water',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#515c6d',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'water',
  //     elementType: 'labels.text.stroke',
  //     stylers: [
  //       {
  //         color: '#17263c',
  //       },
  //     ],
  //   },
  // ],
  // light: [],
  // retro: [
  //   {
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#ebe3cd',
  //       },
  //     ],
  //   },
  //   {
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#523735',
  //       },
  //     ],
  //   },
  //   {
  //     elementType: 'labels.text.stroke',
  //     stylers: [
  //       {
  //         color: '#f5f1e6',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'administrative',
  //     elementType: 'geometry.stroke',
  //     stylers: [
  //       {
  //         color: '#c9b2a6',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'administrative.land_parcel',
  //     elementType: 'geometry.stroke',
  //     stylers: [
  //       {
  //         color: '#dcd2be',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'administrative.land_parcel',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#ae9e90',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'landscape.natural',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#dfd2ae',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#dfd2ae',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#93817c',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi.park',
  //     elementType: 'geometry.fill',
  //     stylers: [
  //       {
  //         color: '#a5b076',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'poi.park',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#447530',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#f5f1e6',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.arterial',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#fdfcf8',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#f8c967',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway',
  //     elementType: 'geometry.stroke',
  //     stylers: [
  //       {
  //         color: '#e9bc62',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway.controlled_access',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#e98d58',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.highway.controlled_access',
  //     elementType: 'geometry.stroke',
  //     stylers: [
  //       {
  //         color: '#db8555',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'road.local',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#806b63',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'transit.line',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#dfd2ae',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'transit.line',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#8f7d77',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'transit.line',
  //     elementType: 'labels.text.stroke',
  //     stylers: [
  //       {
  //         color: '#ebe3cd',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'transit.station',
  //     elementType: 'geometry',
  //     stylers: [
  //       {
  //         color: '#dfd2ae',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'water',
  //     elementType: 'geometry.fill',
  //     stylers: [
  //       {
  //         color: '#b9d3c2',
  //       },
  //     ],
  //   },
  //   {
  //     featureType: 'water',
  //     elementType: 'labels.text.fill',
  //     stylers: [
  //       {
  //         color: '#92998d',
  //       },
  //     ],
  //   },
  // ],
}

export type MapStyleValue = typeof mapStyles[keyof typeof mapStyles]
export type MapStyle = keyof typeof mapStyles
