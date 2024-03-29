// source: btcfork.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.btcforkapi.BtcForkTxInput', null, global);
goog.exportSymbol('proto.btcforkapi.BtcForkTxOutput', null, global);
goog.exportSymbol('proto.btcforkapi.Utxo', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.btcforkapi.Utxo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.btcforkapi.Utxo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.btcforkapi.Utxo.displayName = 'proto.btcforkapi.Utxo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.btcforkapi.BtcForkTxInput = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.btcforkapi.BtcForkTxInput.repeatedFields_, null);
};
goog.inherits(proto.btcforkapi.BtcForkTxInput, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.btcforkapi.BtcForkTxInput.displayName = 'proto.btcforkapi.BtcForkTxInput';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.btcforkapi.BtcForkTxOutput = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.btcforkapi.BtcForkTxOutput, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.btcforkapi.BtcForkTxOutput.displayName = 'proto.btcforkapi.BtcForkTxOutput';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.btcforkapi.Utxo.prototype.toObject = function(opt_includeInstance) {
  return proto.btcforkapi.Utxo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.btcforkapi.Utxo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.btcforkapi.Utxo.toObject = function(includeInstance, msg) {
  var f, obj = {
    txhash: jspb.Message.getFieldWithDefault(msg, 1, ""),
    vout: jspb.Message.getFieldWithDefault(msg, 2, 0),
    amount: jspb.Message.getFieldWithDefault(msg, 3, 0),
    address: jspb.Message.getFieldWithDefault(msg, 4, ""),
    scriptpubkey: jspb.Message.getFieldWithDefault(msg, 5, ""),
    derivedpath: jspb.Message.getFieldWithDefault(msg, 6, ""),
    sequence: jspb.Message.getFieldWithDefault(msg, 7, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.btcforkapi.Utxo}
 */
proto.btcforkapi.Utxo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.btcforkapi.Utxo;
  return proto.btcforkapi.Utxo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.btcforkapi.Utxo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.btcforkapi.Utxo}
 */
proto.btcforkapi.Utxo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxhash(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setVout(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setScriptpubkey(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setDerivedpath(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSequence(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.btcforkapi.Utxo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.btcforkapi.Utxo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.btcforkapi.Utxo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.btcforkapi.Utxo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTxhash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVout();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getScriptpubkey();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getDerivedpath();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getSequence();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
};


/**
 * optional string txHash = 1;
 * @return {string}
 */
proto.btcforkapi.Utxo.prototype.getTxhash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setTxhash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 vout = 2;
 * @return {number}
 */
proto.btcforkapi.Utxo.prototype.getVout = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setVout = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional int64 amount = 3;
 * @return {number}
 */
proto.btcforkapi.Utxo.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setAmount = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string address = 4;
 * @return {string}
 */
proto.btcforkapi.Utxo.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string scriptPubKey = 5;
 * @return {string}
 */
proto.btcforkapi.Utxo.prototype.getScriptpubkey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setScriptpubkey = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string derivedPath = 6;
 * @return {string}
 */
proto.btcforkapi.Utxo.prototype.getDerivedpath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setDerivedpath = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional int64 sequence = 7;
 * @return {number}
 */
proto.btcforkapi.Utxo.prototype.getSequence = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.btcforkapi.Utxo} returns this
 */
proto.btcforkapi.Utxo.prototype.setSequence = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.btcforkapi.BtcForkTxInput.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.btcforkapi.BtcForkTxInput.prototype.toObject = function(opt_includeInstance) {
  return proto.btcforkapi.BtcForkTxInput.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.btcforkapi.BtcForkTxInput} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.btcforkapi.BtcForkTxInput.toObject = function(includeInstance, msg) {
  var f, obj = {
    to: jspb.Message.getFieldWithDefault(msg, 1, ""),
    amount: jspb.Message.getFieldWithDefault(msg, 2, 0),
    unspentsList: jspb.Message.toObjectList(msg.getUnspentsList(),
    proto.btcforkapi.Utxo.toObject, includeInstance),
    fee: jspb.Message.getFieldWithDefault(msg, 4, 0),
    changeaddressindex: jspb.Message.getFieldWithDefault(msg, 5, 0),
    changeaddress: jspb.Message.getFieldWithDefault(msg, 6, ""),
    segwit: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.btcforkapi.BtcForkTxInput}
 */
proto.btcforkapi.BtcForkTxInput.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.btcforkapi.BtcForkTxInput;
  return proto.btcforkapi.BtcForkTxInput.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.btcforkapi.BtcForkTxInput} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.btcforkapi.BtcForkTxInput}
 */
proto.btcforkapi.BtcForkTxInput.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTo(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    case 3:
      var value = new proto.btcforkapi.Utxo;
      reader.readMessage(value,proto.btcforkapi.Utxo.deserializeBinaryFromReader);
      msg.addUnspents(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFee(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChangeaddressindex(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setChangeaddress(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setSegwit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.btcforkapi.BtcForkTxInput.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.btcforkapi.BtcForkTxInput.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.btcforkapi.BtcForkTxInput} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.btcforkapi.BtcForkTxInput.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTo();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getUnspentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.btcforkapi.Utxo.serializeBinaryToWriter
    );
  }
  f = message.getFee();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = message.getChangeaddressindex();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = message.getChangeaddress();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getSegwit();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string to = 1;
 * @return {string}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getTo = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.setTo = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int64 amount = 2;
 * @return {number}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.setAmount = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * repeated Utxo unspents = 3;
 * @return {!Array<!proto.btcforkapi.Utxo>}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getUnspentsList = function() {
  return /** @type{!Array<!proto.btcforkapi.Utxo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.btcforkapi.Utxo, 3));
};


/**
 * @param {!Array<!proto.btcforkapi.Utxo>} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
*/
proto.btcforkapi.BtcForkTxInput.prototype.setUnspentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.btcforkapi.Utxo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.btcforkapi.Utxo}
 */
proto.btcforkapi.BtcForkTxInput.prototype.addUnspents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.btcforkapi.Utxo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.clearUnspentsList = function() {
  return this.setUnspentsList([]);
};


/**
 * optional int64 fee = 4;
 * @return {number}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getFee = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.setFee = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional uint32 changeAddressIndex = 5;
 * @return {number}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getChangeaddressindex = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.setChangeaddressindex = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional string changeAddress = 6;
 * @return {string}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getChangeaddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.setChangeaddress = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string segWit = 7;
 * @return {string}
 */
proto.btcforkapi.BtcForkTxInput.prototype.getSegwit = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.BtcForkTxInput} returns this
 */
proto.btcforkapi.BtcForkTxInput.prototype.setSegwit = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.btcforkapi.BtcForkTxOutput.prototype.toObject = function(opt_includeInstance) {
  return proto.btcforkapi.BtcForkTxOutput.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.btcforkapi.BtcForkTxOutput} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.btcforkapi.BtcForkTxOutput.toObject = function(includeInstance, msg) {
  var f, obj = {
    signature: jspb.Message.getFieldWithDefault(msg, 1, ""),
    txhash: jspb.Message.getFieldWithDefault(msg, 2, ""),
    wtxhash: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.btcforkapi.BtcForkTxOutput}
 */
proto.btcforkapi.BtcForkTxOutput.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.btcforkapi.BtcForkTxOutput;
  return proto.btcforkapi.BtcForkTxOutput.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.btcforkapi.BtcForkTxOutput} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.btcforkapi.BtcForkTxOutput}
 */
proto.btcforkapi.BtcForkTxOutput.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSignature(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxhash(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setWtxhash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.btcforkapi.BtcForkTxOutput.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.btcforkapi.BtcForkTxOutput.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.btcforkapi.BtcForkTxOutput} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.btcforkapi.BtcForkTxOutput.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSignature();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTxhash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getWtxhash();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string signature = 1;
 * @return {string}
 */
proto.btcforkapi.BtcForkTxOutput.prototype.getSignature = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.BtcForkTxOutput} returns this
 */
proto.btcforkapi.BtcForkTxOutput.prototype.setSignature = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string txHash = 2;
 * @return {string}
 */
proto.btcforkapi.BtcForkTxOutput.prototype.getTxhash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.BtcForkTxOutput} returns this
 */
proto.btcforkapi.BtcForkTxOutput.prototype.setTxhash = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string wtxHash = 3;
 * @return {string}
 */
proto.btcforkapi.BtcForkTxOutput.prototype.getWtxhash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.btcforkapi.BtcForkTxOutput} returns this
 */
proto.btcforkapi.BtcForkTxOutput.prototype.setWtxhash = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


goog.object.extend(exports, proto.btcforkapi);
