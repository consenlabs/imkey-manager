"use strict";

var KOVAN_RPC_URL = 'https://kovan.infura.io';
var ETHEREUM_MAIN_NET = 'https://kovan.infura.io';

var _require = require('electron'),
    remote = _require.remote;

var dialog = require('electron').remote.dialog;

var provider = remote.app.provider;
var apirouter = remote.app.apirouter;

var ImKeyProvider = require('../../../imkey-web3-provider')["default"];

var imkeyProvider = new ImKeyProvider({
  rpcUrl: 'https://kovan.infura.io/v3/e35ac016a10548f1b4a835a1cd72d17a',
  // rpcUrl: 'https://eth-mainnet.token.im',
  chainId: 42,
  // headers: {
  //   agent: 'ios:2.4.2:2',
  // },
  headers: null,
  apirouter: apirouter,
  dialog: dialog
});

var Web3 = require('web3');

var web3Window = new Web3(imkeyProvider);
window.web3 = web3Window;
window.ethereum = imkeyProvider;
window.eth = imkeyProvider;
web3.eth.accounts = ['hhhh', '22'];
console.log(web3.eth.accounts);

function test() {
  return regeneratorRuntime.async(function test$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", 'ss');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

var test33 = require('../../../imkey-web3-provider').test33; // console.log(test33)


function test2() {
  var accounts;
  return regeneratorRuntime.async(function test2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log('test2:');
          _context2.next = 4;
          return regeneratorRuntime.awrap(window.ethereum.enable());

        case 4:
          accounts = _context2.sent;
          // window.ethereum.isImToken = true
          // window.top.imToken = imkeyProvider
          // window.imToken = imkeyProvider
          // window.user
          web3.eth.accounts = accounts;
          window.ethereum.selectedAddress = accounts[0];
          window.ethereum = imkeyProvider;
          window.ethereum._isConnected = true; // ethereum.isMetaMask = true

          ethereum.isMetaMask = true;

          ethereum.isConnected = function () {
            return true;
          }; // web3.currentProvider = imkeyProvider


          web3.currentProvider.selectedAddress = accounts[0];
          web3.currentProvider.address = accounts[0];
          console.log('acc:', accounts);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
}

test2();
imkeyProvider.on('connect', function (error, payload) {
  console.log('connected..');
});