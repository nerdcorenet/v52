var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Firehose.Consumer = (function() {

  function Consumer(config) {
    var _base, _base1, _base2, _base3, _base4, _base5, _base6;
    this.config = config != null ? config : {};
    this._upgradeTransport = __bind(this._upgradeTransport, this);

    this.stop = __bind(this.stop, this);

    this.connect = __bind(this.connect, this);

    (_base = this.config).message || (_base.message = function() {});
    (_base1 = this.config).error || (_base1.error = function() {});
    (_base2 = this.config).connected || (_base2.connected = function() {});
    (_base3 = this.config).disconnected || (_base3.disconnected = function() {});
    (_base4 = this.config).failed || (_base4.failed = function() {
      throw "Could not connect";
    });
    (_base5 = this.config).params || (_base5.params = {});
    (_base6 = this.config).parse || (_base6.parse = JSON.parse);
    this;

  }

  Consumer.prototype.connect = function(delay) {
    var _this = this;
    if (delay == null) {
      delay = 0;
    }
    this.config.connectionVerified = this._upgradeTransport;
    if (Firehose.WebSocket.supported()) {
      this.upgradeTimeout = setTimeout(function() {
        var ws;
        ws = new Firehose.WebSocket(_this.config);
        return ws.connect(delay);
      }, 500);
    }
    this.transport = new Firehose.LongPoll(this.config);
    this.transport.connect(delay);
  };

  Consumer.prototype.stop = function() {
    if (this.upgradeTimeout != null) {
      clearTimeout(this.upgradeTimeout);
      this.upgradeTimeout = null;
    }
    this.transport.stop();
  };

  Consumer.prototype._upgradeTransport = function(ws) {
    this.transport.stop();
    ws.sendStartingMessageSequence(this.transport.getLastMessageSequence());
    this.transport = ws;
  };

  return Consumer;

})();

