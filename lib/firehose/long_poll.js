var _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Firehose.LongPoll = (function(_super) {

  __extends(LongPoll, _super);

  LongPoll.prototype.messageSequenceHeader = 'Pragma';

  LongPoll.prototype.name = function() {
    return 'LongPoll';
  };

  LongPoll.ieSupported = function() {
    return $.browser.msie && parseInt($.browser.version) >= 8;
  };

  LongPoll.supported = function() {
    var xhr;
    if (xhr = $.ajaxSettings.xhr()) {
      return "withCredentials" in xhr || Firehose.LongPoll.ieSupported();
    }
  };

  function LongPoll(args) {
    this._error = __bind(this._error, this);

    this._ping = __bind(this._ping, this);

    this._success = __bind(this._success, this);

    this.stop = __bind(this.stop, this);

    this._request = __bind(this._request, this);

    var _base, _base1, _base2;
    LongPoll.__super__.constructor.call(this, args);
    (_base = this.config).longPoll || (_base.longPoll = {});
    (_base1 = this.config.longPoll).url || (_base1.url = "http:" + this.config.uri);
    (_base2 = this.config.longPoll).timeout || (_base2.timeout = 25000);
    this._lagTime = 5000;
    this._timeout = this.config.longPoll.timeout + this._lagTime;
    this._okInterval = 0;
    this._stopRequestLoop = false;
  }

  LongPoll.prototype._request = function() {
    var data;
    if (this._stopRequestLoop) {
      return;
    }
    data = this.config.params;
    data.last_message_sequence = this._lastMessageSequence;
    return this._lastRequest = $.ajax({
      url: this.config.longPoll.url,
      crossDomain: true,
      data: data,
      timeout: this._timeout,
      success: this._success,
      error: this._error,
      cache: false
    });
  };

  LongPoll.prototype.stop = function() {
    this._stopRequestLoop = true;
    if (this._lastRequest != null) {
      try {
        this._lastRequest.abort();
      } catch (e) {

      }
      delete this._lastRequest;
    }
    if (this._lastPingRequest != null) {
      try {
        this._lastPingRequest.abort();
      } catch (e) {

      }
      return delete this._lastPingRequest;
    }
  };

  LongPoll.prototype._success = function(data, status, jqXhr) {
    var last_sequence, message, _ref;
    if (this._needToNotifyOfReconnect || !this._succeeded) {
      this._needToNotifyOfReconnect = false;
      this._open(data);
    }
    if (this._stopRequestLoop) {
      return;
    }
    if (jqXhr.status === 200) {
      try {
        _ref = JSON.parse(jqXhr.responseText), message = _ref.message, last_sequence = _ref.last_sequence;
        this._lastMessageSequence = last_sequence;
        this.config.message(this.config.parse(message));
      } catch (e) {

      }
    }
    return this.connect(this._okInterval);
  };

  LongPoll.prototype._ping = function() {
    var _this = this;
    return this._lastPingRequest = $.ajax({
      url: this.config.longPoll.url,
      method: 'HEAD',
      crossDomain: true,
      data: this.config.params,
      success: function() {
        if (_this._needToNotifyOfReconnect) {
          _this._needToNotifyOfReconnect = false;
          return _this.config.connected(_this);
        }
      }
    });
  };

  LongPoll.prototype._error = function(jqXhr, status, error) {
    if (!(this._needToNotifyOfReconnect || this._stopRequestLoop)) {
      this._needToNotifyOfReconnect = true;
      this.config.disconnected();
    }
    if (!this._stopRequestLoop) {
      setTimeout(this._ping, this._retryDelay + this._lagTime);
      return setTimeout(this._request, this._retryDelay);
    }
  };

  return LongPoll;

})(Firehose.Transport);

if ($.browser.msie && ((_ref = parseInt($.browser.version, 10)) === 8 || _ref === 9)) {
  jQuery.ajaxTransport(function(s) {
    var xdr;
    if (s.crossDomain && s.async) {
      if (s.timeout) {
        s.xdrTimeout = s.timeout;
        delete s.timeout;
      }
      xdr = void 0;
      return {
        send: function(_, complete) {
          var callback;
          callback = function(status, statusText, responses, responseHeaders) {
            xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
            xdr = void 0;
            return complete(status, statusText, responses, responseHeaders);
          };
          xdr = new XDomainRequest();
          xdr.open(s.type, s.url);
          xdr.onload = function() {
            var headers;
            headers = "Content-Type: " + xdr.contentType;
            return callback(200, "OK", {
              text: xdr.responseText
            }, headers);
          };
          xdr.onerror = function() {
            return callback(404, "Not Found");
          };
          if (s.xdrTimeout != null) {
            xdr.ontimeout = function() {
              return callback(0, "timeout");
            };
            xdr.timeout = s.xdrTimeout;
          }
          return xdr.send((s.hasContent && s.data) || null);
        },
        abort: function() {
          if (xdr != null) {
            xdr.onerror = jQuery.noop();
            return xdr.abort();
          }
        }
      };
    }
  });
}

