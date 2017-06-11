/**
 * src https://raw.githubusercontent.com/necolas/react-native-web/master/src/apis/Dimensions/index.js
 * Copyright (c) 2015-present, Nicolas Gallagher.
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 */
var debounce = require('debounce')

var canUseDOM = !!(typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement)

var win = canUseDOM ? window : { screen: {} }

var dimensions = {}

var Dimensions = {
  get: function(dimension) {
    return dimensions[dimension]
  },

  set: function() {
    dimensions.window = {
      fontScale: 1,
      height: win.innerHeight,
      scale: win.devicePixelRatio || 1,
      width: win.innerWidth,
    }

    dimensions.screen = {
      fontScale: 1,
      height: win.screen.height,
      scale: win.devicePixelRatio || 1,
      width: win.screen.width,
    }
  },
}

Dimensions.set()

if (canUseDOM) {
  window.addEventListener('resize', debounce(Dimensions.set, 16), false)
}

module.exports = Dimensions