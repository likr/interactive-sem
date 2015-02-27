'use strict';
var assert = require('power-assert').customize({output: {maxDepth: 2}});
var sinon = require('sinon');

var stubDispatcher = require('../../mocks/isem/variable-array-dispatcher').stub;
var Store = require('../../../app/src/scripts/modules/variable-array-store').singleton;

describe('VariableArrayStore', () => {
  describe('#register()', () => {
    before(() => {
      Store.register();
    });

    it('should do Dispatcher#init()', () => {
      assert(stubDispatcher.init.callCount === 1);
    });

    it('should do Dispatcher#registerOnAddVariable()', () => {
      assert(stubDispatcher.registerOnAddVariable.callCount === 1);
    });

    it('should give the callback to arg[0] of Dispatcher#registerOnAddVariable()', () => {
      var actual = stubDispatcher.registerOnAddVariable.getCall(0).args[0];
      var expected = Store.onAddVariableCallback();
      assert(String(actual) === String(expected));
    });

    it('should do Dispatcher#registerOnImportFile()', () => {
      assert(stubDispatcher.registerOnImportFile.callCount === 1);
    });

    it('should give the callback to arg[0] of Dispatcher#registerOnImportFile()', () => {
      var actual = stubDispatcher.registerOnImportFile.getCall(0).args[0];
      var expected = Store.onImportFileCallback();
      assert(String(actual) === String(expected));
    });
  });
});