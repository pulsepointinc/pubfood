/**
 * pubfood
 * Copyright (c) 2015 Yieldbot, Inc. - All rights reserved.
 */

/* global */
/*eslint no-unused-vars: 0*/

'use strict';

var auctionexample1 = {
  slots: [
    {
      name: '/2476204/multi-size',
      sizes: [
        [300, 250],
        [300, 600]
      ],
      elementId: 'div-multi-size',
      bidProviders: {
        yieldbot: {
          slot: 'medrec'
        },
        bidderFast: {
          slot: 'fastSlot'
        },
        bidderSlow: {
          slot: 'slowSlot'
        }
      }
    }
  ],
  auctionProvider: {
    name: 'Google',
    libUri: '//www.googletagservices.com/tag/js/gpt.js',
    init: function(slots, bids, options, done) {

    },
    refresh: function(slots, customTargeting, done) {
    },
    trigger: function(done) {
      setTimeout(function() {
        done();
      }, 100);
    }
  },
  bidProviders: [
    {
      name: 'yieldbot',
      libUri: '//cdn.yldbt.com/js/yieldbot.intent.js',
      init: function(slots, options, next, done) {
        done();
      },
      refresh: function(slots, options, done) {
      }
    },
    {
      name: 'partnerFast',
      libUri: '../test/fixture/lib.js',
      init: function(slots, options, next, done) {
        done();
      },
      refresh: function(slots, options, next, done) {
      }
    },
    {
      name: 'partnerSlow',
      libUri: '../test/fixture/lib.js',
      init: function(slots, options, next, done) {
        done();
      },
      refresh: function(slots, options, next, done) {
      }
    }
  ]
};