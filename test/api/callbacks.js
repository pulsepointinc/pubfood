/**
 * pubfood
 *
 * - check to make sure that the bidder's done callback was called
 */

/* global describe, it */

'use strict';

/*eslint no-unused-vars: 0*/
/*eslint no-undef: 0*/

require('../common');
var pubfood = require('../../src/pubfood');
var assert = require('chai').assert;
var expect = require('chai').expect;
var Event = require('../../src/event');
var auctionExample = require('../fixture/auctionexample1');

describe('Api Callbacks - Tests', function() {

  beforeEach(function() {
    Event.removeAllListeners();
  });

  it('should call all the callbacks', function(done) {

    var bidProviderDoneCalled = {
      yieldbot: false,
      bidderFast: false,
      bidderSlow: false
    };

    var pf = new pubfood({
      id: 'optionalId',
      auctionProviderCbTimeout: 1,
      bidProviderCbTimeout: 1
    });

    var checkDoneCallbacks = function(_key) {
      describe(_key + ' done callback called', function() {
        it('should be called', function(d) {
          assert(bidProviderDoneCalled[_key], 'done callback was triggered for ' + _key);
          d();
        });
      });
    };

    // add reporter for PUBFOOD_API_START
    pf.observe('PUBFOOD_API_START', function(event) {
      var bidProviders = pf.getBidProviders();
      for(var key in bidProviders){
        bidProviderDoneCalled[key] = false;
      }
    });

    // add reporter for BID_COMPLETE
    pf.observe('BID_COMPLETE', function(event) {
      var data = event.data;
      if (typeof bidProviderDoneCalled[data] !== 'undefined') {
        bidProviderDoneCalled[data] = true;
      }
    });

    // add reporter for AUCTION_COMPLETE
    pf.observe('AUCTION_COMPLETE', function(event) {
      // check to make sure that the bidder's done callback was called
      for (var key in bidProviderDoneCalled) {
        checkDoneCallbacks(key);
      }

      done();
    });

    // add slot
    pf.addSlot(auctionExample.slots[0]);
    pf.addSlot(auctionExample.slots[1]);
    pf.addSlot(auctionExample.slots[2]);

    // set the auction provider
    pf.setAuctionProvider(auctionExample.auctionProvider);

    // add bid providers
    pf.addBidProvider(auctionExample.bidProviders[0]);
    pf.addBidProvider(auctionExample.bidProviders[1]);
    pf.addBidProvider(auctionExample.bidProviders[2]);

    var now = +(new Date());
    var testDone = done;
    pf.start(now, function(hasErrors, details) {
      if(hasErrors){
        testDone();
      }
    });
  });
});
