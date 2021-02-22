/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.api = (function() {

    /**
     * Namespace api.
     * @exports api
     * @namespace
     */
    var api = {};

    api.ImkeyAction = (function() {

        /**
         * Properties of an ImkeyAction.
         * @memberof api
         * @interface IImkeyAction
         * @property {string|null} [method] ImkeyAction method
         * @property {google.protobuf.IAny|null} [param] ImkeyAction param
         */

        /**
         * Constructs a new ImkeyAction.
         * @memberof api
         * @classdesc Represents an ImkeyAction.
         * @implements IImkeyAction
         * @constructor
         * @param {api.IImkeyAction=} [properties] Properties to set
         */
        function ImkeyAction(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ImkeyAction method.
         * @member {string} method
         * @memberof api.ImkeyAction
         * @instance
         */
        ImkeyAction.prototype.method = "";

        /**
         * ImkeyAction param.
         * @member {google.protobuf.IAny|null|undefined} param
         * @memberof api.ImkeyAction
         * @instance
         */
        ImkeyAction.prototype.param = null;

        /**
         * Creates a new ImkeyAction instance using the specified properties.
         * @function create
         * @memberof api.ImkeyAction
         * @static
         * @param {api.IImkeyAction=} [properties] Properties to set
         * @returns {api.ImkeyAction} ImkeyAction instance
         */
        ImkeyAction.create = function create(properties) {
            return new ImkeyAction(properties);
        };

        /**
         * Encodes the specified ImkeyAction message. Does not implicitly {@link api.ImkeyAction.verify|verify} messages.
         * @function encode
         * @memberof api.ImkeyAction
         * @static
         * @param {api.IImkeyAction} message ImkeyAction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImkeyAction.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.method != null && Object.hasOwnProperty.call(message, "method"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.method);
            if (message.param != null && Object.hasOwnProperty.call(message, "param"))
                $root.google.protobuf.Any.encode(message.param, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ImkeyAction message, length delimited. Does not implicitly {@link api.ImkeyAction.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.ImkeyAction
         * @static
         * @param {api.IImkeyAction} message ImkeyAction message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImkeyAction.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ImkeyAction message from the specified reader or buffer.
         * @function decode
         * @memberof api.ImkeyAction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.ImkeyAction} ImkeyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImkeyAction.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.ImkeyAction();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.method = reader.string();
                    break;
                case 2:
                    message.param = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ImkeyAction message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.ImkeyAction
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.ImkeyAction} ImkeyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImkeyAction.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ImkeyAction message.
         * @function verify
         * @memberof api.ImkeyAction
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ImkeyAction.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.method != null && message.hasOwnProperty("method"))
                if (!$util.isString(message.method))
                    return "method: string expected";
            if (message.param != null && message.hasOwnProperty("param")) {
                var error = $root.google.protobuf.Any.verify(message.param);
                if (error)
                    return "param." + error;
            }
            return null;
        };

        /**
         * Creates an ImkeyAction message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.ImkeyAction
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.ImkeyAction} ImkeyAction
         */
        ImkeyAction.fromObject = function fromObject(object) {
            if (object instanceof $root.api.ImkeyAction)
                return object;
            var message = new $root.api.ImkeyAction();
            if (object.method != null)
                message.method = String(object.method);
            if (object.param != null) {
                if (typeof object.param !== "object")
                    throw TypeError(".api.ImkeyAction.param: object expected");
                message.param = $root.google.protobuf.Any.fromObject(object.param);
            }
            return message;
        };

        /**
         * Creates a plain object from an ImkeyAction message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.ImkeyAction
         * @static
         * @param {api.ImkeyAction} message ImkeyAction
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ImkeyAction.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.method = "";
                object.param = null;
            }
            if (message.method != null && message.hasOwnProperty("method"))
                object.method = message.method;
            if (message.param != null && message.hasOwnProperty("param"))
                object.param = $root.google.protobuf.Any.toObject(message.param, options);
            return object;
        };

        /**
         * Converts this ImkeyAction to JSON.
         * @function toJSON
         * @memberof api.ImkeyAction
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ImkeyAction.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ImkeyAction;
    })();

    api.ErrorResponse = (function() {

        /**
         * Properties of an ErrorResponse.
         * @memberof api
         * @interface IErrorResponse
         * @property {boolean|null} [isSuccess] ErrorResponse isSuccess
         * @property {string|null} [error] ErrorResponse error
         */

        /**
         * Constructs a new ErrorResponse.
         * @memberof api
         * @classdesc Represents an ErrorResponse.
         * @implements IErrorResponse
         * @constructor
         * @param {api.IErrorResponse=} [properties] Properties to set
         */
        function ErrorResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorResponse isSuccess.
         * @member {boolean} isSuccess
         * @memberof api.ErrorResponse
         * @instance
         */
        ErrorResponse.prototype.isSuccess = false;

        /**
         * ErrorResponse error.
         * @member {string} error
         * @memberof api.ErrorResponse
         * @instance
         */
        ErrorResponse.prototype.error = "";

        /**
         * Creates a new ErrorResponse instance using the specified properties.
         * @function create
         * @memberof api.ErrorResponse
         * @static
         * @param {api.IErrorResponse=} [properties] Properties to set
         * @returns {api.ErrorResponse} ErrorResponse instance
         */
        ErrorResponse.create = function create(properties) {
            return new ErrorResponse(properties);
        };

        /**
         * Encodes the specified ErrorResponse message. Does not implicitly {@link api.ErrorResponse.verify|verify} messages.
         * @function encode
         * @memberof api.ErrorResponse
         * @static
         * @param {api.IErrorResponse} message ErrorResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.isSuccess != null && Object.hasOwnProperty.call(message, "isSuccess"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSuccess);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            return writer;
        };

        /**
         * Encodes the specified ErrorResponse message, length delimited. Does not implicitly {@link api.ErrorResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.ErrorResponse
         * @static
         * @param {api.IErrorResponse} message ErrorResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer.
         * @function decode
         * @memberof api.ErrorResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.ErrorResponse} ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.ErrorResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.isSuccess = reader.bool();
                    break;
                case 2:
                    message.error = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.ErrorResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.ErrorResponse} ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorResponse message.
         * @function verify
         * @memberof api.ErrorResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                if (typeof message.isSuccess !== "boolean")
                    return "isSuccess: boolean expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            return null;
        };

        /**
         * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.ErrorResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.ErrorResponse} ErrorResponse
         */
        ErrorResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.api.ErrorResponse)
                return object;
            var message = new $root.api.ErrorResponse();
            if (object.isSuccess != null)
                message.isSuccess = Boolean(object.isSuccess);
            if (object.error != null)
                message.error = String(object.error);
            return message;
        };

        /**
         * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.ErrorResponse
         * @static
         * @param {api.ErrorResponse} message ErrorResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.isSuccess = false;
                object.error = "";
            }
            if (message.isSuccess != null && message.hasOwnProperty("isSuccess"))
                object.isSuccess = message.isSuccess;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            return object;
        };

        /**
         * Converts this ErrorResponse to JSON.
         * @function toJSON
         * @memberof api.ErrorResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ErrorResponse;
    })();

    api.CommonResponse = (function() {

        /**
         * Properties of a CommonResponse.
         * @memberof api
         * @interface ICommonResponse
         * @property {string|null} [result] CommonResponse result
         */

        /**
         * Constructs a new CommonResponse.
         * @memberof api
         * @classdesc Represents a CommonResponse.
         * @implements ICommonResponse
         * @constructor
         * @param {api.ICommonResponse=} [properties] Properties to set
         */
        function CommonResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommonResponse result.
         * @member {string} result
         * @memberof api.CommonResponse
         * @instance
         */
        CommonResponse.prototype.result = "";

        /**
         * Creates a new CommonResponse instance using the specified properties.
         * @function create
         * @memberof api.CommonResponse
         * @static
         * @param {api.ICommonResponse=} [properties] Properties to set
         * @returns {api.CommonResponse} CommonResponse instance
         */
        CommonResponse.create = function create(properties) {
            return new CommonResponse(properties);
        };

        /**
         * Encodes the specified CommonResponse message. Does not implicitly {@link api.CommonResponse.verify|verify} messages.
         * @function encode
         * @memberof api.CommonResponse
         * @static
         * @param {api.ICommonResponse} message CommonResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.result);
            return writer;
        };

        /**
         * Encodes the specified CommonResponse message, length delimited. Does not implicitly {@link api.CommonResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.CommonResponse
         * @static
         * @param {api.ICommonResponse} message CommonResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommonResponse message from the specified reader or buffer.
         * @function decode
         * @memberof api.CommonResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.CommonResponse} CommonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.CommonResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommonResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.CommonResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.CommonResponse} CommonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommonResponse message.
         * @function verify
         * @memberof api.CommonResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommonResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isString(message.result))
                    return "result: string expected";
            return null;
        };

        /**
         * Creates a CommonResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.CommonResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.CommonResponse} CommonResponse
         */
        CommonResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.api.CommonResponse)
                return object;
            var message = new $root.api.CommonResponse();
            if (object.result != null)
                message.result = String(object.result);
            return message;
        };

        /**
         * Creates a plain object from a CommonResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.CommonResponse
         * @static
         * @param {api.CommonResponse} message CommonResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommonResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = "";
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this CommonResponse to JSON.
         * @function toJSON
         * @memberof api.CommonResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommonResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CommonResponse;
    })();

    api.AddressParam = (function() {

        /**
         * Properties of an AddressParam.
         * @memberof api
         * @interface IAddressParam
         * @property {string|null} [chainType] AddressParam chainType
         * @property {string|null} [path] AddressParam path
         * @property {string|null} [network] AddressParam network
         * @property {boolean|null} [isSegWit] AddressParam isSegWit
         */

        /**
         * Constructs a new AddressParam.
         * @memberof api
         * @classdesc Represents an AddressParam.
         * @implements IAddressParam
         * @constructor
         * @param {api.IAddressParam=} [properties] Properties to set
         */
        function AddressParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddressParam chainType.
         * @member {string} chainType
         * @memberof api.AddressParam
         * @instance
         */
        AddressParam.prototype.chainType = "";

        /**
         * AddressParam path.
         * @member {string} path
         * @memberof api.AddressParam
         * @instance
         */
        AddressParam.prototype.path = "";

        /**
         * AddressParam network.
         * @member {string} network
         * @memberof api.AddressParam
         * @instance
         */
        AddressParam.prototype.network = "";

        /**
         * AddressParam isSegWit.
         * @member {boolean} isSegWit
         * @memberof api.AddressParam
         * @instance
         */
        AddressParam.prototype.isSegWit = false;

        /**
         * Creates a new AddressParam instance using the specified properties.
         * @function create
         * @memberof api.AddressParam
         * @static
         * @param {api.IAddressParam=} [properties] Properties to set
         * @returns {api.AddressParam} AddressParam instance
         */
        AddressParam.create = function create(properties) {
            return new AddressParam(properties);
        };

        /**
         * Encodes the specified AddressParam message. Does not implicitly {@link api.AddressParam.verify|verify} messages.
         * @function encode
         * @memberof api.AddressParam
         * @static
         * @param {api.IAddressParam} message AddressParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddressParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.chainType);
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.path);
            if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.network);
            if (message.isSegWit != null && Object.hasOwnProperty.call(message, "isSegWit"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isSegWit);
            return writer;
        };

        /**
         * Encodes the specified AddressParam message, length delimited. Does not implicitly {@link api.AddressParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.AddressParam
         * @static
         * @param {api.IAddressParam} message AddressParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddressParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddressParam message from the specified reader or buffer.
         * @function decode
         * @memberof api.AddressParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.AddressParam} AddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddressParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.AddressParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chainType = reader.string();
                    break;
                case 2:
                    message.path = reader.string();
                    break;
                case 3:
                    message.network = reader.string();
                    break;
                case 4:
                    message.isSegWit = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AddressParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.AddressParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.AddressParam} AddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddressParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddressParam message.
         * @function verify
         * @memberof api.AddressParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddressParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.network != null && message.hasOwnProperty("network"))
                if (!$util.isString(message.network))
                    return "network: string expected";
            if (message.isSegWit != null && message.hasOwnProperty("isSegWit"))
                if (typeof message.isSegWit !== "boolean")
                    return "isSegWit: boolean expected";
            return null;
        };

        /**
         * Creates an AddressParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.AddressParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.AddressParam} AddressParam
         */
        AddressParam.fromObject = function fromObject(object) {
            if (object instanceof $root.api.AddressParam)
                return object;
            var message = new $root.api.AddressParam();
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.path != null)
                message.path = String(object.path);
            if (object.network != null)
                message.network = String(object.network);
            if (object.isSegWit != null)
                message.isSegWit = Boolean(object.isSegWit);
            return message;
        };

        /**
         * Creates a plain object from an AddressParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.AddressParam
         * @static
         * @param {api.AddressParam} message AddressParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddressParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.chainType = "";
                object.path = "";
                object.network = "";
                object.isSegWit = false;
            }
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.network != null && message.hasOwnProperty("network"))
                object.network = message.network;
            if (message.isSegWit != null && message.hasOwnProperty("isSegWit"))
                object.isSegWit = message.isSegWit;
            return object;
        };

        /**
         * Converts this AddressParam to JSON.
         * @function toJSON
         * @memberof api.AddressParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddressParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddressParam;
    })();

    api.AddressResult = (function() {

        /**
         * Properties of an AddressResult.
         * @memberof api
         * @interface IAddressResult
         * @property {string|null} [path] AddressResult path
         * @property {string|null} [chainType] AddressResult chainType
         * @property {string|null} [address] AddressResult address
         */

        /**
         * Constructs a new AddressResult.
         * @memberof api
         * @classdesc Represents an AddressResult.
         * @implements IAddressResult
         * @constructor
         * @param {api.IAddressResult=} [properties] Properties to set
         */
        function AddressResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddressResult path.
         * @member {string} path
         * @memberof api.AddressResult
         * @instance
         */
        AddressResult.prototype.path = "";

        /**
         * AddressResult chainType.
         * @member {string} chainType
         * @memberof api.AddressResult
         * @instance
         */
        AddressResult.prototype.chainType = "";

        /**
         * AddressResult address.
         * @member {string} address
         * @memberof api.AddressResult
         * @instance
         */
        AddressResult.prototype.address = "";

        /**
         * Creates a new AddressResult instance using the specified properties.
         * @function create
         * @memberof api.AddressResult
         * @static
         * @param {api.IAddressResult=} [properties] Properties to set
         * @returns {api.AddressResult} AddressResult instance
         */
        AddressResult.create = function create(properties) {
            return new AddressResult(properties);
        };

        /**
         * Encodes the specified AddressResult message. Does not implicitly {@link api.AddressResult.verify|verify} messages.
         * @function encode
         * @memberof api.AddressResult
         * @static
         * @param {api.IAddressResult} message AddressResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddressResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.chainType);
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.address);
            return writer;
        };

        /**
         * Encodes the specified AddressResult message, length delimited. Does not implicitly {@link api.AddressResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.AddressResult
         * @static
         * @param {api.IAddressResult} message AddressResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddressResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddressResult message from the specified reader or buffer.
         * @function decode
         * @memberof api.AddressResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.AddressResult} AddressResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddressResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.AddressResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.path = reader.string();
                    break;
                case 2:
                    message.chainType = reader.string();
                    break;
                case 3:
                    message.address = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AddressResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.AddressResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.AddressResult} AddressResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddressResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddressResult message.
         * @function verify
         * @memberof api.AddressResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddressResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            return null;
        };

        /**
         * Creates an AddressResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.AddressResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.AddressResult} AddressResult
         */
        AddressResult.fromObject = function fromObject(object) {
            if (object instanceof $root.api.AddressResult)
                return object;
            var message = new $root.api.AddressResult();
            if (object.path != null)
                message.path = String(object.path);
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.address != null)
                message.address = String(object.address);
            return message;
        };

        /**
         * Creates a plain object from an AddressResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.AddressResult
         * @static
         * @param {api.AddressResult} message AddressResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddressResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.path = "";
                object.chainType = "";
                object.address = "";
            }
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            return object;
        };

        /**
         * Converts this AddressResult to JSON.
         * @function toJSON
         * @memberof api.AddressResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddressResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddressResult;
    })();

    api.PubKeyParam = (function() {

        /**
         * Properties of a PubKeyParam.
         * @memberof api
         * @interface IPubKeyParam
         * @property {string|null} [chainType] PubKeyParam chainType
         * @property {string|null} [path] PubKeyParam path
         * @property {string|null} [network] PubKeyParam network
         * @property {string|null} [isSegWit] PubKeyParam isSegWit
         */

        /**
         * Constructs a new PubKeyParam.
         * @memberof api
         * @classdesc Represents a PubKeyParam.
         * @implements IPubKeyParam
         * @constructor
         * @param {api.IPubKeyParam=} [properties] Properties to set
         */
        function PubKeyParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PubKeyParam chainType.
         * @member {string} chainType
         * @memberof api.PubKeyParam
         * @instance
         */
        PubKeyParam.prototype.chainType = "";

        /**
         * PubKeyParam path.
         * @member {string} path
         * @memberof api.PubKeyParam
         * @instance
         */
        PubKeyParam.prototype.path = "";

        /**
         * PubKeyParam network.
         * @member {string} network
         * @memberof api.PubKeyParam
         * @instance
         */
        PubKeyParam.prototype.network = "";

        /**
         * PubKeyParam isSegWit.
         * @member {string} isSegWit
         * @memberof api.PubKeyParam
         * @instance
         */
        PubKeyParam.prototype.isSegWit = "";

        /**
         * Creates a new PubKeyParam instance using the specified properties.
         * @function create
         * @memberof api.PubKeyParam
         * @static
         * @param {api.IPubKeyParam=} [properties] Properties to set
         * @returns {api.PubKeyParam} PubKeyParam instance
         */
        PubKeyParam.create = function create(properties) {
            return new PubKeyParam(properties);
        };

        /**
         * Encodes the specified PubKeyParam message. Does not implicitly {@link api.PubKeyParam.verify|verify} messages.
         * @function encode
         * @memberof api.PubKeyParam
         * @static
         * @param {api.IPubKeyParam} message PubKeyParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PubKeyParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.chainType);
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.path);
            if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.network);
            if (message.isSegWit != null && Object.hasOwnProperty.call(message, "isSegWit"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.isSegWit);
            return writer;
        };

        /**
         * Encodes the specified PubKeyParam message, length delimited. Does not implicitly {@link api.PubKeyParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.PubKeyParam
         * @static
         * @param {api.IPubKeyParam} message PubKeyParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PubKeyParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PubKeyParam message from the specified reader or buffer.
         * @function decode
         * @memberof api.PubKeyParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.PubKeyParam} PubKeyParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PubKeyParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.PubKeyParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chainType = reader.string();
                    break;
                case 2:
                    message.path = reader.string();
                    break;
                case 3:
                    message.network = reader.string();
                    break;
                case 4:
                    message.isSegWit = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PubKeyParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.PubKeyParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.PubKeyParam} PubKeyParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PubKeyParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PubKeyParam message.
         * @function verify
         * @memberof api.PubKeyParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PubKeyParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.network != null && message.hasOwnProperty("network"))
                if (!$util.isString(message.network))
                    return "network: string expected";
            if (message.isSegWit != null && message.hasOwnProperty("isSegWit"))
                if (!$util.isString(message.isSegWit))
                    return "isSegWit: string expected";
            return null;
        };

        /**
         * Creates a PubKeyParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.PubKeyParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.PubKeyParam} PubKeyParam
         */
        PubKeyParam.fromObject = function fromObject(object) {
            if (object instanceof $root.api.PubKeyParam)
                return object;
            var message = new $root.api.PubKeyParam();
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.path != null)
                message.path = String(object.path);
            if (object.network != null)
                message.network = String(object.network);
            if (object.isSegWit != null)
                message.isSegWit = String(object.isSegWit);
            return message;
        };

        /**
         * Creates a plain object from a PubKeyParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.PubKeyParam
         * @static
         * @param {api.PubKeyParam} message PubKeyParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PubKeyParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.chainType = "";
                object.path = "";
                object.network = "";
                object.isSegWit = "";
            }
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.network != null && message.hasOwnProperty("network"))
                object.network = message.network;
            if (message.isSegWit != null && message.hasOwnProperty("isSegWit"))
                object.isSegWit = message.isSegWit;
            return object;
        };

        /**
         * Converts this PubKeyParam to JSON.
         * @function toJSON
         * @memberof api.PubKeyParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PubKeyParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PubKeyParam;
    })();

    api.PubKeyResult = (function() {

        /**
         * Properties of a PubKeyResult.
         * @memberof api
         * @interface IPubKeyResult
         * @property {string|null} [path] PubKeyResult path
         * @property {string|null} [chainType] PubKeyResult chainType
         * @property {string|null} [pubKey] PubKeyResult pubKey
         * @property {string|null} [derivedMode] PubKeyResult derivedMode
         */

        /**
         * Constructs a new PubKeyResult.
         * @memberof api
         * @classdesc Represents a PubKeyResult.
         * @implements IPubKeyResult
         * @constructor
         * @param {api.IPubKeyResult=} [properties] Properties to set
         */
        function PubKeyResult(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PubKeyResult path.
         * @member {string} path
         * @memberof api.PubKeyResult
         * @instance
         */
        PubKeyResult.prototype.path = "";

        /**
         * PubKeyResult chainType.
         * @member {string} chainType
         * @memberof api.PubKeyResult
         * @instance
         */
        PubKeyResult.prototype.chainType = "";

        /**
         * PubKeyResult pubKey.
         * @member {string} pubKey
         * @memberof api.PubKeyResult
         * @instance
         */
        PubKeyResult.prototype.pubKey = "";

        /**
         * PubKeyResult derivedMode.
         * @member {string} derivedMode
         * @memberof api.PubKeyResult
         * @instance
         */
        PubKeyResult.prototype.derivedMode = "";

        /**
         * Creates a new PubKeyResult instance using the specified properties.
         * @function create
         * @memberof api.PubKeyResult
         * @static
         * @param {api.IPubKeyResult=} [properties] Properties to set
         * @returns {api.PubKeyResult} PubKeyResult instance
         */
        PubKeyResult.create = function create(properties) {
            return new PubKeyResult(properties);
        };

        /**
         * Encodes the specified PubKeyResult message. Does not implicitly {@link api.PubKeyResult.verify|verify} messages.
         * @function encode
         * @memberof api.PubKeyResult
         * @static
         * @param {api.IPubKeyResult} message PubKeyResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PubKeyResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.chainType);
            if (message.pubKey != null && Object.hasOwnProperty.call(message, "pubKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.pubKey);
            if (message.derivedMode != null && Object.hasOwnProperty.call(message, "derivedMode"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.derivedMode);
            return writer;
        };

        /**
         * Encodes the specified PubKeyResult message, length delimited. Does not implicitly {@link api.PubKeyResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.PubKeyResult
         * @static
         * @param {api.IPubKeyResult} message PubKeyResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PubKeyResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PubKeyResult message from the specified reader or buffer.
         * @function decode
         * @memberof api.PubKeyResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.PubKeyResult} PubKeyResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PubKeyResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.PubKeyResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.path = reader.string();
                    break;
                case 2:
                    message.chainType = reader.string();
                    break;
                case 3:
                    message.pubKey = reader.string();
                    break;
                case 4:
                    message.derivedMode = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PubKeyResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.PubKeyResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.PubKeyResult} PubKeyResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PubKeyResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PubKeyResult message.
         * @function verify
         * @memberof api.PubKeyResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PubKeyResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.pubKey != null && message.hasOwnProperty("pubKey"))
                if (!$util.isString(message.pubKey))
                    return "pubKey: string expected";
            if (message.derivedMode != null && message.hasOwnProperty("derivedMode"))
                if (!$util.isString(message.derivedMode))
                    return "derivedMode: string expected";
            return null;
        };

        /**
         * Creates a PubKeyResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.PubKeyResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.PubKeyResult} PubKeyResult
         */
        PubKeyResult.fromObject = function fromObject(object) {
            if (object instanceof $root.api.PubKeyResult)
                return object;
            var message = new $root.api.PubKeyResult();
            if (object.path != null)
                message.path = String(object.path);
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.pubKey != null)
                message.pubKey = String(object.pubKey);
            if (object.derivedMode != null)
                message.derivedMode = String(object.derivedMode);
            return message;
        };

        /**
         * Creates a plain object from a PubKeyResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.PubKeyResult
         * @static
         * @param {api.PubKeyResult} message PubKeyResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PubKeyResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.path = "";
                object.chainType = "";
                object.pubKey = "";
                object.derivedMode = "";
            }
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.pubKey != null && message.hasOwnProperty("pubKey"))
                object.pubKey = message.pubKey;
            if (message.derivedMode != null && message.hasOwnProperty("derivedMode"))
                object.derivedMode = message.derivedMode;
            return object;
        };

        /**
         * Converts this PubKeyResult to JSON.
         * @function toJSON
         * @memberof api.PubKeyResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PubKeyResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PubKeyResult;
    })();

    api.ExternalAddress = (function() {

        /**
         * Properties of an ExternalAddress.
         * @memberof api
         * @interface IExternalAddress
         * @property {string|null} [address] ExternalAddress address
         * @property {string|null} [derivedPath] ExternalAddress derivedPath
         * @property {string|null} [type] ExternalAddress type
         */

        /**
         * Constructs a new ExternalAddress.
         * @memberof api
         * @classdesc Represents an ExternalAddress.
         * @implements IExternalAddress
         * @constructor
         * @param {api.IExternalAddress=} [properties] Properties to set
         */
        function ExternalAddress(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExternalAddress address.
         * @member {string} address
         * @memberof api.ExternalAddress
         * @instance
         */
        ExternalAddress.prototype.address = "";

        /**
         * ExternalAddress derivedPath.
         * @member {string} derivedPath
         * @memberof api.ExternalAddress
         * @instance
         */
        ExternalAddress.prototype.derivedPath = "";

        /**
         * ExternalAddress type.
         * @member {string} type
         * @memberof api.ExternalAddress
         * @instance
         */
        ExternalAddress.prototype.type = "";

        /**
         * Creates a new ExternalAddress instance using the specified properties.
         * @function create
         * @memberof api.ExternalAddress
         * @static
         * @param {api.IExternalAddress=} [properties] Properties to set
         * @returns {api.ExternalAddress} ExternalAddress instance
         */
        ExternalAddress.create = function create(properties) {
            return new ExternalAddress(properties);
        };

        /**
         * Encodes the specified ExternalAddress message. Does not implicitly {@link api.ExternalAddress.verify|verify} messages.
         * @function encode
         * @memberof api.ExternalAddress
         * @static
         * @param {api.IExternalAddress} message ExternalAddress message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExternalAddress.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.address);
            if (message.derivedPath != null && Object.hasOwnProperty.call(message, "derivedPath"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.derivedPath);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            return writer;
        };

        /**
         * Encodes the specified ExternalAddress message, length delimited. Does not implicitly {@link api.ExternalAddress.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.ExternalAddress
         * @static
         * @param {api.IExternalAddress} message ExternalAddress message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExternalAddress.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExternalAddress message from the specified reader or buffer.
         * @function decode
         * @memberof api.ExternalAddress
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.ExternalAddress} ExternalAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExternalAddress.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.ExternalAddress();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.derivedPath = reader.string();
                    break;
                case 3:
                    message.type = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExternalAddress message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.ExternalAddress
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.ExternalAddress} ExternalAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExternalAddress.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExternalAddress message.
         * @function verify
         * @memberof api.ExternalAddress
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExternalAddress.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            if (message.derivedPath != null && message.hasOwnProperty("derivedPath"))
                if (!$util.isString(message.derivedPath))
                    return "derivedPath: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            return null;
        };

        /**
         * Creates an ExternalAddress message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.ExternalAddress
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.ExternalAddress} ExternalAddress
         */
        ExternalAddress.fromObject = function fromObject(object) {
            if (object instanceof $root.api.ExternalAddress)
                return object;
            var message = new $root.api.ExternalAddress();
            if (object.address != null)
                message.address = String(object.address);
            if (object.derivedPath != null)
                message.derivedPath = String(object.derivedPath);
            if (object.type != null)
                message.type = String(object.type);
            return message;
        };

        /**
         * Creates a plain object from an ExternalAddress message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.ExternalAddress
         * @static
         * @param {api.ExternalAddress} message ExternalAddress
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExternalAddress.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.address = "";
                object.derivedPath = "";
                object.type = "";
            }
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            if (message.derivedPath != null && message.hasOwnProperty("derivedPath"))
                object.derivedPath = message.derivedPath;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            return object;
        };

        /**
         * Converts this ExternalAddress to JSON.
         * @function toJSON
         * @memberof api.ExternalAddress
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExternalAddress.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExternalAddress;
    })();

    api.BitcoinWallet = (function() {

        /**
         * Properties of a BitcoinWallet.
         * @memberof api
         * @interface IBitcoinWallet
         * @property {string|null} [path] BitcoinWallet path
         * @property {string|null} [chainType] BitcoinWallet chainType
         * @property {string|null} [address] BitcoinWallet address
         * @property {string|null} [encXPub] BitcoinWallet encXPub
         * @property {api.IExternalAddress|null} [externalAddress] BitcoinWallet externalAddress
         */

        /**
         * Constructs a new BitcoinWallet.
         * @memberof api
         * @classdesc Represents a BitcoinWallet.
         * @implements IBitcoinWallet
         * @constructor
         * @param {api.IBitcoinWallet=} [properties] Properties to set
         */
        function BitcoinWallet(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BitcoinWallet path.
         * @member {string} path
         * @memberof api.BitcoinWallet
         * @instance
         */
        BitcoinWallet.prototype.path = "";

        /**
         * BitcoinWallet chainType.
         * @member {string} chainType
         * @memberof api.BitcoinWallet
         * @instance
         */
        BitcoinWallet.prototype.chainType = "";

        /**
         * BitcoinWallet address.
         * @member {string} address
         * @memberof api.BitcoinWallet
         * @instance
         */
        BitcoinWallet.prototype.address = "";

        /**
         * BitcoinWallet encXPub.
         * @member {string} encXPub
         * @memberof api.BitcoinWallet
         * @instance
         */
        BitcoinWallet.prototype.encXPub = "";

        /**
         * BitcoinWallet externalAddress.
         * @member {api.IExternalAddress|null|undefined} externalAddress
         * @memberof api.BitcoinWallet
         * @instance
         */
        BitcoinWallet.prototype.externalAddress = null;

        /**
         * Creates a new BitcoinWallet instance using the specified properties.
         * @function create
         * @memberof api.BitcoinWallet
         * @static
         * @param {api.IBitcoinWallet=} [properties] Properties to set
         * @returns {api.BitcoinWallet} BitcoinWallet instance
         */
        BitcoinWallet.create = function create(properties) {
            return new BitcoinWallet(properties);
        };

        /**
         * Encodes the specified BitcoinWallet message. Does not implicitly {@link api.BitcoinWallet.verify|verify} messages.
         * @function encode
         * @memberof api.BitcoinWallet
         * @static
         * @param {api.IBitcoinWallet} message BitcoinWallet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BitcoinWallet.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.chainType);
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.address);
            if (message.encXPub != null && Object.hasOwnProperty.call(message, "encXPub"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.encXPub);
            if (message.externalAddress != null && Object.hasOwnProperty.call(message, "externalAddress"))
                $root.api.ExternalAddress.encode(message.externalAddress, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified BitcoinWallet message, length delimited. Does not implicitly {@link api.BitcoinWallet.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.BitcoinWallet
         * @static
         * @param {api.IBitcoinWallet} message BitcoinWallet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BitcoinWallet.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BitcoinWallet message from the specified reader or buffer.
         * @function decode
         * @memberof api.BitcoinWallet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.BitcoinWallet} BitcoinWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BitcoinWallet.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.BitcoinWallet();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.path = reader.string();
                    break;
                case 2:
                    message.chainType = reader.string();
                    break;
                case 3:
                    message.address = reader.string();
                    break;
                case 4:
                    message.encXPub = reader.string();
                    break;
                case 5:
                    message.externalAddress = $root.api.ExternalAddress.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BitcoinWallet message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.BitcoinWallet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.BitcoinWallet} BitcoinWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BitcoinWallet.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BitcoinWallet message.
         * @function verify
         * @memberof api.BitcoinWallet
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BitcoinWallet.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            if (message.encXPub != null && message.hasOwnProperty("encXPub"))
                if (!$util.isString(message.encXPub))
                    return "encXPub: string expected";
            if (message.externalAddress != null && message.hasOwnProperty("externalAddress")) {
                var error = $root.api.ExternalAddress.verify(message.externalAddress);
                if (error)
                    return "externalAddress." + error;
            }
            return null;
        };

        /**
         * Creates a BitcoinWallet message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.BitcoinWallet
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.BitcoinWallet} BitcoinWallet
         */
        BitcoinWallet.fromObject = function fromObject(object) {
            if (object instanceof $root.api.BitcoinWallet)
                return object;
            var message = new $root.api.BitcoinWallet();
            if (object.path != null)
                message.path = String(object.path);
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.address != null)
                message.address = String(object.address);
            if (object.encXPub != null)
                message.encXPub = String(object.encXPub);
            if (object.externalAddress != null) {
                if (typeof object.externalAddress !== "object")
                    throw TypeError(".api.BitcoinWallet.externalAddress: object expected");
                message.externalAddress = $root.api.ExternalAddress.fromObject(object.externalAddress);
            }
            return message;
        };

        /**
         * Creates a plain object from a BitcoinWallet message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.BitcoinWallet
         * @static
         * @param {api.BitcoinWallet} message BitcoinWallet
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BitcoinWallet.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.path = "";
                object.chainType = "";
                object.address = "";
                object.encXPub = "";
                object.externalAddress = null;
            }
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            if (message.encXPub != null && message.hasOwnProperty("encXPub"))
                object.encXPub = message.encXPub;
            if (message.externalAddress != null && message.hasOwnProperty("externalAddress"))
                object.externalAddress = $root.api.ExternalAddress.toObject(message.externalAddress, options);
            return object;
        };

        /**
         * Converts this BitcoinWallet to JSON.
         * @function toJSON
         * @memberof api.BitcoinWallet
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BitcoinWallet.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BitcoinWallet;
    })();

    api.EosWallet = (function() {

        /**
         * Properties of an EosWallet.
         * @memberof api
         * @interface IEosWallet
         * @property {string|null} [chainType] EosWallet chainType
         * @property {string|null} [address] EosWallet address
         * @property {Array.<api.EosWallet.IPubKeyInfo>|null} [publicKeys] EosWallet publicKeys
         */

        /**
         * Constructs a new EosWallet.
         * @memberof api
         * @classdesc Represents an EosWallet.
         * @implements IEosWallet
         * @constructor
         * @param {api.IEosWallet=} [properties] Properties to set
         */
        function EosWallet(properties) {
            this.publicKeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosWallet chainType.
         * @member {string} chainType
         * @memberof api.EosWallet
         * @instance
         */
        EosWallet.prototype.chainType = "";

        /**
         * EosWallet address.
         * @member {string} address
         * @memberof api.EosWallet
         * @instance
         */
        EosWallet.prototype.address = "";

        /**
         * EosWallet publicKeys.
         * @member {Array.<api.EosWallet.IPubKeyInfo>} publicKeys
         * @memberof api.EosWallet
         * @instance
         */
        EosWallet.prototype.publicKeys = $util.emptyArray;

        /**
         * Creates a new EosWallet instance using the specified properties.
         * @function create
         * @memberof api.EosWallet
         * @static
         * @param {api.IEosWallet=} [properties] Properties to set
         * @returns {api.EosWallet} EosWallet instance
         */
        EosWallet.create = function create(properties) {
            return new EosWallet(properties);
        };

        /**
         * Encodes the specified EosWallet message. Does not implicitly {@link api.EosWallet.verify|verify} messages.
         * @function encode
         * @memberof api.EosWallet
         * @static
         * @param {api.IEosWallet} message EosWallet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosWallet.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.chainType);
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.address);
            if (message.publicKeys != null && message.publicKeys.length)
                for (var i = 0; i < message.publicKeys.length; ++i)
                    $root.api.EosWallet.PubKeyInfo.encode(message.publicKeys[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EosWallet message, length delimited. Does not implicitly {@link api.EosWallet.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.EosWallet
         * @static
         * @param {api.IEosWallet} message EosWallet message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosWallet.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosWallet message from the specified reader or buffer.
         * @function decode
         * @memberof api.EosWallet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.EosWallet} EosWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosWallet.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.EosWallet();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chainType = reader.string();
                    break;
                case 2:
                    message.address = reader.string();
                    break;
                case 3:
                    if (!(message.publicKeys && message.publicKeys.length))
                        message.publicKeys = [];
                    message.publicKeys.push($root.api.EosWallet.PubKeyInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosWallet message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.EosWallet
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.EosWallet} EosWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosWallet.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosWallet message.
         * @function verify
         * @memberof api.EosWallet
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosWallet.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            if (message.publicKeys != null && message.hasOwnProperty("publicKeys")) {
                if (!Array.isArray(message.publicKeys))
                    return "publicKeys: array expected";
                for (var i = 0; i < message.publicKeys.length; ++i) {
                    var error = $root.api.EosWallet.PubKeyInfo.verify(message.publicKeys[i]);
                    if (error)
                        return "publicKeys." + error;
                }
            }
            return null;
        };

        /**
         * Creates an EosWallet message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.EosWallet
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.EosWallet} EosWallet
         */
        EosWallet.fromObject = function fromObject(object) {
            if (object instanceof $root.api.EosWallet)
                return object;
            var message = new $root.api.EosWallet();
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.address != null)
                message.address = String(object.address);
            if (object.publicKeys) {
                if (!Array.isArray(object.publicKeys))
                    throw TypeError(".api.EosWallet.publicKeys: array expected");
                message.publicKeys = [];
                for (var i = 0; i < object.publicKeys.length; ++i) {
                    if (typeof object.publicKeys[i] !== "object")
                        throw TypeError(".api.EosWallet.publicKeys: object expected");
                    message.publicKeys[i] = $root.api.EosWallet.PubKeyInfo.fromObject(object.publicKeys[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an EosWallet message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.EosWallet
         * @static
         * @param {api.EosWallet} message EosWallet
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosWallet.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.publicKeys = [];
            if (options.defaults) {
                object.chainType = "";
                object.address = "";
            }
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            if (message.publicKeys && message.publicKeys.length) {
                object.publicKeys = [];
                for (var j = 0; j < message.publicKeys.length; ++j)
                    object.publicKeys[j] = $root.api.EosWallet.PubKeyInfo.toObject(message.publicKeys[j], options);
            }
            return object;
        };

        /**
         * Converts this EosWallet to JSON.
         * @function toJSON
         * @memberof api.EosWallet
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosWallet.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        EosWallet.PubKeyInfo = (function() {

            /**
             * Properties of a PubKeyInfo.
             * @memberof api.EosWallet
             * @interface IPubKeyInfo
             * @property {string|null} [path] PubKeyInfo path
             * @property {string|null} [derivedMode] PubKeyInfo derivedMode
             * @property {string|null} [publicKey] PubKeyInfo publicKey
             */

            /**
             * Constructs a new PubKeyInfo.
             * @memberof api.EosWallet
             * @classdesc Represents a PubKeyInfo.
             * @implements IPubKeyInfo
             * @constructor
             * @param {api.EosWallet.IPubKeyInfo=} [properties] Properties to set
             */
            function PubKeyInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PubKeyInfo path.
             * @member {string} path
             * @memberof api.EosWallet.PubKeyInfo
             * @instance
             */
            PubKeyInfo.prototype.path = "";

            /**
             * PubKeyInfo derivedMode.
             * @member {string} derivedMode
             * @memberof api.EosWallet.PubKeyInfo
             * @instance
             */
            PubKeyInfo.prototype.derivedMode = "";

            /**
             * PubKeyInfo publicKey.
             * @member {string} publicKey
             * @memberof api.EosWallet.PubKeyInfo
             * @instance
             */
            PubKeyInfo.prototype.publicKey = "";

            /**
             * Creates a new PubKeyInfo instance using the specified properties.
             * @function create
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {api.EosWallet.IPubKeyInfo=} [properties] Properties to set
             * @returns {api.EosWallet.PubKeyInfo} PubKeyInfo instance
             */
            PubKeyInfo.create = function create(properties) {
                return new PubKeyInfo(properties);
            };

            /**
             * Encodes the specified PubKeyInfo message. Does not implicitly {@link api.EosWallet.PubKeyInfo.verify|verify} messages.
             * @function encode
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {api.EosWallet.IPubKeyInfo} message PubKeyInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PubKeyInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
                if (message.derivedMode != null && Object.hasOwnProperty.call(message, "derivedMode"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.derivedMode);
                if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.publicKey);
                return writer;
            };

            /**
             * Encodes the specified PubKeyInfo message, length delimited. Does not implicitly {@link api.EosWallet.PubKeyInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {api.EosWallet.IPubKeyInfo} message PubKeyInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PubKeyInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PubKeyInfo message from the specified reader or buffer.
             * @function decode
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.EosWallet.PubKeyInfo} PubKeyInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PubKeyInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.EosWallet.PubKeyInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.path = reader.string();
                        break;
                    case 2:
                        message.derivedMode = reader.string();
                        break;
                    case 3:
                        message.publicKey = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PubKeyInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.EosWallet.PubKeyInfo} PubKeyInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PubKeyInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PubKeyInfo message.
             * @function verify
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PubKeyInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.path != null && message.hasOwnProperty("path"))
                    if (!$util.isString(message.path))
                        return "path: string expected";
                if (message.derivedMode != null && message.hasOwnProperty("derivedMode"))
                    if (!$util.isString(message.derivedMode))
                        return "derivedMode: string expected";
                if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                    if (!$util.isString(message.publicKey))
                        return "publicKey: string expected";
                return null;
            };

            /**
             * Creates a PubKeyInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {api.EosWallet.PubKeyInfo} PubKeyInfo
             */
            PubKeyInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.api.EosWallet.PubKeyInfo)
                    return object;
                var message = new $root.api.EosWallet.PubKeyInfo();
                if (object.path != null)
                    message.path = String(object.path);
                if (object.derivedMode != null)
                    message.derivedMode = String(object.derivedMode);
                if (object.publicKey != null)
                    message.publicKey = String(object.publicKey);
                return message;
            };

            /**
             * Creates a plain object from a PubKeyInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof api.EosWallet.PubKeyInfo
             * @static
             * @param {api.EosWallet.PubKeyInfo} message PubKeyInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PubKeyInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.path = "";
                    object.derivedMode = "";
                    object.publicKey = "";
                }
                if (message.path != null && message.hasOwnProperty("path"))
                    object.path = message.path;
                if (message.derivedMode != null && message.hasOwnProperty("derivedMode"))
                    object.derivedMode = message.derivedMode;
                if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                    object.publicKey = message.publicKey;
                return object;
            };

            /**
             * Converts this PubKeyInfo to JSON.
             * @function toJSON
             * @memberof api.EosWallet.PubKeyInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PubKeyInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return PubKeyInfo;
        })();

        return EosWallet;
    })();

    api.ExternalAddressParam = (function() {

        /**
         * Properties of an ExternalAddressParam.
         * @memberof api
         * @interface IExternalAddressParam
         * @property {string|null} [path] ExternalAddressParam path
         * @property {string|null} [chainType] ExternalAddressParam chainType
         * @property {string|null} [network] ExternalAddressParam network
         * @property {string|null} [segWit] ExternalAddressParam segWit
         * @property {number|null} [externalIdx] ExternalAddressParam externalIdx
         */

        /**
         * Constructs a new ExternalAddressParam.
         * @memberof api
         * @classdesc Represents an ExternalAddressParam.
         * @implements IExternalAddressParam
         * @constructor
         * @param {api.IExternalAddressParam=} [properties] Properties to set
         */
        function ExternalAddressParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExternalAddressParam path.
         * @member {string} path
         * @memberof api.ExternalAddressParam
         * @instance
         */
        ExternalAddressParam.prototype.path = "";

        /**
         * ExternalAddressParam chainType.
         * @member {string} chainType
         * @memberof api.ExternalAddressParam
         * @instance
         */
        ExternalAddressParam.prototype.chainType = "";

        /**
         * ExternalAddressParam network.
         * @member {string} network
         * @memberof api.ExternalAddressParam
         * @instance
         */
        ExternalAddressParam.prototype.network = "";

        /**
         * ExternalAddressParam segWit.
         * @member {string} segWit
         * @memberof api.ExternalAddressParam
         * @instance
         */
        ExternalAddressParam.prototype.segWit = "";

        /**
         * ExternalAddressParam externalIdx.
         * @member {number} externalIdx
         * @memberof api.ExternalAddressParam
         * @instance
         */
        ExternalAddressParam.prototype.externalIdx = 0;

        /**
         * Creates a new ExternalAddressParam instance using the specified properties.
         * @function create
         * @memberof api.ExternalAddressParam
         * @static
         * @param {api.IExternalAddressParam=} [properties] Properties to set
         * @returns {api.ExternalAddressParam} ExternalAddressParam instance
         */
        ExternalAddressParam.create = function create(properties) {
            return new ExternalAddressParam(properties);
        };

        /**
         * Encodes the specified ExternalAddressParam message. Does not implicitly {@link api.ExternalAddressParam.verify|verify} messages.
         * @function encode
         * @memberof api.ExternalAddressParam
         * @static
         * @param {api.IExternalAddressParam} message ExternalAddressParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExternalAddressParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.path);
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.chainType);
            if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.network);
            if (message.segWit != null && Object.hasOwnProperty.call(message, "segWit"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.segWit);
            if (message.externalIdx != null && Object.hasOwnProperty.call(message, "externalIdx"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.externalIdx);
            return writer;
        };

        /**
         * Encodes the specified ExternalAddressParam message, length delimited. Does not implicitly {@link api.ExternalAddressParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.ExternalAddressParam
         * @static
         * @param {api.IExternalAddressParam} message ExternalAddressParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExternalAddressParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExternalAddressParam message from the specified reader or buffer.
         * @function decode
         * @memberof api.ExternalAddressParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.ExternalAddressParam} ExternalAddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExternalAddressParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.ExternalAddressParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.path = reader.string();
                    break;
                case 2:
                    message.chainType = reader.string();
                    break;
                case 3:
                    message.network = reader.string();
                    break;
                case 4:
                    message.segWit = reader.string();
                    break;
                case 5:
                    message.externalIdx = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExternalAddressParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.ExternalAddressParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.ExternalAddressParam} ExternalAddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExternalAddressParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExternalAddressParam message.
         * @function verify
         * @memberof api.ExternalAddressParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExternalAddressParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.network != null && message.hasOwnProperty("network"))
                if (!$util.isString(message.network))
                    return "network: string expected";
            if (message.segWit != null && message.hasOwnProperty("segWit"))
                if (!$util.isString(message.segWit))
                    return "segWit: string expected";
            if (message.externalIdx != null && message.hasOwnProperty("externalIdx"))
                if (!$util.isInteger(message.externalIdx))
                    return "externalIdx: integer expected";
            return null;
        };

        /**
         * Creates an ExternalAddressParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.ExternalAddressParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.ExternalAddressParam} ExternalAddressParam
         */
        ExternalAddressParam.fromObject = function fromObject(object) {
            if (object instanceof $root.api.ExternalAddressParam)
                return object;
            var message = new $root.api.ExternalAddressParam();
            if (object.path != null)
                message.path = String(object.path);
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.network != null)
                message.network = String(object.network);
            if (object.segWit != null)
                message.segWit = String(object.segWit);
            if (object.externalIdx != null)
                message.externalIdx = object.externalIdx | 0;
            return message;
        };

        /**
         * Creates a plain object from an ExternalAddressParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.ExternalAddressParam
         * @static
         * @param {api.ExternalAddressParam} message ExternalAddressParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExternalAddressParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.path = "";
                object.chainType = "";
                object.network = "";
                object.segWit = "";
                object.externalIdx = 0;
            }
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.network != null && message.hasOwnProperty("network"))
                object.network = message.network;
            if (message.segWit != null && message.hasOwnProperty("segWit"))
                object.segWit = message.segWit;
            if (message.externalIdx != null && message.hasOwnProperty("externalIdx"))
                object.externalIdx = message.externalIdx;
            return object;
        };

        /**
         * Converts this ExternalAddressParam to JSON.
         * @function toJSON
         * @memberof api.ExternalAddressParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExternalAddressParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExternalAddressParam;
    })();

    api.InitImKeyCoreXParam = (function() {

        /**
         * Properties of an InitImKeyCoreXParam.
         * @memberof api
         * @interface IInitImKeyCoreXParam
         * @property {string|null} [fileDir] InitImKeyCoreXParam fileDir
         * @property {string|null} [xpubCommonKey] InitImKeyCoreXParam xpubCommonKey
         * @property {string|null} [xpubCommonIv] InitImKeyCoreXParam xpubCommonIv
         * @property {boolean|null} [isDebug] InitImKeyCoreXParam isDebug
         */

        /**
         * Constructs a new InitImKeyCoreXParam.
         * @memberof api
         * @classdesc Represents an InitImKeyCoreXParam.
         * @implements IInitImKeyCoreXParam
         * @constructor
         * @param {api.IInitImKeyCoreXParam=} [properties] Properties to set
         */
        function InitImKeyCoreXParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InitImKeyCoreXParam fileDir.
         * @member {string} fileDir
         * @memberof api.InitImKeyCoreXParam
         * @instance
         */
        InitImKeyCoreXParam.prototype.fileDir = "";

        /**
         * InitImKeyCoreXParam xpubCommonKey.
         * @member {string} xpubCommonKey
         * @memberof api.InitImKeyCoreXParam
         * @instance
         */
        InitImKeyCoreXParam.prototype.xpubCommonKey = "";

        /**
         * InitImKeyCoreXParam xpubCommonIv.
         * @member {string} xpubCommonIv
         * @memberof api.InitImKeyCoreXParam
         * @instance
         */
        InitImKeyCoreXParam.prototype.xpubCommonIv = "";

        /**
         * InitImKeyCoreXParam isDebug.
         * @member {boolean} isDebug
         * @memberof api.InitImKeyCoreXParam
         * @instance
         */
        InitImKeyCoreXParam.prototype.isDebug = false;

        /**
         * Creates a new InitImKeyCoreXParam instance using the specified properties.
         * @function create
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {api.IInitImKeyCoreXParam=} [properties] Properties to set
         * @returns {api.InitImKeyCoreXParam} InitImKeyCoreXParam instance
         */
        InitImKeyCoreXParam.create = function create(properties) {
            return new InitImKeyCoreXParam(properties);
        };

        /**
         * Encodes the specified InitImKeyCoreXParam message. Does not implicitly {@link api.InitImKeyCoreXParam.verify|verify} messages.
         * @function encode
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {api.IInitImKeyCoreXParam} message InitImKeyCoreXParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InitImKeyCoreXParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fileDir != null && Object.hasOwnProperty.call(message, "fileDir"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fileDir);
            if (message.xpubCommonKey != null && Object.hasOwnProperty.call(message, "xpubCommonKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.xpubCommonKey);
            if (message.xpubCommonIv != null && Object.hasOwnProperty.call(message, "xpubCommonIv"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.xpubCommonIv);
            if (message.isDebug != null && Object.hasOwnProperty.call(message, "isDebug"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isDebug);
            return writer;
        };

        /**
         * Encodes the specified InitImKeyCoreXParam message, length delimited. Does not implicitly {@link api.InitImKeyCoreXParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {api.IInitImKeyCoreXParam} message InitImKeyCoreXParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InitImKeyCoreXParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InitImKeyCoreXParam message from the specified reader or buffer.
         * @function decode
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {api.InitImKeyCoreXParam} InitImKeyCoreXParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InitImKeyCoreXParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.InitImKeyCoreXParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.fileDir = reader.string();
                    break;
                case 2:
                    message.xpubCommonKey = reader.string();
                    break;
                case 3:
                    message.xpubCommonIv = reader.string();
                    break;
                case 4:
                    message.isDebug = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InitImKeyCoreXParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {api.InitImKeyCoreXParam} InitImKeyCoreXParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InitImKeyCoreXParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InitImKeyCoreXParam message.
         * @function verify
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InitImKeyCoreXParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fileDir != null && message.hasOwnProperty("fileDir"))
                if (!$util.isString(message.fileDir))
                    return "fileDir: string expected";
            if (message.xpubCommonKey != null && message.hasOwnProperty("xpubCommonKey"))
                if (!$util.isString(message.xpubCommonKey))
                    return "xpubCommonKey: string expected";
            if (message.xpubCommonIv != null && message.hasOwnProperty("xpubCommonIv"))
                if (!$util.isString(message.xpubCommonIv))
                    return "xpubCommonIv: string expected";
            if (message.isDebug != null && message.hasOwnProperty("isDebug"))
                if (typeof message.isDebug !== "boolean")
                    return "isDebug: boolean expected";
            return null;
        };

        /**
         * Creates an InitImKeyCoreXParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {api.InitImKeyCoreXParam} InitImKeyCoreXParam
         */
        InitImKeyCoreXParam.fromObject = function fromObject(object) {
            if (object instanceof $root.api.InitImKeyCoreXParam)
                return object;
            var message = new $root.api.InitImKeyCoreXParam();
            if (object.fileDir != null)
                message.fileDir = String(object.fileDir);
            if (object.xpubCommonKey != null)
                message.xpubCommonKey = String(object.xpubCommonKey);
            if (object.xpubCommonIv != null)
                message.xpubCommonIv = String(object.xpubCommonIv);
            if (object.isDebug != null)
                message.isDebug = Boolean(object.isDebug);
            return message;
        };

        /**
         * Creates a plain object from an InitImKeyCoreXParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof api.InitImKeyCoreXParam
         * @static
         * @param {api.InitImKeyCoreXParam} message InitImKeyCoreXParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InitImKeyCoreXParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.fileDir = "";
                object.xpubCommonKey = "";
                object.xpubCommonIv = "";
                object.isDebug = false;
            }
            if (message.fileDir != null && message.hasOwnProperty("fileDir"))
                object.fileDir = message.fileDir;
            if (message.xpubCommonKey != null && message.hasOwnProperty("xpubCommonKey"))
                object.xpubCommonKey = message.xpubCommonKey;
            if (message.xpubCommonIv != null && message.hasOwnProperty("xpubCommonIv"))
                object.xpubCommonIv = message.xpubCommonIv;
            if (message.isDebug != null && message.hasOwnProperty("isDebug"))
                object.isDebug = message.isDebug;
            return object;
        };

        /**
         * Converts this InitImKeyCoreXParam to JSON.
         * @function toJSON
         * @memberof api.InitImKeyCoreXParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InitImKeyCoreXParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InitImKeyCoreXParam;
    })();

    return api;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

$root.btcapi = (function() {

    /**
     * Namespace btcapi.
     * @exports btcapi
     * @namespace
     */
    var btcapi = {};

    btcapi.Utxo = (function() {

        /**
         * Properties of an Utxo.
         * @memberof btcapi
         * @interface IUtxo
         * @property {string|null} [txHash] Utxo txHash
         * @property {number|null} [vout] Utxo vout
         * @property {number|Long|null} [amount] Utxo amount
         * @property {string|null} [address] Utxo address
         * @property {string|null} [scriptPubKey] Utxo scriptPubKey
         * @property {string|null} [derivedPath] Utxo derivedPath
         * @property {number|Long|null} [sequence] Utxo sequence
         */

        /**
         * Constructs a new Utxo.
         * @memberof btcapi
         * @classdesc Represents an Utxo.
         * @implements IUtxo
         * @constructor
         * @param {btcapi.IUtxo=} [properties] Properties to set
         */
        function Utxo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Utxo txHash.
         * @member {string} txHash
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.txHash = "";

        /**
         * Utxo vout.
         * @member {number} vout
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.vout = 0;

        /**
         * Utxo amount.
         * @member {number|Long} amount
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Utxo address.
         * @member {string} address
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.address = "";

        /**
         * Utxo scriptPubKey.
         * @member {string} scriptPubKey
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.scriptPubKey = "";

        /**
         * Utxo derivedPath.
         * @member {string} derivedPath
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.derivedPath = "";

        /**
         * Utxo sequence.
         * @member {number|Long} sequence
         * @memberof btcapi.Utxo
         * @instance
         */
        Utxo.prototype.sequence = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Utxo instance using the specified properties.
         * @function create
         * @memberof btcapi.Utxo
         * @static
         * @param {btcapi.IUtxo=} [properties] Properties to set
         * @returns {btcapi.Utxo} Utxo instance
         */
        Utxo.create = function create(properties) {
            return new Utxo(properties);
        };

        /**
         * Encodes the specified Utxo message. Does not implicitly {@link btcapi.Utxo.verify|verify} messages.
         * @function encode
         * @memberof btcapi.Utxo
         * @static
         * @param {btcapi.IUtxo} message Utxo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Utxo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.txHash != null && Object.hasOwnProperty.call(message, "txHash"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.txHash);
            if (message.vout != null && Object.hasOwnProperty.call(message, "vout"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.vout);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.amount);
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.address);
            if (message.scriptPubKey != null && Object.hasOwnProperty.call(message, "scriptPubKey"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.scriptPubKey);
            if (message.derivedPath != null && Object.hasOwnProperty.call(message, "derivedPath"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.derivedPath);
            if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.sequence);
            return writer;
        };

        /**
         * Encodes the specified Utxo message, length delimited. Does not implicitly {@link btcapi.Utxo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof btcapi.Utxo
         * @static
         * @param {btcapi.IUtxo} message Utxo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Utxo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Utxo message from the specified reader or buffer.
         * @function decode
         * @memberof btcapi.Utxo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {btcapi.Utxo} Utxo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Utxo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.btcapi.Utxo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.txHash = reader.string();
                    break;
                case 2:
                    message.vout = reader.int32();
                    break;
                case 3:
                    message.amount = reader.int64();
                    break;
                case 4:
                    message.address = reader.string();
                    break;
                case 5:
                    message.scriptPubKey = reader.string();
                    break;
                case 6:
                    message.derivedPath = reader.string();
                    break;
                case 7:
                    message.sequence = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Utxo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof btcapi.Utxo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {btcapi.Utxo} Utxo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Utxo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Utxo message.
         * @function verify
         * @memberof btcapi.Utxo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Utxo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                if (!$util.isString(message.txHash))
                    return "txHash: string expected";
            if (message.vout != null && message.hasOwnProperty("vout"))
                if (!$util.isInteger(message.vout))
                    return "vout: integer expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                    return "amount: integer|Long expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            if (message.scriptPubKey != null && message.hasOwnProperty("scriptPubKey"))
                if (!$util.isString(message.scriptPubKey))
                    return "scriptPubKey: string expected";
            if (message.derivedPath != null && message.hasOwnProperty("derivedPath"))
                if (!$util.isString(message.derivedPath))
                    return "derivedPath: string expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isInteger(message.sequence) && !(message.sequence && $util.isInteger(message.sequence.low) && $util.isInteger(message.sequence.high)))
                    return "sequence: integer|Long expected";
            return null;
        };

        /**
         * Creates an Utxo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof btcapi.Utxo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {btcapi.Utxo} Utxo
         */
        Utxo.fromObject = function fromObject(object) {
            if (object instanceof $root.btcapi.Utxo)
                return object;
            var message = new $root.btcapi.Utxo();
            if (object.txHash != null)
                message.txHash = String(object.txHash);
            if (object.vout != null)
                message.vout = object.vout | 0;
            if (object.amount != null)
                if ($util.Long)
                    (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
                else if (typeof object.amount === "string")
                    message.amount = parseInt(object.amount, 10);
                else if (typeof object.amount === "number")
                    message.amount = object.amount;
                else if (typeof object.amount === "object")
                    message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
            if (object.address != null)
                message.address = String(object.address);
            if (object.scriptPubKey != null)
                message.scriptPubKey = String(object.scriptPubKey);
            if (object.derivedPath != null)
                message.derivedPath = String(object.derivedPath);
            if (object.sequence != null)
                if ($util.Long)
                    (message.sequence = $util.Long.fromValue(object.sequence)).unsigned = false;
                else if (typeof object.sequence === "string")
                    message.sequence = parseInt(object.sequence, 10);
                else if (typeof object.sequence === "number")
                    message.sequence = object.sequence;
                else if (typeof object.sequence === "object")
                    message.sequence = new $util.LongBits(object.sequence.low >>> 0, object.sequence.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from an Utxo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof btcapi.Utxo
         * @static
         * @param {btcapi.Utxo} message Utxo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Utxo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.txHash = "";
                object.vout = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount = options.longs === String ? "0" : 0;
                object.address = "";
                object.scriptPubKey = "";
                object.derivedPath = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.sequence = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sequence = options.longs === String ? "0" : 0;
            }
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                object.txHash = message.txHash;
            if (message.vout != null && message.hasOwnProperty("vout"))
                object.vout = message.vout;
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (typeof message.amount === "number")
                    object.amount = options.longs === String ? String(message.amount) : message.amount;
                else
                    object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            if (message.scriptPubKey != null && message.hasOwnProperty("scriptPubKey"))
                object.scriptPubKey = message.scriptPubKey;
            if (message.derivedPath != null && message.hasOwnProperty("derivedPath"))
                object.derivedPath = message.derivedPath;
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (typeof message.sequence === "number")
                    object.sequence = options.longs === String ? String(message.sequence) : message.sequence;
                else
                    object.sequence = options.longs === String ? $util.Long.prototype.toString.call(message.sequence) : options.longs === Number ? new $util.LongBits(message.sequence.low >>> 0, message.sequence.high >>> 0).toNumber() : message.sequence;
            return object;
        };

        /**
         * Converts this Utxo to JSON.
         * @function toJSON
         * @memberof btcapi.Utxo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Utxo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Utxo;
    })();

    btcapi.BtcTxExtra = (function() {

        /**
         * Properties of a BtcTxExtra.
         * @memberof btcapi
         * @interface IBtcTxExtra
         * @property {string|null} [opReturn] BtcTxExtra opReturn
         * @property {number|null} [propertyId] BtcTxExtra propertyId
         * @property {string|null} [feeMode] BtcTxExtra feeMode
         */

        /**
         * Constructs a new BtcTxExtra.
         * @memberof btcapi
         * @classdesc Represents a BtcTxExtra.
         * @implements IBtcTxExtra
         * @constructor
         * @param {btcapi.IBtcTxExtra=} [properties] Properties to set
         */
        function BtcTxExtra(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BtcTxExtra opReturn.
         * @member {string} opReturn
         * @memberof btcapi.BtcTxExtra
         * @instance
         */
        BtcTxExtra.prototype.opReturn = "";

        /**
         * BtcTxExtra propertyId.
         * @member {number} propertyId
         * @memberof btcapi.BtcTxExtra
         * @instance
         */
        BtcTxExtra.prototype.propertyId = 0;

        /**
         * BtcTxExtra feeMode.
         * @member {string} feeMode
         * @memberof btcapi.BtcTxExtra
         * @instance
         */
        BtcTxExtra.prototype.feeMode = "";

        /**
         * Creates a new BtcTxExtra instance using the specified properties.
         * @function create
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {btcapi.IBtcTxExtra=} [properties] Properties to set
         * @returns {btcapi.BtcTxExtra} BtcTxExtra instance
         */
        BtcTxExtra.create = function create(properties) {
            return new BtcTxExtra(properties);
        };

        /**
         * Encodes the specified BtcTxExtra message. Does not implicitly {@link btcapi.BtcTxExtra.verify|verify} messages.
         * @function encode
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {btcapi.IBtcTxExtra} message BtcTxExtra message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcTxExtra.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.opReturn != null && Object.hasOwnProperty.call(message, "opReturn"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.opReturn);
            if (message.propertyId != null && Object.hasOwnProperty.call(message, "propertyId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.propertyId);
            if (message.feeMode != null && Object.hasOwnProperty.call(message, "feeMode"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.feeMode);
            return writer;
        };

        /**
         * Encodes the specified BtcTxExtra message, length delimited. Does not implicitly {@link btcapi.BtcTxExtra.verify|verify} messages.
         * @function encodeDelimited
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {btcapi.IBtcTxExtra} message BtcTxExtra message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcTxExtra.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BtcTxExtra message from the specified reader or buffer.
         * @function decode
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {btcapi.BtcTxExtra} BtcTxExtra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcTxExtra.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.btcapi.BtcTxExtra();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.opReturn = reader.string();
                    break;
                case 2:
                    message.propertyId = reader.int32();
                    break;
                case 3:
                    message.feeMode = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BtcTxExtra message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {btcapi.BtcTxExtra} BtcTxExtra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcTxExtra.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BtcTxExtra message.
         * @function verify
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BtcTxExtra.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.opReturn != null && message.hasOwnProperty("opReturn"))
                if (!$util.isString(message.opReturn))
                    return "opReturn: string expected";
            if (message.propertyId != null && message.hasOwnProperty("propertyId"))
                if (!$util.isInteger(message.propertyId))
                    return "propertyId: integer expected";
            if (message.feeMode != null && message.hasOwnProperty("feeMode"))
                if (!$util.isString(message.feeMode))
                    return "feeMode: string expected";
            return null;
        };

        /**
         * Creates a BtcTxExtra message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {btcapi.BtcTxExtra} BtcTxExtra
         */
        BtcTxExtra.fromObject = function fromObject(object) {
            if (object instanceof $root.btcapi.BtcTxExtra)
                return object;
            var message = new $root.btcapi.BtcTxExtra();
            if (object.opReturn != null)
                message.opReturn = String(object.opReturn);
            if (object.propertyId != null)
                message.propertyId = object.propertyId | 0;
            if (object.feeMode != null)
                message.feeMode = String(object.feeMode);
            return message;
        };

        /**
         * Creates a plain object from a BtcTxExtra message. Also converts values to other types if specified.
         * @function toObject
         * @memberof btcapi.BtcTxExtra
         * @static
         * @param {btcapi.BtcTxExtra} message BtcTxExtra
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BtcTxExtra.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.opReturn = "";
                object.propertyId = 0;
                object.feeMode = "";
            }
            if (message.opReturn != null && message.hasOwnProperty("opReturn"))
                object.opReturn = message.opReturn;
            if (message.propertyId != null && message.hasOwnProperty("propertyId"))
                object.propertyId = message.propertyId;
            if (message.feeMode != null && message.hasOwnProperty("feeMode"))
                object.feeMode = message.feeMode;
            return object;
        };

        /**
         * Converts this BtcTxExtra to JSON.
         * @function toJSON
         * @memberof btcapi.BtcTxExtra
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BtcTxExtra.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BtcTxExtra;
    })();

    btcapi.BtcTxInput = (function() {

        /**
         * Properties of a BtcTxInput.
         * @memberof btcapi
         * @interface IBtcTxInput
         * @property {string|null} [to] BtcTxInput to
         * @property {number|Long|null} [amount] BtcTxInput amount
         * @property {number|Long|null} [fee] BtcTxInput fee
         * @property {number|null} [changeAddressIndex] BtcTxInput changeAddressIndex
         * @property {Array.<btcapi.IUtxo>|null} [unspents] BtcTxInput unspents
         * @property {string|null} [segWit] BtcTxInput segWit
         * @property {string|null} [protocol] BtcTxInput protocol
         * @property {btcapi.IBtcTxExtra|null} [extra] BtcTxInput extra
         */

        /**
         * Constructs a new BtcTxInput.
         * @memberof btcapi
         * @classdesc Represents a BtcTxInput.
         * @implements IBtcTxInput
         * @constructor
         * @param {btcapi.IBtcTxInput=} [properties] Properties to set
         */
        function BtcTxInput(properties) {
            this.unspents = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BtcTxInput to.
         * @member {string} to
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.to = "";

        /**
         * BtcTxInput amount.
         * @member {number|Long} amount
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.amount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * BtcTxInput fee.
         * @member {number|Long} fee
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.fee = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * BtcTxInput changeAddressIndex.
         * @member {number} changeAddressIndex
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.changeAddressIndex = 0;

        /**
         * BtcTxInput unspents.
         * @member {Array.<btcapi.IUtxo>} unspents
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.unspents = $util.emptyArray;

        /**
         * BtcTxInput segWit.
         * @member {string} segWit
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.segWit = "";

        /**
         * BtcTxInput protocol.
         * @member {string} protocol
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.protocol = "";

        /**
         * BtcTxInput extra.
         * @member {btcapi.IBtcTxExtra|null|undefined} extra
         * @memberof btcapi.BtcTxInput
         * @instance
         */
        BtcTxInput.prototype.extra = null;

        /**
         * Creates a new BtcTxInput instance using the specified properties.
         * @function create
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {btcapi.IBtcTxInput=} [properties] Properties to set
         * @returns {btcapi.BtcTxInput} BtcTxInput instance
         */
        BtcTxInput.create = function create(properties) {
            return new BtcTxInput(properties);
        };

        /**
         * Encodes the specified BtcTxInput message. Does not implicitly {@link btcapi.BtcTxInput.verify|verify} messages.
         * @function encode
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {btcapi.IBtcTxInput} message BtcTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcTxInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.to != null && Object.hasOwnProperty.call(message, "to"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.to);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
            if (message.fee != null && Object.hasOwnProperty.call(message, "fee"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.fee);
            if (message.changeAddressIndex != null && Object.hasOwnProperty.call(message, "changeAddressIndex"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.changeAddressIndex);
            if (message.unspents != null && message.unspents.length)
                for (var i = 0; i < message.unspents.length; ++i)
                    $root.btcapi.Utxo.encode(message.unspents[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.segWit != null && Object.hasOwnProperty.call(message, "segWit"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.segWit);
            if (message.protocol != null && Object.hasOwnProperty.call(message, "protocol"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.protocol);
            if (message.extra != null && Object.hasOwnProperty.call(message, "extra"))
                $root.btcapi.BtcTxExtra.encode(message.extra, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified BtcTxInput message, length delimited. Does not implicitly {@link btcapi.BtcTxInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {btcapi.IBtcTxInput} message BtcTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcTxInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BtcTxInput message from the specified reader or buffer.
         * @function decode
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {btcapi.BtcTxInput} BtcTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcTxInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.btcapi.BtcTxInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.to = reader.string();
                    break;
                case 2:
                    message.amount = reader.int64();
                    break;
                case 3:
                    message.fee = reader.int64();
                    break;
                case 4:
                    message.changeAddressIndex = reader.uint32();
                    break;
                case 5:
                    if (!(message.unspents && message.unspents.length))
                        message.unspents = [];
                    message.unspents.push($root.btcapi.Utxo.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.segWit = reader.string();
                    break;
                case 7:
                    message.protocol = reader.string();
                    break;
                case 8:
                    message.extra = $root.btcapi.BtcTxExtra.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BtcTxInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {btcapi.BtcTxInput} BtcTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcTxInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BtcTxInput message.
         * @function verify
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BtcTxInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.to != null && message.hasOwnProperty("to"))
                if (!$util.isString(message.to))
                    return "to: string expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                    return "amount: integer|Long expected";
            if (message.fee != null && message.hasOwnProperty("fee"))
                if (!$util.isInteger(message.fee) && !(message.fee && $util.isInteger(message.fee.low) && $util.isInteger(message.fee.high)))
                    return "fee: integer|Long expected";
            if (message.changeAddressIndex != null && message.hasOwnProperty("changeAddressIndex"))
                if (!$util.isInteger(message.changeAddressIndex))
                    return "changeAddressIndex: integer expected";
            if (message.unspents != null && message.hasOwnProperty("unspents")) {
                if (!Array.isArray(message.unspents))
                    return "unspents: array expected";
                for (var i = 0; i < message.unspents.length; ++i) {
                    var error = $root.btcapi.Utxo.verify(message.unspents[i]);
                    if (error)
                        return "unspents." + error;
                }
            }
            if (message.segWit != null && message.hasOwnProperty("segWit"))
                if (!$util.isString(message.segWit))
                    return "segWit: string expected";
            if (message.protocol != null && message.hasOwnProperty("protocol"))
                if (!$util.isString(message.protocol))
                    return "protocol: string expected";
            if (message.extra != null && message.hasOwnProperty("extra")) {
                var error = $root.btcapi.BtcTxExtra.verify(message.extra);
                if (error)
                    return "extra." + error;
            }
            return null;
        };

        /**
         * Creates a BtcTxInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {btcapi.BtcTxInput} BtcTxInput
         */
        BtcTxInput.fromObject = function fromObject(object) {
            if (object instanceof $root.btcapi.BtcTxInput)
                return object;
            var message = new $root.btcapi.BtcTxInput();
            if (object.to != null)
                message.to = String(object.to);
            if (object.amount != null)
                if ($util.Long)
                    (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
                else if (typeof object.amount === "string")
                    message.amount = parseInt(object.amount, 10);
                else if (typeof object.amount === "number")
                    message.amount = object.amount;
                else if (typeof object.amount === "object")
                    message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
            if (object.fee != null)
                if ($util.Long)
                    (message.fee = $util.Long.fromValue(object.fee)).unsigned = false;
                else if (typeof object.fee === "string")
                    message.fee = parseInt(object.fee, 10);
                else if (typeof object.fee === "number")
                    message.fee = object.fee;
                else if (typeof object.fee === "object")
                    message.fee = new $util.LongBits(object.fee.low >>> 0, object.fee.high >>> 0).toNumber();
            if (object.changeAddressIndex != null)
                message.changeAddressIndex = object.changeAddressIndex >>> 0;
            if (object.unspents) {
                if (!Array.isArray(object.unspents))
                    throw TypeError(".btcapi.BtcTxInput.unspents: array expected");
                message.unspents = [];
                for (var i = 0; i < object.unspents.length; ++i) {
                    if (typeof object.unspents[i] !== "object")
                        throw TypeError(".btcapi.BtcTxInput.unspents: object expected");
                    message.unspents[i] = $root.btcapi.Utxo.fromObject(object.unspents[i]);
                }
            }
            if (object.segWit != null)
                message.segWit = String(object.segWit);
            if (object.protocol != null)
                message.protocol = String(object.protocol);
            if (object.extra != null) {
                if (typeof object.extra !== "object")
                    throw TypeError(".btcapi.BtcTxInput.extra: object expected");
                message.extra = $root.btcapi.BtcTxExtra.fromObject(object.extra);
            }
            return message;
        };

        /**
         * Creates a plain object from a BtcTxInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof btcapi.BtcTxInput
         * @static
         * @param {btcapi.BtcTxInput} message BtcTxInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BtcTxInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.unspents = [];
            if (options.defaults) {
                object.to = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.fee = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.fee = options.longs === String ? "0" : 0;
                object.changeAddressIndex = 0;
                object.segWit = "";
                object.protocol = "";
                object.extra = null;
            }
            if (message.to != null && message.hasOwnProperty("to"))
                object.to = message.to;
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (typeof message.amount === "number")
                    object.amount = options.longs === String ? String(message.amount) : message.amount;
                else
                    object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
            if (message.fee != null && message.hasOwnProperty("fee"))
                if (typeof message.fee === "number")
                    object.fee = options.longs === String ? String(message.fee) : message.fee;
                else
                    object.fee = options.longs === String ? $util.Long.prototype.toString.call(message.fee) : options.longs === Number ? new $util.LongBits(message.fee.low >>> 0, message.fee.high >>> 0).toNumber() : message.fee;
            if (message.changeAddressIndex != null && message.hasOwnProperty("changeAddressIndex"))
                object.changeAddressIndex = message.changeAddressIndex;
            if (message.unspents && message.unspents.length) {
                object.unspents = [];
                for (var j = 0; j < message.unspents.length; ++j)
                    object.unspents[j] = $root.btcapi.Utxo.toObject(message.unspents[j], options);
            }
            if (message.segWit != null && message.hasOwnProperty("segWit"))
                object.segWit = message.segWit;
            if (message.protocol != null && message.hasOwnProperty("protocol"))
                object.protocol = message.protocol;
            if (message.extra != null && message.hasOwnProperty("extra"))
                object.extra = $root.btcapi.BtcTxExtra.toObject(message.extra, options);
            return object;
        };

        /**
         * Converts this BtcTxInput to JSON.
         * @function toJSON
         * @memberof btcapi.BtcTxInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BtcTxInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BtcTxInput;
    })();

    btcapi.BtcTxOutput = (function() {

        /**
         * Properties of a BtcTxOutput.
         * @memberof btcapi
         * @interface IBtcTxOutput
         * @property {string|null} [signature] BtcTxOutput signature
         * @property {string|null} [txHash] BtcTxOutput txHash
         * @property {string|null} [wtxHash] BtcTxOutput wtxHash
         */

        /**
         * Constructs a new BtcTxOutput.
         * @memberof btcapi
         * @classdesc Represents a BtcTxOutput.
         * @implements IBtcTxOutput
         * @constructor
         * @param {btcapi.IBtcTxOutput=} [properties] Properties to set
         */
        function BtcTxOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BtcTxOutput signature.
         * @member {string} signature
         * @memberof btcapi.BtcTxOutput
         * @instance
         */
        BtcTxOutput.prototype.signature = "";

        /**
         * BtcTxOutput txHash.
         * @member {string} txHash
         * @memberof btcapi.BtcTxOutput
         * @instance
         */
        BtcTxOutput.prototype.txHash = "";

        /**
         * BtcTxOutput wtxHash.
         * @member {string} wtxHash
         * @memberof btcapi.BtcTxOutput
         * @instance
         */
        BtcTxOutput.prototype.wtxHash = "";

        /**
         * Creates a new BtcTxOutput instance using the specified properties.
         * @function create
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {btcapi.IBtcTxOutput=} [properties] Properties to set
         * @returns {btcapi.BtcTxOutput} BtcTxOutput instance
         */
        BtcTxOutput.create = function create(properties) {
            return new BtcTxOutput(properties);
        };

        /**
         * Encodes the specified BtcTxOutput message. Does not implicitly {@link btcapi.BtcTxOutput.verify|verify} messages.
         * @function encode
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {btcapi.IBtcTxOutput} message BtcTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcTxOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            if (message.txHash != null && Object.hasOwnProperty.call(message, "txHash"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.txHash);
            if (message.wtxHash != null && Object.hasOwnProperty.call(message, "wtxHash"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.wtxHash);
            return writer;
        };

        /**
         * Encodes the specified BtcTxOutput message, length delimited. Does not implicitly {@link btcapi.BtcTxOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {btcapi.IBtcTxOutput} message BtcTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcTxOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BtcTxOutput message from the specified reader or buffer.
         * @function decode
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {btcapi.BtcTxOutput} BtcTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcTxOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.btcapi.BtcTxOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                case 2:
                    message.txHash = reader.string();
                    break;
                case 3:
                    message.wtxHash = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BtcTxOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {btcapi.BtcTxOutput} BtcTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcTxOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BtcTxOutput message.
         * @function verify
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BtcTxOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                if (!$util.isString(message.txHash))
                    return "txHash: string expected";
            if (message.wtxHash != null && message.hasOwnProperty("wtxHash"))
                if (!$util.isString(message.wtxHash))
                    return "wtxHash: string expected";
            return null;
        };

        /**
         * Creates a BtcTxOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {btcapi.BtcTxOutput} BtcTxOutput
         */
        BtcTxOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.btcapi.BtcTxOutput)
                return object;
            var message = new $root.btcapi.BtcTxOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            if (object.txHash != null)
                message.txHash = String(object.txHash);
            if (object.wtxHash != null)
                message.wtxHash = String(object.wtxHash);
            return message;
        };

        /**
         * Creates a plain object from a BtcTxOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof btcapi.BtcTxOutput
         * @static
         * @param {btcapi.BtcTxOutput} message BtcTxOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BtcTxOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.signature = "";
                object.txHash = "";
                object.wtxHash = "";
            }
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                object.txHash = message.txHash;
            if (message.wtxHash != null && message.hasOwnProperty("wtxHash"))
                object.wtxHash = message.wtxHash;
            return object;
        };

        /**
         * Converts this BtcTxOutput to JSON.
         * @function toJSON
         * @memberof btcapi.BtcTxOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BtcTxOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BtcTxOutput;
    })();

    btcapi.BtcXpubReq = (function() {

        /**
         * Properties of a BtcXpubReq.
         * @memberof btcapi
         * @interface IBtcXpubReq
         * @property {string|null} [network] BtcXpubReq network
         * @property {string|null} [path] BtcXpubReq path
         */

        /**
         * Constructs a new BtcXpubReq.
         * @memberof btcapi
         * @classdesc Represents a BtcXpubReq.
         * @implements IBtcXpubReq
         * @constructor
         * @param {btcapi.IBtcXpubReq=} [properties] Properties to set
         */
        function BtcXpubReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BtcXpubReq network.
         * @member {string} network
         * @memberof btcapi.BtcXpubReq
         * @instance
         */
        BtcXpubReq.prototype.network = "";

        /**
         * BtcXpubReq path.
         * @member {string} path
         * @memberof btcapi.BtcXpubReq
         * @instance
         */
        BtcXpubReq.prototype.path = "";

        /**
         * Creates a new BtcXpubReq instance using the specified properties.
         * @function create
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {btcapi.IBtcXpubReq=} [properties] Properties to set
         * @returns {btcapi.BtcXpubReq} BtcXpubReq instance
         */
        BtcXpubReq.create = function create(properties) {
            return new BtcXpubReq(properties);
        };

        /**
         * Encodes the specified BtcXpubReq message. Does not implicitly {@link btcapi.BtcXpubReq.verify|verify} messages.
         * @function encode
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {btcapi.IBtcXpubReq} message BtcXpubReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcXpubReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.network);
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.path);
            return writer;
        };

        /**
         * Encodes the specified BtcXpubReq message, length delimited. Does not implicitly {@link btcapi.BtcXpubReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {btcapi.IBtcXpubReq} message BtcXpubReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcXpubReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BtcXpubReq message from the specified reader or buffer.
         * @function decode
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {btcapi.BtcXpubReq} BtcXpubReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcXpubReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.btcapi.BtcXpubReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.network = reader.string();
                    break;
                case 2:
                    message.path = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BtcXpubReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {btcapi.BtcXpubReq} BtcXpubReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcXpubReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BtcXpubReq message.
         * @function verify
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BtcXpubReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.network != null && message.hasOwnProperty("network"))
                if (!$util.isString(message.network))
                    return "network: string expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            return null;
        };

        /**
         * Creates a BtcXpubReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {btcapi.BtcXpubReq} BtcXpubReq
         */
        BtcXpubReq.fromObject = function fromObject(object) {
            if (object instanceof $root.btcapi.BtcXpubReq)
                return object;
            var message = new $root.btcapi.BtcXpubReq();
            if (object.network != null)
                message.network = String(object.network);
            if (object.path != null)
                message.path = String(object.path);
            return message;
        };

        /**
         * Creates a plain object from a BtcXpubReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof btcapi.BtcXpubReq
         * @static
         * @param {btcapi.BtcXpubReq} message BtcXpubReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BtcXpubReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.network = "";
                object.path = "";
            }
            if (message.network != null && message.hasOwnProperty("network"))
                object.network = message.network;
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            return object;
        };

        /**
         * Converts this BtcXpubReq to JSON.
         * @function toJSON
         * @memberof btcapi.BtcXpubReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BtcXpubReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BtcXpubReq;
    })();

    btcapi.BtcXpubRes = (function() {

        /**
         * Properties of a BtcXpubRes.
         * @memberof btcapi
         * @interface IBtcXpubRes
         * @property {string|null} [xpub] BtcXpubRes xpub
         */

        /**
         * Constructs a new BtcXpubRes.
         * @memberof btcapi
         * @classdesc Represents a BtcXpubRes.
         * @implements IBtcXpubRes
         * @constructor
         * @param {btcapi.IBtcXpubRes=} [properties] Properties to set
         */
        function BtcXpubRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BtcXpubRes xpub.
         * @member {string} xpub
         * @memberof btcapi.BtcXpubRes
         * @instance
         */
        BtcXpubRes.prototype.xpub = "";

        /**
         * Creates a new BtcXpubRes instance using the specified properties.
         * @function create
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {btcapi.IBtcXpubRes=} [properties] Properties to set
         * @returns {btcapi.BtcXpubRes} BtcXpubRes instance
         */
        BtcXpubRes.create = function create(properties) {
            return new BtcXpubRes(properties);
        };

        /**
         * Encodes the specified BtcXpubRes message. Does not implicitly {@link btcapi.BtcXpubRes.verify|verify} messages.
         * @function encode
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {btcapi.IBtcXpubRes} message BtcXpubRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcXpubRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.xpub != null && Object.hasOwnProperty.call(message, "xpub"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.xpub);
            return writer;
        };

        /**
         * Encodes the specified BtcXpubRes message, length delimited. Does not implicitly {@link btcapi.BtcXpubRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {btcapi.IBtcXpubRes} message BtcXpubRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BtcXpubRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BtcXpubRes message from the specified reader or buffer.
         * @function decode
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {btcapi.BtcXpubRes} BtcXpubRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcXpubRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.btcapi.BtcXpubRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.xpub = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BtcXpubRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {btcapi.BtcXpubRes} BtcXpubRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BtcXpubRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BtcXpubRes message.
         * @function verify
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BtcXpubRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.xpub != null && message.hasOwnProperty("xpub"))
                if (!$util.isString(message.xpub))
                    return "xpub: string expected";
            return null;
        };

        /**
         * Creates a BtcXpubRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {btcapi.BtcXpubRes} BtcXpubRes
         */
        BtcXpubRes.fromObject = function fromObject(object) {
            if (object instanceof $root.btcapi.BtcXpubRes)
                return object;
            var message = new $root.btcapi.BtcXpubRes();
            if (object.xpub != null)
                message.xpub = String(object.xpub);
            return message;
        };

        /**
         * Creates a plain object from a BtcXpubRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof btcapi.BtcXpubRes
         * @static
         * @param {btcapi.BtcXpubRes} message BtcXpubRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BtcXpubRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.xpub = "";
            if (message.xpub != null && message.hasOwnProperty("xpub"))
                object.xpub = message.xpub;
            return object;
        };

        /**
         * Converts this BtcXpubRes to JSON.
         * @function toJSON
         * @memberof btcapi.BtcXpubRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BtcXpubRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BtcXpubRes;
    })();

    return btcapi;
})();

$root.common = (function() {

    /**
     * Namespace common.
     * @exports common
     * @namespace
     */
    var common = {};

    common.SignParam = (function() {

        /**
         * Properties of a SignParam.
         * @memberof common
         * @interface ISignParam
         * @property {string|null} [chainType] SignParam chainType
         * @property {string|null} [path] SignParam path
         * @property {string|null} [network] SignParam network
         * @property {google.protobuf.IAny|null} [input] SignParam input
         * @property {string|null} [payment] SignParam payment
         * @property {string|null} [receiver] SignParam receiver
         * @property {string|null} [sender] SignParam sender
         * @property {string|null} [fee] SignParam fee
         */

        /**
         * Constructs a new SignParam.
         * @memberof common
         * @classdesc Represents a SignParam.
         * @implements ISignParam
         * @constructor
         * @param {common.ISignParam=} [properties] Properties to set
         */
        function SignParam(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SignParam chainType.
         * @member {string} chainType
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.chainType = "";

        /**
         * SignParam path.
         * @member {string} path
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.path = "";

        /**
         * SignParam network.
         * @member {string} network
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.network = "";

        /**
         * SignParam input.
         * @member {google.protobuf.IAny|null|undefined} input
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.input = null;

        /**
         * SignParam payment.
         * @member {string} payment
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.payment = "";

        /**
         * SignParam receiver.
         * @member {string} receiver
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.receiver = "";

        /**
         * SignParam sender.
         * @member {string} sender
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.sender = "";

        /**
         * SignParam fee.
         * @member {string} fee
         * @memberof common.SignParam
         * @instance
         */
        SignParam.prototype.fee = "";

        /**
         * Creates a new SignParam instance using the specified properties.
         * @function create
         * @memberof common.SignParam
         * @static
         * @param {common.ISignParam=} [properties] Properties to set
         * @returns {common.SignParam} SignParam instance
         */
        SignParam.create = function create(properties) {
            return new SignParam(properties);
        };

        /**
         * Encodes the specified SignParam message. Does not implicitly {@link common.SignParam.verify|verify} messages.
         * @function encode
         * @memberof common.SignParam
         * @static
         * @param {common.ISignParam} message SignParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SignParam.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chainType != null && Object.hasOwnProperty.call(message, "chainType"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.chainType);
            if (message.path != null && Object.hasOwnProperty.call(message, "path"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.path);
            if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.network);
            if (message.input != null && Object.hasOwnProperty.call(message, "input"))
                $root.google.protobuf.Any.encode(message.input, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.payment != null && Object.hasOwnProperty.call(message, "payment"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.payment);
            if (message.receiver != null && Object.hasOwnProperty.call(message, "receiver"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.receiver);
            if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.sender);
            if (message.fee != null && Object.hasOwnProperty.call(message, "fee"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.fee);
            return writer;
        };

        /**
         * Encodes the specified SignParam message, length delimited. Does not implicitly {@link common.SignParam.verify|verify} messages.
         * @function encodeDelimited
         * @memberof common.SignParam
         * @static
         * @param {common.ISignParam} message SignParam message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SignParam.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SignParam message from the specified reader or buffer.
         * @function decode
         * @memberof common.SignParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {common.SignParam} SignParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignParam.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.common.SignParam();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chainType = reader.string();
                    break;
                case 2:
                    message.path = reader.string();
                    break;
                case 3:
                    message.network = reader.string();
                    break;
                case 4:
                    message.input = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.payment = reader.string();
                    break;
                case 6:
                    message.receiver = reader.string();
                    break;
                case 7:
                    message.sender = reader.string();
                    break;
                case 8:
                    message.fee = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SignParam message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof common.SignParam
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {common.SignParam} SignParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignParam.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SignParam message.
         * @function verify
         * @memberof common.SignParam
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SignParam.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                if (!$util.isString(message.chainType))
                    return "chainType: string expected";
            if (message.path != null && message.hasOwnProperty("path"))
                if (!$util.isString(message.path))
                    return "path: string expected";
            if (message.network != null && message.hasOwnProperty("network"))
                if (!$util.isString(message.network))
                    return "network: string expected";
            if (message.input != null && message.hasOwnProperty("input")) {
                var error = $root.google.protobuf.Any.verify(message.input);
                if (error)
                    return "input." + error;
            }
            if (message.payment != null && message.hasOwnProperty("payment"))
                if (!$util.isString(message.payment))
                    return "payment: string expected";
            if (message.receiver != null && message.hasOwnProperty("receiver"))
                if (!$util.isString(message.receiver))
                    return "receiver: string expected";
            if (message.sender != null && message.hasOwnProperty("sender"))
                if (!$util.isString(message.sender))
                    return "sender: string expected";
            if (message.fee != null && message.hasOwnProperty("fee"))
                if (!$util.isString(message.fee))
                    return "fee: string expected";
            return null;
        };

        /**
         * Creates a SignParam message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof common.SignParam
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {common.SignParam} SignParam
         */
        SignParam.fromObject = function fromObject(object) {
            if (object instanceof $root.common.SignParam)
                return object;
            var message = new $root.common.SignParam();
            if (object.chainType != null)
                message.chainType = String(object.chainType);
            if (object.path != null)
                message.path = String(object.path);
            if (object.network != null)
                message.network = String(object.network);
            if (object.input != null) {
                if (typeof object.input !== "object")
                    throw TypeError(".common.SignParam.input: object expected");
                message.input = $root.google.protobuf.Any.fromObject(object.input);
            }
            if (object.payment != null)
                message.payment = String(object.payment);
            if (object.receiver != null)
                message.receiver = String(object.receiver);
            if (object.sender != null)
                message.sender = String(object.sender);
            if (object.fee != null)
                message.fee = String(object.fee);
            return message;
        };

        /**
         * Creates a plain object from a SignParam message. Also converts values to other types if specified.
         * @function toObject
         * @memberof common.SignParam
         * @static
         * @param {common.SignParam} message SignParam
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SignParam.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.chainType = "";
                object.path = "";
                object.network = "";
                object.input = null;
                object.payment = "";
                object.receiver = "";
                object.sender = "";
                object.fee = "";
            }
            if (message.chainType != null && message.hasOwnProperty("chainType"))
                object.chainType = message.chainType;
            if (message.path != null && message.hasOwnProperty("path"))
                object.path = message.path;
            if (message.network != null && message.hasOwnProperty("network"))
                object.network = message.network;
            if (message.input != null && message.hasOwnProperty("input"))
                object.input = $root.google.protobuf.Any.toObject(message.input, options);
            if (message.payment != null && message.hasOwnProperty("payment"))
                object.payment = message.payment;
            if (message.receiver != null && message.hasOwnProperty("receiver"))
                object.receiver = message.receiver;
            if (message.sender != null && message.hasOwnProperty("sender"))
                object.sender = message.sender;
            if (message.fee != null && message.hasOwnProperty("fee"))
                object.fee = message.fee;
            return object;
        };

        /**
         * Converts this SignParam to JSON.
         * @function toJSON
         * @memberof common.SignParam
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SignParam.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SignParam;
    })();

    return common;
})();

$root.cosmosapi = (function() {

    /**
     * Namespace cosmosapi.
     * @exports cosmosapi
     * @namespace
     */
    var cosmosapi = {};

    cosmosapi.Coin = (function() {

        /**
         * Properties of a Coin.
         * @memberof cosmosapi
         * @interface ICoin
         * @property {string|null} [amount] Coin amount
         * @property {string|null} [denom] Coin denom
         */

        /**
         * Constructs a new Coin.
         * @memberof cosmosapi
         * @classdesc Represents a Coin.
         * @implements ICoin
         * @constructor
         * @param {cosmosapi.ICoin=} [properties] Properties to set
         */
        function Coin(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Coin amount.
         * @member {string} amount
         * @memberof cosmosapi.Coin
         * @instance
         */
        Coin.prototype.amount = "";

        /**
         * Coin denom.
         * @member {string} denom
         * @memberof cosmosapi.Coin
         * @instance
         */
        Coin.prototype.denom = "";

        /**
         * Creates a new Coin instance using the specified properties.
         * @function create
         * @memberof cosmosapi.Coin
         * @static
         * @param {cosmosapi.ICoin=} [properties] Properties to set
         * @returns {cosmosapi.Coin} Coin instance
         */
        Coin.create = function create(properties) {
            return new Coin(properties);
        };

        /**
         * Encodes the specified Coin message. Does not implicitly {@link cosmosapi.Coin.verify|verify} messages.
         * @function encode
         * @memberof cosmosapi.Coin
         * @static
         * @param {cosmosapi.ICoin} message Coin message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Coin.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.amount);
            if (message.denom != null && Object.hasOwnProperty.call(message, "denom"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.denom);
            return writer;
        };

        /**
         * Encodes the specified Coin message, length delimited. Does not implicitly {@link cosmosapi.Coin.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cosmosapi.Coin
         * @static
         * @param {cosmosapi.ICoin} message Coin message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Coin.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Coin message from the specified reader or buffer.
         * @function decode
         * @memberof cosmosapi.Coin
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cosmosapi.Coin} Coin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Coin.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmosapi.Coin();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.amount = reader.string();
                    break;
                case 2:
                    message.denom = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Coin message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cosmosapi.Coin
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cosmosapi.Coin} Coin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Coin.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Coin message.
         * @function verify
         * @memberof cosmosapi.Coin
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Coin.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isString(message.amount))
                    return "amount: string expected";
            if (message.denom != null && message.hasOwnProperty("denom"))
                if (!$util.isString(message.denom))
                    return "denom: string expected";
            return null;
        };

        /**
         * Creates a Coin message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cosmosapi.Coin
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cosmosapi.Coin} Coin
         */
        Coin.fromObject = function fromObject(object) {
            if (object instanceof $root.cosmosapi.Coin)
                return object;
            var message = new $root.cosmosapi.Coin();
            if (object.amount != null)
                message.amount = String(object.amount);
            if (object.denom != null)
                message.denom = String(object.denom);
            return message;
        };

        /**
         * Creates a plain object from a Coin message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cosmosapi.Coin
         * @static
         * @param {cosmosapi.Coin} message Coin
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Coin.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.amount = "";
                object.denom = "";
            }
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = message.amount;
            if (message.denom != null && message.hasOwnProperty("denom"))
                object.denom = message.denom;
            return object;
        };

        /**
         * Converts this Coin to JSON.
         * @function toJSON
         * @memberof cosmosapi.Coin
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Coin.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Coin;
    })();

    cosmosapi.StdFee = (function() {

        /**
         * Properties of a StdFee.
         * @memberof cosmosapi
         * @interface IStdFee
         * @property {Array.<cosmosapi.ICoin>|null} [amount] StdFee amount
         * @property {string|null} [gas] StdFee gas
         */

        /**
         * Constructs a new StdFee.
         * @memberof cosmosapi
         * @classdesc Represents a StdFee.
         * @implements IStdFee
         * @constructor
         * @param {cosmosapi.IStdFee=} [properties] Properties to set
         */
        function StdFee(properties) {
            this.amount = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StdFee amount.
         * @member {Array.<cosmosapi.ICoin>} amount
         * @memberof cosmosapi.StdFee
         * @instance
         */
        StdFee.prototype.amount = $util.emptyArray;

        /**
         * StdFee gas.
         * @member {string} gas
         * @memberof cosmosapi.StdFee
         * @instance
         */
        StdFee.prototype.gas = "";

        /**
         * Creates a new StdFee instance using the specified properties.
         * @function create
         * @memberof cosmosapi.StdFee
         * @static
         * @param {cosmosapi.IStdFee=} [properties] Properties to set
         * @returns {cosmosapi.StdFee} StdFee instance
         */
        StdFee.create = function create(properties) {
            return new StdFee(properties);
        };

        /**
         * Encodes the specified StdFee message. Does not implicitly {@link cosmosapi.StdFee.verify|verify} messages.
         * @function encode
         * @memberof cosmosapi.StdFee
         * @static
         * @param {cosmosapi.IStdFee} message StdFee message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StdFee.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.amount != null && message.amount.length)
                for (var i = 0; i < message.amount.length; ++i)
                    $root.cosmosapi.Coin.encode(message.amount[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.gas != null && Object.hasOwnProperty.call(message, "gas"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.gas);
            return writer;
        };

        /**
         * Encodes the specified StdFee message, length delimited. Does not implicitly {@link cosmosapi.StdFee.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cosmosapi.StdFee
         * @static
         * @param {cosmosapi.IStdFee} message StdFee message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StdFee.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StdFee message from the specified reader or buffer.
         * @function decode
         * @memberof cosmosapi.StdFee
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cosmosapi.StdFee} StdFee
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StdFee.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmosapi.StdFee();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.amount && message.amount.length))
                        message.amount = [];
                    message.amount.push($root.cosmosapi.Coin.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.gas = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StdFee message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cosmosapi.StdFee
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cosmosapi.StdFee} StdFee
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StdFee.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StdFee message.
         * @function verify
         * @memberof cosmosapi.StdFee
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StdFee.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.amount != null && message.hasOwnProperty("amount")) {
                if (!Array.isArray(message.amount))
                    return "amount: array expected";
                for (var i = 0; i < message.amount.length; ++i) {
                    var error = $root.cosmosapi.Coin.verify(message.amount[i]);
                    if (error)
                        return "amount." + error;
                }
            }
            if (message.gas != null && message.hasOwnProperty("gas"))
                if (!$util.isString(message.gas))
                    return "gas: string expected";
            return null;
        };

        /**
         * Creates a StdFee message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cosmosapi.StdFee
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cosmosapi.StdFee} StdFee
         */
        StdFee.fromObject = function fromObject(object) {
            if (object instanceof $root.cosmosapi.StdFee)
                return object;
            var message = new $root.cosmosapi.StdFee();
            if (object.amount) {
                if (!Array.isArray(object.amount))
                    throw TypeError(".cosmosapi.StdFee.amount: array expected");
                message.amount = [];
                for (var i = 0; i < object.amount.length; ++i) {
                    if (typeof object.amount[i] !== "object")
                        throw TypeError(".cosmosapi.StdFee.amount: object expected");
                    message.amount[i] = $root.cosmosapi.Coin.fromObject(object.amount[i]);
                }
            }
            if (object.gas != null)
                message.gas = String(object.gas);
            return message;
        };

        /**
         * Creates a plain object from a StdFee message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cosmosapi.StdFee
         * @static
         * @param {cosmosapi.StdFee} message StdFee
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StdFee.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.amount = [];
            if (options.defaults)
                object.gas = "";
            if (message.amount && message.amount.length) {
                object.amount = [];
                for (var j = 0; j < message.amount.length; ++j)
                    object.amount[j] = $root.cosmosapi.Coin.toObject(message.amount[j], options);
            }
            if (message.gas != null && message.hasOwnProperty("gas"))
                object.gas = message.gas;
            return object;
        };

        /**
         * Converts this StdFee to JSON.
         * @function toJSON
         * @memberof cosmosapi.StdFee
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StdFee.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StdFee;
    })();

    cosmosapi.CosmosTxInput = (function() {

        /**
         * Properties of a CosmosTxInput.
         * @memberof cosmosapi
         * @interface ICosmosTxInput
         * @property {string|null} [accountNumber] CosmosTxInput accountNumber
         * @property {string|null} [chainId] CosmosTxInput chainId
         * @property {cosmosapi.IStdFee|null} [fee] CosmosTxInput fee
         * @property {string|null} [memo] CosmosTxInput memo
         * @property {string|null} [msgs] CosmosTxInput msgs
         * @property {string|null} [sequence] CosmosTxInput sequence
         */

        /**
         * Constructs a new CosmosTxInput.
         * @memberof cosmosapi
         * @classdesc Represents a CosmosTxInput.
         * @implements ICosmosTxInput
         * @constructor
         * @param {cosmosapi.ICosmosTxInput=} [properties] Properties to set
         */
        function CosmosTxInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CosmosTxInput accountNumber.
         * @member {string} accountNumber
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         */
        CosmosTxInput.prototype.accountNumber = "";

        /**
         * CosmosTxInput chainId.
         * @member {string} chainId
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         */
        CosmosTxInput.prototype.chainId = "";

        /**
         * CosmosTxInput fee.
         * @member {cosmosapi.IStdFee|null|undefined} fee
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         */
        CosmosTxInput.prototype.fee = null;

        /**
         * CosmosTxInput memo.
         * @member {string} memo
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         */
        CosmosTxInput.prototype.memo = "";

        /**
         * CosmosTxInput msgs.
         * @member {string} msgs
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         */
        CosmosTxInput.prototype.msgs = "";

        /**
         * CosmosTxInput sequence.
         * @member {string} sequence
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         */
        CosmosTxInput.prototype.sequence = "";

        /**
         * Creates a new CosmosTxInput instance using the specified properties.
         * @function create
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {cosmosapi.ICosmosTxInput=} [properties] Properties to set
         * @returns {cosmosapi.CosmosTxInput} CosmosTxInput instance
         */
        CosmosTxInput.create = function create(properties) {
            return new CosmosTxInput(properties);
        };

        /**
         * Encodes the specified CosmosTxInput message. Does not implicitly {@link cosmosapi.CosmosTxInput.verify|verify} messages.
         * @function encode
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {cosmosapi.ICosmosTxInput} message CosmosTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CosmosTxInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accountNumber != null && Object.hasOwnProperty.call(message, "accountNumber"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.accountNumber);
            if (message.chainId != null && Object.hasOwnProperty.call(message, "chainId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.chainId);
            if (message.fee != null && Object.hasOwnProperty.call(message, "fee"))
                $root.cosmosapi.StdFee.encode(message.fee, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.memo != null && Object.hasOwnProperty.call(message, "memo"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.memo);
            if (message.msgs != null && Object.hasOwnProperty.call(message, "msgs"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.msgs);
            if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.sequence);
            return writer;
        };

        /**
         * Encodes the specified CosmosTxInput message, length delimited. Does not implicitly {@link cosmosapi.CosmosTxInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {cosmosapi.ICosmosTxInput} message CosmosTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CosmosTxInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CosmosTxInput message from the specified reader or buffer.
         * @function decode
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cosmosapi.CosmosTxInput} CosmosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CosmosTxInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmosapi.CosmosTxInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.accountNumber = reader.string();
                    break;
                case 2:
                    message.chainId = reader.string();
                    break;
                case 3:
                    message.fee = $root.cosmosapi.StdFee.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.memo = reader.string();
                    break;
                case 5:
                    message.msgs = reader.string();
                    break;
                case 6:
                    message.sequence = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CosmosTxInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cosmosapi.CosmosTxInput} CosmosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CosmosTxInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CosmosTxInput message.
         * @function verify
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CosmosTxInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.accountNumber != null && message.hasOwnProperty("accountNumber"))
                if (!$util.isString(message.accountNumber))
                    return "accountNumber: string expected";
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                if (!$util.isString(message.chainId))
                    return "chainId: string expected";
            if (message.fee != null && message.hasOwnProperty("fee")) {
                var error = $root.cosmosapi.StdFee.verify(message.fee);
                if (error)
                    return "fee." + error;
            }
            if (message.memo != null && message.hasOwnProperty("memo"))
                if (!$util.isString(message.memo))
                    return "memo: string expected";
            if (message.msgs != null && message.hasOwnProperty("msgs"))
                if (!$util.isString(message.msgs))
                    return "msgs: string expected";
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                if (!$util.isString(message.sequence))
                    return "sequence: string expected";
            return null;
        };

        /**
         * Creates a CosmosTxInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cosmosapi.CosmosTxInput} CosmosTxInput
         */
        CosmosTxInput.fromObject = function fromObject(object) {
            if (object instanceof $root.cosmosapi.CosmosTxInput)
                return object;
            var message = new $root.cosmosapi.CosmosTxInput();
            if (object.accountNumber != null)
                message.accountNumber = String(object.accountNumber);
            if (object.chainId != null)
                message.chainId = String(object.chainId);
            if (object.fee != null) {
                if (typeof object.fee !== "object")
                    throw TypeError(".cosmosapi.CosmosTxInput.fee: object expected");
                message.fee = $root.cosmosapi.StdFee.fromObject(object.fee);
            }
            if (object.memo != null)
                message.memo = String(object.memo);
            if (object.msgs != null)
                message.msgs = String(object.msgs);
            if (object.sequence != null)
                message.sequence = String(object.sequence);
            return message;
        };

        /**
         * Creates a plain object from a CosmosTxInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cosmosapi.CosmosTxInput
         * @static
         * @param {cosmosapi.CosmosTxInput} message CosmosTxInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CosmosTxInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.accountNumber = "";
                object.chainId = "";
                object.fee = null;
                object.memo = "";
                object.msgs = "";
                object.sequence = "";
            }
            if (message.accountNumber != null && message.hasOwnProperty("accountNumber"))
                object.accountNumber = message.accountNumber;
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                object.chainId = message.chainId;
            if (message.fee != null && message.hasOwnProperty("fee"))
                object.fee = $root.cosmosapi.StdFee.toObject(message.fee, options);
            if (message.memo != null && message.hasOwnProperty("memo"))
                object.memo = message.memo;
            if (message.msgs != null && message.hasOwnProperty("msgs"))
                object.msgs = message.msgs;
            if (message.sequence != null && message.hasOwnProperty("sequence"))
                object.sequence = message.sequence;
            return object;
        };

        /**
         * Converts this CosmosTxInput to JSON.
         * @function toJSON
         * @memberof cosmosapi.CosmosTxInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CosmosTxInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CosmosTxInput;
    })();

    cosmosapi.CosmosTxOutput = (function() {

        /**
         * Properties of a CosmosTxOutput.
         * @memberof cosmosapi
         * @interface ICosmosTxOutput
         * @property {string|null} [signature] CosmosTxOutput signature
         * @property {string|null} [txHash] CosmosTxOutput txHash
         */

        /**
         * Constructs a new CosmosTxOutput.
         * @memberof cosmosapi
         * @classdesc Represents a CosmosTxOutput.
         * @implements ICosmosTxOutput
         * @constructor
         * @param {cosmosapi.ICosmosTxOutput=} [properties] Properties to set
         */
        function CosmosTxOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CosmosTxOutput signature.
         * @member {string} signature
         * @memberof cosmosapi.CosmosTxOutput
         * @instance
         */
        CosmosTxOutput.prototype.signature = "";

        /**
         * CosmosTxOutput txHash.
         * @member {string} txHash
         * @memberof cosmosapi.CosmosTxOutput
         * @instance
         */
        CosmosTxOutput.prototype.txHash = "";

        /**
         * Creates a new CosmosTxOutput instance using the specified properties.
         * @function create
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {cosmosapi.ICosmosTxOutput=} [properties] Properties to set
         * @returns {cosmosapi.CosmosTxOutput} CosmosTxOutput instance
         */
        CosmosTxOutput.create = function create(properties) {
            return new CosmosTxOutput(properties);
        };

        /**
         * Encodes the specified CosmosTxOutput message. Does not implicitly {@link cosmosapi.CosmosTxOutput.verify|verify} messages.
         * @function encode
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {cosmosapi.ICosmosTxOutput} message CosmosTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CosmosTxOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            if (message.txHash != null && Object.hasOwnProperty.call(message, "txHash"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.txHash);
            return writer;
        };

        /**
         * Encodes the specified CosmosTxOutput message, length delimited. Does not implicitly {@link cosmosapi.CosmosTxOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {cosmosapi.ICosmosTxOutput} message CosmosTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CosmosTxOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CosmosTxOutput message from the specified reader or buffer.
         * @function decode
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {cosmosapi.CosmosTxOutput} CosmosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CosmosTxOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cosmosapi.CosmosTxOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                case 2:
                    message.txHash = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CosmosTxOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {cosmosapi.CosmosTxOutput} CosmosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CosmosTxOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CosmosTxOutput message.
         * @function verify
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CosmosTxOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                if (!$util.isString(message.txHash))
                    return "txHash: string expected";
            return null;
        };

        /**
         * Creates a CosmosTxOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {cosmosapi.CosmosTxOutput} CosmosTxOutput
         */
        CosmosTxOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.cosmosapi.CosmosTxOutput)
                return object;
            var message = new $root.cosmosapi.CosmosTxOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            if (object.txHash != null)
                message.txHash = String(object.txHash);
            return message;
        };

        /**
         * Creates a plain object from a CosmosTxOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof cosmosapi.CosmosTxOutput
         * @static
         * @param {cosmosapi.CosmosTxOutput} message CosmosTxOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CosmosTxOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.signature = "";
                object.txHash = "";
            }
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                object.txHash = message.txHash;
            return object;
        };

        /**
         * Converts this CosmosTxOutput to JSON.
         * @function toJSON
         * @memberof cosmosapi.CosmosTxOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CosmosTxOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CosmosTxOutput;
    })();

    return cosmosapi;
})();

$root.deviceapi = (function() {

    /**
     * Namespace deviceapi.
     * @exports deviceapi
     * @namespace
     */
    var deviceapi = {};

    deviceapi.AppDownloadReq = (function() {

        /**
         * Properties of an AppDownloadReq.
         * @memberof deviceapi
         * @interface IAppDownloadReq
         * @property {string|null} [appName] AppDownloadReq appName
         */

        /**
         * Constructs a new AppDownloadReq.
         * @memberof deviceapi
         * @classdesc Represents an AppDownloadReq.
         * @implements IAppDownloadReq
         * @constructor
         * @param {deviceapi.IAppDownloadReq=} [properties] Properties to set
         */
        function AppDownloadReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AppDownloadReq appName.
         * @member {string} appName
         * @memberof deviceapi.AppDownloadReq
         * @instance
         */
        AppDownloadReq.prototype.appName = "";

        /**
         * Creates a new AppDownloadReq instance using the specified properties.
         * @function create
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {deviceapi.IAppDownloadReq=} [properties] Properties to set
         * @returns {deviceapi.AppDownloadReq} AppDownloadReq instance
         */
        AppDownloadReq.create = function create(properties) {
            return new AppDownloadReq(properties);
        };

        /**
         * Encodes the specified AppDownloadReq message. Does not implicitly {@link deviceapi.AppDownloadReq.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {deviceapi.IAppDownloadReq} message AppDownloadReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AppDownloadReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.appName != null && Object.hasOwnProperty.call(message, "appName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.appName);
            return writer;
        };

        /**
         * Encodes the specified AppDownloadReq message, length delimited. Does not implicitly {@link deviceapi.AppDownloadReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {deviceapi.IAppDownloadReq} message AppDownloadReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AppDownloadReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AppDownloadReq message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.AppDownloadReq} AppDownloadReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AppDownloadReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.AppDownloadReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.appName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AppDownloadReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.AppDownloadReq} AppDownloadReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AppDownloadReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AppDownloadReq message.
         * @function verify
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AppDownloadReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.appName != null && message.hasOwnProperty("appName"))
                if (!$util.isString(message.appName))
                    return "appName: string expected";
            return null;
        };

        /**
         * Creates an AppDownloadReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.AppDownloadReq} AppDownloadReq
         */
        AppDownloadReq.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.AppDownloadReq)
                return object;
            var message = new $root.deviceapi.AppDownloadReq();
            if (object.appName != null)
                message.appName = String(object.appName);
            return message;
        };

        /**
         * Creates a plain object from an AppDownloadReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.AppDownloadReq
         * @static
         * @param {deviceapi.AppDownloadReq} message AppDownloadReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AppDownloadReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.appName = "";
            if (message.appName != null && message.hasOwnProperty("appName"))
                object.appName = message.appName;
            return object;
        };

        /**
         * Converts this AppDownloadReq to JSON.
         * @function toJSON
         * @memberof deviceapi.AppDownloadReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AppDownloadReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AppDownloadReq;
    })();

    deviceapi.AppUpdateReq = (function() {

        /**
         * Properties of an AppUpdateReq.
         * @memberof deviceapi
         * @interface IAppUpdateReq
         * @property {string|null} [appName] AppUpdateReq appName
         */

        /**
         * Constructs a new AppUpdateReq.
         * @memberof deviceapi
         * @classdesc Represents an AppUpdateReq.
         * @implements IAppUpdateReq
         * @constructor
         * @param {deviceapi.IAppUpdateReq=} [properties] Properties to set
         */
        function AppUpdateReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AppUpdateReq appName.
         * @member {string} appName
         * @memberof deviceapi.AppUpdateReq
         * @instance
         */
        AppUpdateReq.prototype.appName = "";

        /**
         * Creates a new AppUpdateReq instance using the specified properties.
         * @function create
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {deviceapi.IAppUpdateReq=} [properties] Properties to set
         * @returns {deviceapi.AppUpdateReq} AppUpdateReq instance
         */
        AppUpdateReq.create = function create(properties) {
            return new AppUpdateReq(properties);
        };

        /**
         * Encodes the specified AppUpdateReq message. Does not implicitly {@link deviceapi.AppUpdateReq.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {deviceapi.IAppUpdateReq} message AppUpdateReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AppUpdateReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.appName != null && Object.hasOwnProperty.call(message, "appName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.appName);
            return writer;
        };

        /**
         * Encodes the specified AppUpdateReq message, length delimited. Does not implicitly {@link deviceapi.AppUpdateReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {deviceapi.IAppUpdateReq} message AppUpdateReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AppUpdateReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AppUpdateReq message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.AppUpdateReq} AppUpdateReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AppUpdateReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.AppUpdateReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.appName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AppUpdateReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.AppUpdateReq} AppUpdateReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AppUpdateReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AppUpdateReq message.
         * @function verify
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AppUpdateReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.appName != null && message.hasOwnProperty("appName"))
                if (!$util.isString(message.appName))
                    return "appName: string expected";
            return null;
        };

        /**
         * Creates an AppUpdateReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.AppUpdateReq} AppUpdateReq
         */
        AppUpdateReq.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.AppUpdateReq)
                return object;
            var message = new $root.deviceapi.AppUpdateReq();
            if (object.appName != null)
                message.appName = String(object.appName);
            return message;
        };

        /**
         * Creates a plain object from an AppUpdateReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.AppUpdateReq
         * @static
         * @param {deviceapi.AppUpdateReq} message AppUpdateReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AppUpdateReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.appName = "";
            if (message.appName != null && message.hasOwnProperty("appName"))
                object.appName = message.appName;
            return object;
        };

        /**
         * Converts this AppUpdateReq to JSON.
         * @function toJSON
         * @memberof deviceapi.AppUpdateReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AppUpdateReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AppUpdateReq;
    })();

    deviceapi.AppDeleteReq = (function() {

        /**
         * Properties of an AppDeleteReq.
         * @memberof deviceapi
         * @interface IAppDeleteReq
         * @property {string|null} [appName] AppDeleteReq appName
         */

        /**
         * Constructs a new AppDeleteReq.
         * @memberof deviceapi
         * @classdesc Represents an AppDeleteReq.
         * @implements IAppDeleteReq
         * @constructor
         * @param {deviceapi.IAppDeleteReq=} [properties] Properties to set
         */
        function AppDeleteReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AppDeleteReq appName.
         * @member {string} appName
         * @memberof deviceapi.AppDeleteReq
         * @instance
         */
        AppDeleteReq.prototype.appName = "";

        /**
         * Creates a new AppDeleteReq instance using the specified properties.
         * @function create
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {deviceapi.IAppDeleteReq=} [properties] Properties to set
         * @returns {deviceapi.AppDeleteReq} AppDeleteReq instance
         */
        AppDeleteReq.create = function create(properties) {
            return new AppDeleteReq(properties);
        };

        /**
         * Encodes the specified AppDeleteReq message. Does not implicitly {@link deviceapi.AppDeleteReq.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {deviceapi.IAppDeleteReq} message AppDeleteReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AppDeleteReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.appName != null && Object.hasOwnProperty.call(message, "appName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.appName);
            return writer;
        };

        /**
         * Encodes the specified AppDeleteReq message, length delimited. Does not implicitly {@link deviceapi.AppDeleteReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {deviceapi.IAppDeleteReq} message AppDeleteReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AppDeleteReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AppDeleteReq message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.AppDeleteReq} AppDeleteReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AppDeleteReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.AppDeleteReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.appName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AppDeleteReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.AppDeleteReq} AppDeleteReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AppDeleteReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AppDeleteReq message.
         * @function verify
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AppDeleteReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.appName != null && message.hasOwnProperty("appName"))
                if (!$util.isString(message.appName))
                    return "appName: string expected";
            return null;
        };

        /**
         * Creates an AppDeleteReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.AppDeleteReq} AppDeleteReq
         */
        AppDeleteReq.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.AppDeleteReq)
                return object;
            var message = new $root.deviceapi.AppDeleteReq();
            if (object.appName != null)
                message.appName = String(object.appName);
            return message;
        };

        /**
         * Creates a plain object from an AppDeleteReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.AppDeleteReq
         * @static
         * @param {deviceapi.AppDeleteReq} message AppDeleteReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AppDeleteReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.appName = "";
            if (message.appName != null && message.hasOwnProperty("appName"))
                object.appName = message.appName;
            return object;
        };

        /**
         * Converts this AppDeleteReq to JSON.
         * @function toJSON
         * @memberof deviceapi.AppDeleteReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AppDeleteReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AppDeleteReq;
    })();

    deviceapi.CheckUpdateRes = (function() {

        /**
         * Properties of a CheckUpdateRes.
         * @memberof deviceapi
         * @interface ICheckUpdateRes
         * @property {string|null} [seId] CheckUpdateRes seId
         * @property {string|null} [sn] CheckUpdateRes sn
         * @property {string|null} [status] CheckUpdateRes status
         * @property {string|null} [sdkMode] CheckUpdateRes sdkMode
         * @property {Array.<deviceapi.IAvailableAppBean>|null} [availableAppList] CheckUpdateRes availableAppList
         */

        /**
         * Constructs a new CheckUpdateRes.
         * @memberof deviceapi
         * @classdesc Represents a CheckUpdateRes.
         * @implements ICheckUpdateRes
         * @constructor
         * @param {deviceapi.ICheckUpdateRes=} [properties] Properties to set
         */
        function CheckUpdateRes(properties) {
            this.availableAppList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CheckUpdateRes seId.
         * @member {string} seId
         * @memberof deviceapi.CheckUpdateRes
         * @instance
         */
        CheckUpdateRes.prototype.seId = "";

        /**
         * CheckUpdateRes sn.
         * @member {string} sn
         * @memberof deviceapi.CheckUpdateRes
         * @instance
         */
        CheckUpdateRes.prototype.sn = "";

        /**
         * CheckUpdateRes status.
         * @member {string} status
         * @memberof deviceapi.CheckUpdateRes
         * @instance
         */
        CheckUpdateRes.prototype.status = "";

        /**
         * CheckUpdateRes sdkMode.
         * @member {string} sdkMode
         * @memberof deviceapi.CheckUpdateRes
         * @instance
         */
        CheckUpdateRes.prototype.sdkMode = "";

        /**
         * CheckUpdateRes availableAppList.
         * @member {Array.<deviceapi.IAvailableAppBean>} availableAppList
         * @memberof deviceapi.CheckUpdateRes
         * @instance
         */
        CheckUpdateRes.prototype.availableAppList = $util.emptyArray;

        /**
         * Creates a new CheckUpdateRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {deviceapi.ICheckUpdateRes=} [properties] Properties to set
         * @returns {deviceapi.CheckUpdateRes} CheckUpdateRes instance
         */
        CheckUpdateRes.create = function create(properties) {
            return new CheckUpdateRes(properties);
        };

        /**
         * Encodes the specified CheckUpdateRes message. Does not implicitly {@link deviceapi.CheckUpdateRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {deviceapi.ICheckUpdateRes} message CheckUpdateRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CheckUpdateRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.seId != null && Object.hasOwnProperty.call(message, "seId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.seId);
            if (message.sn != null && Object.hasOwnProperty.call(message, "sn"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.sn);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.status);
            if (message.sdkMode != null && Object.hasOwnProperty.call(message, "sdkMode"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.sdkMode);
            if (message.availableAppList != null && message.availableAppList.length)
                for (var i = 0; i < message.availableAppList.length; ++i)
                    $root.deviceapi.AvailableAppBean.encode(message.availableAppList[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CheckUpdateRes message, length delimited. Does not implicitly {@link deviceapi.CheckUpdateRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {deviceapi.ICheckUpdateRes} message CheckUpdateRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CheckUpdateRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CheckUpdateRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.CheckUpdateRes} CheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CheckUpdateRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.CheckUpdateRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.seId = reader.string();
                    break;
                case 2:
                    message.sn = reader.string();
                    break;
                case 3:
                    message.status = reader.string();
                    break;
                case 4:
                    message.sdkMode = reader.string();
                    break;
                case 5:
                    if (!(message.availableAppList && message.availableAppList.length))
                        message.availableAppList = [];
                    message.availableAppList.push($root.deviceapi.AvailableAppBean.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CheckUpdateRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.CheckUpdateRes} CheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CheckUpdateRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CheckUpdateRes message.
         * @function verify
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CheckUpdateRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.seId != null && message.hasOwnProperty("seId"))
                if (!$util.isString(message.seId))
                    return "seId: string expected";
            if (message.sn != null && message.hasOwnProperty("sn"))
                if (!$util.isString(message.sn))
                    return "sn: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isString(message.status))
                    return "status: string expected";
            if (message.sdkMode != null && message.hasOwnProperty("sdkMode"))
                if (!$util.isString(message.sdkMode))
                    return "sdkMode: string expected";
            if (message.availableAppList != null && message.hasOwnProperty("availableAppList")) {
                if (!Array.isArray(message.availableAppList))
                    return "availableAppList: array expected";
                for (var i = 0; i < message.availableAppList.length; ++i) {
                    var error = $root.deviceapi.AvailableAppBean.verify(message.availableAppList[i]);
                    if (error)
                        return "availableAppList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CheckUpdateRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.CheckUpdateRes} CheckUpdateRes
         */
        CheckUpdateRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.CheckUpdateRes)
                return object;
            var message = new $root.deviceapi.CheckUpdateRes();
            if (object.seId != null)
                message.seId = String(object.seId);
            if (object.sn != null)
                message.sn = String(object.sn);
            if (object.status != null)
                message.status = String(object.status);
            if (object.sdkMode != null)
                message.sdkMode = String(object.sdkMode);
            if (object.availableAppList) {
                if (!Array.isArray(object.availableAppList))
                    throw TypeError(".deviceapi.CheckUpdateRes.availableAppList: array expected");
                message.availableAppList = [];
                for (var i = 0; i < object.availableAppList.length; ++i) {
                    if (typeof object.availableAppList[i] !== "object")
                        throw TypeError(".deviceapi.CheckUpdateRes.availableAppList: object expected");
                    message.availableAppList[i] = $root.deviceapi.AvailableAppBean.fromObject(object.availableAppList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a CheckUpdateRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.CheckUpdateRes
         * @static
         * @param {deviceapi.CheckUpdateRes} message CheckUpdateRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CheckUpdateRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.availableAppList = [];
            if (options.defaults) {
                object.seId = "";
                object.sn = "";
                object.status = "";
                object.sdkMode = "";
            }
            if (message.seId != null && message.hasOwnProperty("seId"))
                object.seId = message.seId;
            if (message.sn != null && message.hasOwnProperty("sn"))
                object.sn = message.sn;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.sdkMode != null && message.hasOwnProperty("sdkMode"))
                object.sdkMode = message.sdkMode;
            if (message.availableAppList && message.availableAppList.length) {
                object.availableAppList = [];
                for (var j = 0; j < message.availableAppList.length; ++j)
                    object.availableAppList[j] = $root.deviceapi.AvailableAppBean.toObject(message.availableAppList[j], options);
            }
            return object;
        };

        /**
         * Converts this CheckUpdateRes to JSON.
         * @function toJSON
         * @memberof deviceapi.CheckUpdateRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CheckUpdateRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CheckUpdateRes;
    })();

    deviceapi.AvailableAppBean = (function() {

        /**
         * Properties of an AvailableAppBean.
         * @memberof deviceapi
         * @interface IAvailableAppBean
         * @property {string|null} [appName] AvailableAppBean appName
         * @property {string|null} [appLogo] AvailableAppBean appLogo
         * @property {string|null} [installedVersion] AvailableAppBean installedVersion
         * @property {string|null} [lastUpdated] AvailableAppBean lastUpdated
         * @property {string|null} [latestVersion] AvailableAppBean latestVersion
         * @property {string|null} [installMode] AvailableAppBean installMode
         */

        /**
         * Constructs a new AvailableAppBean.
         * @memberof deviceapi
         * @classdesc Represents an AvailableAppBean.
         * @implements IAvailableAppBean
         * @constructor
         * @param {deviceapi.IAvailableAppBean=} [properties] Properties to set
         */
        function AvailableAppBean(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AvailableAppBean appName.
         * @member {string} appName
         * @memberof deviceapi.AvailableAppBean
         * @instance
         */
        AvailableAppBean.prototype.appName = "";

        /**
         * AvailableAppBean appLogo.
         * @member {string} appLogo
         * @memberof deviceapi.AvailableAppBean
         * @instance
         */
        AvailableAppBean.prototype.appLogo = "";

        /**
         * AvailableAppBean installedVersion.
         * @member {string} installedVersion
         * @memberof deviceapi.AvailableAppBean
         * @instance
         */
        AvailableAppBean.prototype.installedVersion = "";

        /**
         * AvailableAppBean lastUpdated.
         * @member {string} lastUpdated
         * @memberof deviceapi.AvailableAppBean
         * @instance
         */
        AvailableAppBean.prototype.lastUpdated = "";

        /**
         * AvailableAppBean latestVersion.
         * @member {string} latestVersion
         * @memberof deviceapi.AvailableAppBean
         * @instance
         */
        AvailableAppBean.prototype.latestVersion = "";

        /**
         * AvailableAppBean installMode.
         * @member {string} installMode
         * @memberof deviceapi.AvailableAppBean
         * @instance
         */
        AvailableAppBean.prototype.installMode = "";

        /**
         * Creates a new AvailableAppBean instance using the specified properties.
         * @function create
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {deviceapi.IAvailableAppBean=} [properties] Properties to set
         * @returns {deviceapi.AvailableAppBean} AvailableAppBean instance
         */
        AvailableAppBean.create = function create(properties) {
            return new AvailableAppBean(properties);
        };

        /**
         * Encodes the specified AvailableAppBean message. Does not implicitly {@link deviceapi.AvailableAppBean.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {deviceapi.IAvailableAppBean} message AvailableAppBean message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AvailableAppBean.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.appName != null && Object.hasOwnProperty.call(message, "appName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.appName);
            if (message.appLogo != null && Object.hasOwnProperty.call(message, "appLogo"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.appLogo);
            if (message.installedVersion != null && Object.hasOwnProperty.call(message, "installedVersion"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.installedVersion);
            if (message.lastUpdated != null && Object.hasOwnProperty.call(message, "lastUpdated"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.lastUpdated);
            if (message.latestVersion != null && Object.hasOwnProperty.call(message, "latestVersion"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.latestVersion);
            if (message.installMode != null && Object.hasOwnProperty.call(message, "installMode"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.installMode);
            return writer;
        };

        /**
         * Encodes the specified AvailableAppBean message, length delimited. Does not implicitly {@link deviceapi.AvailableAppBean.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {deviceapi.IAvailableAppBean} message AvailableAppBean message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AvailableAppBean.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AvailableAppBean message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.AvailableAppBean} AvailableAppBean
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AvailableAppBean.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.AvailableAppBean();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.appName = reader.string();
                    break;
                case 2:
                    message.appLogo = reader.string();
                    break;
                case 3:
                    message.installedVersion = reader.string();
                    break;
                case 4:
                    message.lastUpdated = reader.string();
                    break;
                case 5:
                    message.latestVersion = reader.string();
                    break;
                case 6:
                    message.installMode = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AvailableAppBean message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.AvailableAppBean} AvailableAppBean
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AvailableAppBean.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AvailableAppBean message.
         * @function verify
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AvailableAppBean.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.appName != null && message.hasOwnProperty("appName"))
                if (!$util.isString(message.appName))
                    return "appName: string expected";
            if (message.appLogo != null && message.hasOwnProperty("appLogo"))
                if (!$util.isString(message.appLogo))
                    return "appLogo: string expected";
            if (message.installedVersion != null && message.hasOwnProperty("installedVersion"))
                if (!$util.isString(message.installedVersion))
                    return "installedVersion: string expected";
            if (message.lastUpdated != null && message.hasOwnProperty("lastUpdated"))
                if (!$util.isString(message.lastUpdated))
                    return "lastUpdated: string expected";
            if (message.latestVersion != null && message.hasOwnProperty("latestVersion"))
                if (!$util.isString(message.latestVersion))
                    return "latestVersion: string expected";
            if (message.installMode != null && message.hasOwnProperty("installMode"))
                if (!$util.isString(message.installMode))
                    return "installMode: string expected";
            return null;
        };

        /**
         * Creates an AvailableAppBean message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.AvailableAppBean} AvailableAppBean
         */
        AvailableAppBean.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.AvailableAppBean)
                return object;
            var message = new $root.deviceapi.AvailableAppBean();
            if (object.appName != null)
                message.appName = String(object.appName);
            if (object.appLogo != null)
                message.appLogo = String(object.appLogo);
            if (object.installedVersion != null)
                message.installedVersion = String(object.installedVersion);
            if (object.lastUpdated != null)
                message.lastUpdated = String(object.lastUpdated);
            if (object.latestVersion != null)
                message.latestVersion = String(object.latestVersion);
            if (object.installMode != null)
                message.installMode = String(object.installMode);
            return message;
        };

        /**
         * Creates a plain object from an AvailableAppBean message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.AvailableAppBean
         * @static
         * @param {deviceapi.AvailableAppBean} message AvailableAppBean
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AvailableAppBean.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.appName = "";
                object.appLogo = "";
                object.installedVersion = "";
                object.lastUpdated = "";
                object.latestVersion = "";
                object.installMode = "";
            }
            if (message.appName != null && message.hasOwnProperty("appName"))
                object.appName = message.appName;
            if (message.appLogo != null && message.hasOwnProperty("appLogo"))
                object.appLogo = message.appLogo;
            if (message.installedVersion != null && message.hasOwnProperty("installedVersion"))
                object.installedVersion = message.installedVersion;
            if (message.lastUpdated != null && message.hasOwnProperty("lastUpdated"))
                object.lastUpdated = message.lastUpdated;
            if (message.latestVersion != null && message.hasOwnProperty("latestVersion"))
                object.latestVersion = message.latestVersion;
            if (message.installMode != null && message.hasOwnProperty("installMode"))
                object.installMode = message.installMode;
            return object;
        };

        /**
         * Converts this AvailableAppBean to JSON.
         * @function toJSON
         * @memberof deviceapi.AvailableAppBean
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AvailableAppBean.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AvailableAppBean;
    })();

    deviceapi.BindCheckRes = (function() {

        /**
         * Properties of a BindCheckRes.
         * @memberof deviceapi
         * @interface IBindCheckRes
         * @property {string|null} [bindStatus] BindCheckRes bindStatus
         */

        /**
         * Constructs a new BindCheckRes.
         * @memberof deviceapi
         * @classdesc Represents a BindCheckRes.
         * @implements IBindCheckRes
         * @constructor
         * @param {deviceapi.IBindCheckRes=} [properties] Properties to set
         */
        function BindCheckRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BindCheckRes bindStatus.
         * @member {string} bindStatus
         * @memberof deviceapi.BindCheckRes
         * @instance
         */
        BindCheckRes.prototype.bindStatus = "";

        /**
         * Creates a new BindCheckRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {deviceapi.IBindCheckRes=} [properties] Properties to set
         * @returns {deviceapi.BindCheckRes} BindCheckRes instance
         */
        BindCheckRes.create = function create(properties) {
            return new BindCheckRes(properties);
        };

        /**
         * Encodes the specified BindCheckRes message. Does not implicitly {@link deviceapi.BindCheckRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {deviceapi.IBindCheckRes} message BindCheckRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BindCheckRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bindStatus != null && Object.hasOwnProperty.call(message, "bindStatus"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bindStatus);
            return writer;
        };

        /**
         * Encodes the specified BindCheckRes message, length delimited. Does not implicitly {@link deviceapi.BindCheckRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {deviceapi.IBindCheckRes} message BindCheckRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BindCheckRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BindCheckRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.BindCheckRes} BindCheckRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BindCheckRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.BindCheckRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bindStatus = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BindCheckRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.BindCheckRes} BindCheckRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BindCheckRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BindCheckRes message.
         * @function verify
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BindCheckRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bindStatus != null && message.hasOwnProperty("bindStatus"))
                if (!$util.isString(message.bindStatus))
                    return "bindStatus: string expected";
            return null;
        };

        /**
         * Creates a BindCheckRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.BindCheckRes} BindCheckRes
         */
        BindCheckRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.BindCheckRes)
                return object;
            var message = new $root.deviceapi.BindCheckRes();
            if (object.bindStatus != null)
                message.bindStatus = String(object.bindStatus);
            return message;
        };

        /**
         * Creates a plain object from a BindCheckRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.BindCheckRes
         * @static
         * @param {deviceapi.BindCheckRes} message BindCheckRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BindCheckRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bindStatus = "";
            if (message.bindStatus != null && message.hasOwnProperty("bindStatus"))
                object.bindStatus = message.bindStatus;
            return object;
        };

        /**
         * Converts this BindCheckRes to JSON.
         * @function toJSON
         * @memberof deviceapi.BindCheckRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BindCheckRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BindCheckRes;
    })();

    deviceapi.BindAcquireReq = (function() {

        /**
         * Properties of a BindAcquireReq.
         * @memberof deviceapi
         * @interface IBindAcquireReq
         * @property {string|null} [bindCode] BindAcquireReq bindCode
         */

        /**
         * Constructs a new BindAcquireReq.
         * @memberof deviceapi
         * @classdesc Represents a BindAcquireReq.
         * @implements IBindAcquireReq
         * @constructor
         * @param {deviceapi.IBindAcquireReq=} [properties] Properties to set
         */
        function BindAcquireReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BindAcquireReq bindCode.
         * @member {string} bindCode
         * @memberof deviceapi.BindAcquireReq
         * @instance
         */
        BindAcquireReq.prototype.bindCode = "";

        /**
         * Creates a new BindAcquireReq instance using the specified properties.
         * @function create
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {deviceapi.IBindAcquireReq=} [properties] Properties to set
         * @returns {deviceapi.BindAcquireReq} BindAcquireReq instance
         */
        BindAcquireReq.create = function create(properties) {
            return new BindAcquireReq(properties);
        };

        /**
         * Encodes the specified BindAcquireReq message. Does not implicitly {@link deviceapi.BindAcquireReq.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {deviceapi.IBindAcquireReq} message BindAcquireReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BindAcquireReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bindCode != null && Object.hasOwnProperty.call(message, "bindCode"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bindCode);
            return writer;
        };

        /**
         * Encodes the specified BindAcquireReq message, length delimited. Does not implicitly {@link deviceapi.BindAcquireReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {deviceapi.IBindAcquireReq} message BindAcquireReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BindAcquireReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BindAcquireReq message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.BindAcquireReq} BindAcquireReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BindAcquireReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.BindAcquireReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bindCode = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BindAcquireReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.BindAcquireReq} BindAcquireReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BindAcquireReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BindAcquireReq message.
         * @function verify
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BindAcquireReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bindCode != null && message.hasOwnProperty("bindCode"))
                if (!$util.isString(message.bindCode))
                    return "bindCode: string expected";
            return null;
        };

        /**
         * Creates a BindAcquireReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.BindAcquireReq} BindAcquireReq
         */
        BindAcquireReq.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.BindAcquireReq)
                return object;
            var message = new $root.deviceapi.BindAcquireReq();
            if (object.bindCode != null)
                message.bindCode = String(object.bindCode);
            return message;
        };

        /**
         * Creates a plain object from a BindAcquireReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.BindAcquireReq
         * @static
         * @param {deviceapi.BindAcquireReq} message BindAcquireReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BindAcquireReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bindCode = "";
            if (message.bindCode != null && message.hasOwnProperty("bindCode"))
                object.bindCode = message.bindCode;
            return object;
        };

        /**
         * Converts this BindAcquireReq to JSON.
         * @function toJSON
         * @memberof deviceapi.BindAcquireReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BindAcquireReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BindAcquireReq;
    })();

    deviceapi.BindAcquireRes = (function() {

        /**
         * Properties of a BindAcquireRes.
         * @memberof deviceapi
         * @interface IBindAcquireRes
         * @property {string|null} [bindResult] BindAcquireRes bindResult
         */

        /**
         * Constructs a new BindAcquireRes.
         * @memberof deviceapi
         * @classdesc Represents a BindAcquireRes.
         * @implements IBindAcquireRes
         * @constructor
         * @param {deviceapi.IBindAcquireRes=} [properties] Properties to set
         */
        function BindAcquireRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BindAcquireRes bindResult.
         * @member {string} bindResult
         * @memberof deviceapi.BindAcquireRes
         * @instance
         */
        BindAcquireRes.prototype.bindResult = "";

        /**
         * Creates a new BindAcquireRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {deviceapi.IBindAcquireRes=} [properties] Properties to set
         * @returns {deviceapi.BindAcquireRes} BindAcquireRes instance
         */
        BindAcquireRes.create = function create(properties) {
            return new BindAcquireRes(properties);
        };

        /**
         * Encodes the specified BindAcquireRes message. Does not implicitly {@link deviceapi.BindAcquireRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {deviceapi.IBindAcquireRes} message BindAcquireRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BindAcquireRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bindResult != null && Object.hasOwnProperty.call(message, "bindResult"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bindResult);
            return writer;
        };

        /**
         * Encodes the specified BindAcquireRes message, length delimited. Does not implicitly {@link deviceapi.BindAcquireRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {deviceapi.IBindAcquireRes} message BindAcquireRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BindAcquireRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BindAcquireRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.BindAcquireRes} BindAcquireRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BindAcquireRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.BindAcquireRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bindResult = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BindAcquireRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.BindAcquireRes} BindAcquireRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BindAcquireRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BindAcquireRes message.
         * @function verify
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BindAcquireRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bindResult != null && message.hasOwnProperty("bindResult"))
                if (!$util.isString(message.bindResult))
                    return "bindResult: string expected";
            return null;
        };

        /**
         * Creates a BindAcquireRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.BindAcquireRes} BindAcquireRes
         */
        BindAcquireRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.BindAcquireRes)
                return object;
            var message = new $root.deviceapi.BindAcquireRes();
            if (object.bindResult != null)
                message.bindResult = String(object.bindResult);
            return message;
        };

        /**
         * Creates a plain object from a BindAcquireRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.BindAcquireRes
         * @static
         * @param {deviceapi.BindAcquireRes} message BindAcquireRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BindAcquireRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bindResult = "";
            if (message.bindResult != null && message.hasOwnProperty("bindResult"))
                object.bindResult = message.bindResult;
            return object;
        };

        /**
         * Converts this BindAcquireRes to JSON.
         * @function toJSON
         * @memberof deviceapi.BindAcquireRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BindAcquireRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BindAcquireRes;
    })();

    deviceapi.GetSeidRes = (function() {

        /**
         * Properties of a GetSeidRes.
         * @memberof deviceapi
         * @interface IGetSeidRes
         * @property {string|null} [seid] GetSeidRes seid
         */

        /**
         * Constructs a new GetSeidRes.
         * @memberof deviceapi
         * @classdesc Represents a GetSeidRes.
         * @implements IGetSeidRes
         * @constructor
         * @param {deviceapi.IGetSeidRes=} [properties] Properties to set
         */
        function GetSeidRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetSeidRes seid.
         * @member {string} seid
         * @memberof deviceapi.GetSeidRes
         * @instance
         */
        GetSeidRes.prototype.seid = "";

        /**
         * Creates a new GetSeidRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {deviceapi.IGetSeidRes=} [properties] Properties to set
         * @returns {deviceapi.GetSeidRes} GetSeidRes instance
         */
        GetSeidRes.create = function create(properties) {
            return new GetSeidRes(properties);
        };

        /**
         * Encodes the specified GetSeidRes message. Does not implicitly {@link deviceapi.GetSeidRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {deviceapi.IGetSeidRes} message GetSeidRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetSeidRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.seid != null && Object.hasOwnProperty.call(message, "seid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.seid);
            return writer;
        };

        /**
         * Encodes the specified GetSeidRes message, length delimited. Does not implicitly {@link deviceapi.GetSeidRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {deviceapi.IGetSeidRes} message GetSeidRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetSeidRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetSeidRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetSeidRes} GetSeidRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetSeidRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetSeidRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.seid = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetSeidRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetSeidRes} GetSeidRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetSeidRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetSeidRes message.
         * @function verify
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetSeidRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.seid != null && message.hasOwnProperty("seid"))
                if (!$util.isString(message.seid))
                    return "seid: string expected";
            return null;
        };

        /**
         * Creates a GetSeidRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetSeidRes} GetSeidRes
         */
        GetSeidRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetSeidRes)
                return object;
            var message = new $root.deviceapi.GetSeidRes();
            if (object.seid != null)
                message.seid = String(object.seid);
            return message;
        };

        /**
         * Creates a plain object from a GetSeidRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetSeidRes
         * @static
         * @param {deviceapi.GetSeidRes} message GetSeidRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetSeidRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.seid = "";
            if (message.seid != null && message.hasOwnProperty("seid"))
                object.seid = message.seid;
            return object;
        };

        /**
         * Converts this GetSeidRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetSeidRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetSeidRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetSeidRes;
    })();

    deviceapi.GetSnRes = (function() {

        /**
         * Properties of a GetSnRes.
         * @memberof deviceapi
         * @interface IGetSnRes
         * @property {string|null} [sn] GetSnRes sn
         */

        /**
         * Constructs a new GetSnRes.
         * @memberof deviceapi
         * @classdesc Represents a GetSnRes.
         * @implements IGetSnRes
         * @constructor
         * @param {deviceapi.IGetSnRes=} [properties] Properties to set
         */
        function GetSnRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetSnRes sn.
         * @member {string} sn
         * @memberof deviceapi.GetSnRes
         * @instance
         */
        GetSnRes.prototype.sn = "";

        /**
         * Creates a new GetSnRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {deviceapi.IGetSnRes=} [properties] Properties to set
         * @returns {deviceapi.GetSnRes} GetSnRes instance
         */
        GetSnRes.create = function create(properties) {
            return new GetSnRes(properties);
        };

        /**
         * Encodes the specified GetSnRes message. Does not implicitly {@link deviceapi.GetSnRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {deviceapi.IGetSnRes} message GetSnRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetSnRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sn != null && Object.hasOwnProperty.call(message, "sn"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sn);
            return writer;
        };

        /**
         * Encodes the specified GetSnRes message, length delimited. Does not implicitly {@link deviceapi.GetSnRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {deviceapi.IGetSnRes} message GetSnRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetSnRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetSnRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetSnRes} GetSnRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetSnRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetSnRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sn = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetSnRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetSnRes} GetSnRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetSnRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetSnRes message.
         * @function verify
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetSnRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sn != null && message.hasOwnProperty("sn"))
                if (!$util.isString(message.sn))
                    return "sn: string expected";
            return null;
        };

        /**
         * Creates a GetSnRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetSnRes} GetSnRes
         */
        GetSnRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetSnRes)
                return object;
            var message = new $root.deviceapi.GetSnRes();
            if (object.sn != null)
                message.sn = String(object.sn);
            return message;
        };

        /**
         * Creates a plain object from a GetSnRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetSnRes
         * @static
         * @param {deviceapi.GetSnRes} message GetSnRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetSnRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.sn = "";
            if (message.sn != null && message.hasOwnProperty("sn"))
                object.sn = message.sn;
            return object;
        };

        /**
         * Converts this GetSnRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetSnRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetSnRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetSnRes;
    })();

    deviceapi.GetRamSizeRes = (function() {

        /**
         * Properties of a GetRamSizeRes.
         * @memberof deviceapi
         * @interface IGetRamSizeRes
         * @property {string|null} [ramSize] GetRamSizeRes ramSize
         */

        /**
         * Constructs a new GetRamSizeRes.
         * @memberof deviceapi
         * @classdesc Represents a GetRamSizeRes.
         * @implements IGetRamSizeRes
         * @constructor
         * @param {deviceapi.IGetRamSizeRes=} [properties] Properties to set
         */
        function GetRamSizeRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetRamSizeRes ramSize.
         * @member {string} ramSize
         * @memberof deviceapi.GetRamSizeRes
         * @instance
         */
        GetRamSizeRes.prototype.ramSize = "";

        /**
         * Creates a new GetRamSizeRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {deviceapi.IGetRamSizeRes=} [properties] Properties to set
         * @returns {deviceapi.GetRamSizeRes} GetRamSizeRes instance
         */
        GetRamSizeRes.create = function create(properties) {
            return new GetRamSizeRes(properties);
        };

        /**
         * Encodes the specified GetRamSizeRes message. Does not implicitly {@link deviceapi.GetRamSizeRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {deviceapi.IGetRamSizeRes} message GetRamSizeRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetRamSizeRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ramSize != null && Object.hasOwnProperty.call(message, "ramSize"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ramSize);
            return writer;
        };

        /**
         * Encodes the specified GetRamSizeRes message, length delimited. Does not implicitly {@link deviceapi.GetRamSizeRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {deviceapi.IGetRamSizeRes} message GetRamSizeRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetRamSizeRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetRamSizeRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetRamSizeRes} GetRamSizeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetRamSizeRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetRamSizeRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ramSize = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetRamSizeRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetRamSizeRes} GetRamSizeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetRamSizeRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetRamSizeRes message.
         * @function verify
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetRamSizeRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ramSize != null && message.hasOwnProperty("ramSize"))
                if (!$util.isString(message.ramSize))
                    return "ramSize: string expected";
            return null;
        };

        /**
         * Creates a GetRamSizeRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetRamSizeRes} GetRamSizeRes
         */
        GetRamSizeRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetRamSizeRes)
                return object;
            var message = new $root.deviceapi.GetRamSizeRes();
            if (object.ramSize != null)
                message.ramSize = String(object.ramSize);
            return message;
        };

        /**
         * Creates a plain object from a GetRamSizeRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetRamSizeRes
         * @static
         * @param {deviceapi.GetRamSizeRes} message GetRamSizeRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetRamSizeRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.ramSize = "";
            if (message.ramSize != null && message.hasOwnProperty("ramSize"))
                object.ramSize = message.ramSize;
            return object;
        };

        /**
         * Converts this GetRamSizeRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetRamSizeRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetRamSizeRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetRamSizeRes;
    })();

    deviceapi.GetFirmwareVersionRes = (function() {

        /**
         * Properties of a GetFirmwareVersionRes.
         * @memberof deviceapi
         * @interface IGetFirmwareVersionRes
         * @property {string|null} [firmwareVersion] GetFirmwareVersionRes firmwareVersion
         */

        /**
         * Constructs a new GetFirmwareVersionRes.
         * @memberof deviceapi
         * @classdesc Represents a GetFirmwareVersionRes.
         * @implements IGetFirmwareVersionRes
         * @constructor
         * @param {deviceapi.IGetFirmwareVersionRes=} [properties] Properties to set
         */
        function GetFirmwareVersionRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetFirmwareVersionRes firmwareVersion.
         * @member {string} firmwareVersion
         * @memberof deviceapi.GetFirmwareVersionRes
         * @instance
         */
        GetFirmwareVersionRes.prototype.firmwareVersion = "";

        /**
         * Creates a new GetFirmwareVersionRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {deviceapi.IGetFirmwareVersionRes=} [properties] Properties to set
         * @returns {deviceapi.GetFirmwareVersionRes} GetFirmwareVersionRes instance
         */
        GetFirmwareVersionRes.create = function create(properties) {
            return new GetFirmwareVersionRes(properties);
        };

        /**
         * Encodes the specified GetFirmwareVersionRes message. Does not implicitly {@link deviceapi.GetFirmwareVersionRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {deviceapi.IGetFirmwareVersionRes} message GetFirmwareVersionRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetFirmwareVersionRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.firmwareVersion != null && Object.hasOwnProperty.call(message, "firmwareVersion"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.firmwareVersion);
            return writer;
        };

        /**
         * Encodes the specified GetFirmwareVersionRes message, length delimited. Does not implicitly {@link deviceapi.GetFirmwareVersionRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {deviceapi.IGetFirmwareVersionRes} message GetFirmwareVersionRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetFirmwareVersionRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetFirmwareVersionRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetFirmwareVersionRes} GetFirmwareVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetFirmwareVersionRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetFirmwareVersionRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.firmwareVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetFirmwareVersionRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetFirmwareVersionRes} GetFirmwareVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetFirmwareVersionRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetFirmwareVersionRes message.
         * @function verify
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetFirmwareVersionRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.firmwareVersion != null && message.hasOwnProperty("firmwareVersion"))
                if (!$util.isString(message.firmwareVersion))
                    return "firmwareVersion: string expected";
            return null;
        };

        /**
         * Creates a GetFirmwareVersionRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetFirmwareVersionRes} GetFirmwareVersionRes
         */
        GetFirmwareVersionRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetFirmwareVersionRes)
                return object;
            var message = new $root.deviceapi.GetFirmwareVersionRes();
            if (object.firmwareVersion != null)
                message.firmwareVersion = String(object.firmwareVersion);
            return message;
        };

        /**
         * Creates a plain object from a GetFirmwareVersionRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetFirmwareVersionRes
         * @static
         * @param {deviceapi.GetFirmwareVersionRes} message GetFirmwareVersionRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetFirmwareVersionRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.firmwareVersion = "";
            if (message.firmwareVersion != null && message.hasOwnProperty("firmwareVersion"))
                object.firmwareVersion = message.firmwareVersion;
            return object;
        };

        /**
         * Converts this GetFirmwareVersionRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetFirmwareVersionRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetFirmwareVersionRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetFirmwareVersionRes;
    })();

    deviceapi.GetBatteryPowerRes = (function() {

        /**
         * Properties of a GetBatteryPowerRes.
         * @memberof deviceapi
         * @interface IGetBatteryPowerRes
         * @property {string|null} [batteryPower] GetBatteryPowerRes batteryPower
         */

        /**
         * Constructs a new GetBatteryPowerRes.
         * @memberof deviceapi
         * @classdesc Represents a GetBatteryPowerRes.
         * @implements IGetBatteryPowerRes
         * @constructor
         * @param {deviceapi.IGetBatteryPowerRes=} [properties] Properties to set
         */
        function GetBatteryPowerRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetBatteryPowerRes batteryPower.
         * @member {string} batteryPower
         * @memberof deviceapi.GetBatteryPowerRes
         * @instance
         */
        GetBatteryPowerRes.prototype.batteryPower = "";

        /**
         * Creates a new GetBatteryPowerRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {deviceapi.IGetBatteryPowerRes=} [properties] Properties to set
         * @returns {deviceapi.GetBatteryPowerRes} GetBatteryPowerRes instance
         */
        GetBatteryPowerRes.create = function create(properties) {
            return new GetBatteryPowerRes(properties);
        };

        /**
         * Encodes the specified GetBatteryPowerRes message. Does not implicitly {@link deviceapi.GetBatteryPowerRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {deviceapi.IGetBatteryPowerRes} message GetBatteryPowerRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetBatteryPowerRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.batteryPower != null && Object.hasOwnProperty.call(message, "batteryPower"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.batteryPower);
            return writer;
        };

        /**
         * Encodes the specified GetBatteryPowerRes message, length delimited. Does not implicitly {@link deviceapi.GetBatteryPowerRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {deviceapi.IGetBatteryPowerRes} message GetBatteryPowerRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetBatteryPowerRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetBatteryPowerRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetBatteryPowerRes} GetBatteryPowerRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetBatteryPowerRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetBatteryPowerRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.batteryPower = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetBatteryPowerRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetBatteryPowerRes} GetBatteryPowerRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetBatteryPowerRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetBatteryPowerRes message.
         * @function verify
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetBatteryPowerRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.batteryPower != null && message.hasOwnProperty("batteryPower"))
                if (!$util.isString(message.batteryPower))
                    return "batteryPower: string expected";
            return null;
        };

        /**
         * Creates a GetBatteryPowerRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetBatteryPowerRes} GetBatteryPowerRes
         */
        GetBatteryPowerRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetBatteryPowerRes)
                return object;
            var message = new $root.deviceapi.GetBatteryPowerRes();
            if (object.batteryPower != null)
                message.batteryPower = String(object.batteryPower);
            return message;
        };

        /**
         * Creates a plain object from a GetBatteryPowerRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetBatteryPowerRes
         * @static
         * @param {deviceapi.GetBatteryPowerRes} message GetBatteryPowerRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetBatteryPowerRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.batteryPower = "";
            if (message.batteryPower != null && message.hasOwnProperty("batteryPower"))
                object.batteryPower = message.batteryPower;
            return object;
        };

        /**
         * Converts this GetBatteryPowerRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetBatteryPowerRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetBatteryPowerRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetBatteryPowerRes;
    })();

    deviceapi.GetLifeTimeRes = (function() {

        /**
         * Properties of a GetLifeTimeRes.
         * @memberof deviceapi
         * @interface IGetLifeTimeRes
         * @property {string|null} [lifeTime] GetLifeTimeRes lifeTime
         */

        /**
         * Constructs a new GetLifeTimeRes.
         * @memberof deviceapi
         * @classdesc Represents a GetLifeTimeRes.
         * @implements IGetLifeTimeRes
         * @constructor
         * @param {deviceapi.IGetLifeTimeRes=} [properties] Properties to set
         */
        function GetLifeTimeRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetLifeTimeRes lifeTime.
         * @member {string} lifeTime
         * @memberof deviceapi.GetLifeTimeRes
         * @instance
         */
        GetLifeTimeRes.prototype.lifeTime = "";

        /**
         * Creates a new GetLifeTimeRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {deviceapi.IGetLifeTimeRes=} [properties] Properties to set
         * @returns {deviceapi.GetLifeTimeRes} GetLifeTimeRes instance
         */
        GetLifeTimeRes.create = function create(properties) {
            return new GetLifeTimeRes(properties);
        };

        /**
         * Encodes the specified GetLifeTimeRes message. Does not implicitly {@link deviceapi.GetLifeTimeRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {deviceapi.IGetLifeTimeRes} message GetLifeTimeRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetLifeTimeRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lifeTime != null && Object.hasOwnProperty.call(message, "lifeTime"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.lifeTime);
            return writer;
        };

        /**
         * Encodes the specified GetLifeTimeRes message, length delimited. Does not implicitly {@link deviceapi.GetLifeTimeRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {deviceapi.IGetLifeTimeRes} message GetLifeTimeRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetLifeTimeRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetLifeTimeRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetLifeTimeRes} GetLifeTimeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetLifeTimeRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetLifeTimeRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.lifeTime = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetLifeTimeRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetLifeTimeRes} GetLifeTimeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetLifeTimeRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetLifeTimeRes message.
         * @function verify
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetLifeTimeRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lifeTime != null && message.hasOwnProperty("lifeTime"))
                if (!$util.isString(message.lifeTime))
                    return "lifeTime: string expected";
            return null;
        };

        /**
         * Creates a GetLifeTimeRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetLifeTimeRes} GetLifeTimeRes
         */
        GetLifeTimeRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetLifeTimeRes)
                return object;
            var message = new $root.deviceapi.GetLifeTimeRes();
            if (object.lifeTime != null)
                message.lifeTime = String(object.lifeTime);
            return message;
        };

        /**
         * Creates a plain object from a GetLifeTimeRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetLifeTimeRes
         * @static
         * @param {deviceapi.GetLifeTimeRes} message GetLifeTimeRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetLifeTimeRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.lifeTime = "";
            if (message.lifeTime != null && message.hasOwnProperty("lifeTime"))
                object.lifeTime = message.lifeTime;
            return object;
        };

        /**
         * Converts this GetLifeTimeRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetLifeTimeRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetLifeTimeRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetLifeTimeRes;
    })();

    deviceapi.GetBleNameRes = (function() {

        /**
         * Properties of a GetBleNameRes.
         * @memberof deviceapi
         * @interface IGetBleNameRes
         * @property {string|null} [bleName] GetBleNameRes bleName
         */

        /**
         * Constructs a new GetBleNameRes.
         * @memberof deviceapi
         * @classdesc Represents a GetBleNameRes.
         * @implements IGetBleNameRes
         * @constructor
         * @param {deviceapi.IGetBleNameRes=} [properties] Properties to set
         */
        function GetBleNameRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetBleNameRes bleName.
         * @member {string} bleName
         * @memberof deviceapi.GetBleNameRes
         * @instance
         */
        GetBleNameRes.prototype.bleName = "";

        /**
         * Creates a new GetBleNameRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {deviceapi.IGetBleNameRes=} [properties] Properties to set
         * @returns {deviceapi.GetBleNameRes} GetBleNameRes instance
         */
        GetBleNameRes.create = function create(properties) {
            return new GetBleNameRes(properties);
        };

        /**
         * Encodes the specified GetBleNameRes message. Does not implicitly {@link deviceapi.GetBleNameRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {deviceapi.IGetBleNameRes} message GetBleNameRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetBleNameRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bleName != null && Object.hasOwnProperty.call(message, "bleName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bleName);
            return writer;
        };

        /**
         * Encodes the specified GetBleNameRes message, length delimited. Does not implicitly {@link deviceapi.GetBleNameRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {deviceapi.IGetBleNameRes} message GetBleNameRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetBleNameRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetBleNameRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetBleNameRes} GetBleNameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetBleNameRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetBleNameRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bleName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetBleNameRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetBleNameRes} GetBleNameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetBleNameRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetBleNameRes message.
         * @function verify
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetBleNameRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bleName != null && message.hasOwnProperty("bleName"))
                if (!$util.isString(message.bleName))
                    return "bleName: string expected";
            return null;
        };

        /**
         * Creates a GetBleNameRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetBleNameRes} GetBleNameRes
         */
        GetBleNameRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetBleNameRes)
                return object;
            var message = new $root.deviceapi.GetBleNameRes();
            if (object.bleName != null)
                message.bleName = String(object.bleName);
            return message;
        };

        /**
         * Creates a plain object from a GetBleNameRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetBleNameRes
         * @static
         * @param {deviceapi.GetBleNameRes} message GetBleNameRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetBleNameRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bleName = "";
            if (message.bleName != null && message.hasOwnProperty("bleName"))
                object.bleName = message.bleName;
            return object;
        };

        /**
         * Converts this GetBleNameRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetBleNameRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetBleNameRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetBleNameRes;
    })();

    deviceapi.SetBleNameReq = (function() {

        /**
         * Properties of a SetBleNameReq.
         * @memberof deviceapi
         * @interface ISetBleNameReq
         * @property {string|null} [bleName] SetBleNameReq bleName
         */

        /**
         * Constructs a new SetBleNameReq.
         * @memberof deviceapi
         * @classdesc Represents a SetBleNameReq.
         * @implements ISetBleNameReq
         * @constructor
         * @param {deviceapi.ISetBleNameReq=} [properties] Properties to set
         */
        function SetBleNameReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetBleNameReq bleName.
         * @member {string} bleName
         * @memberof deviceapi.SetBleNameReq
         * @instance
         */
        SetBleNameReq.prototype.bleName = "";

        /**
         * Creates a new SetBleNameReq instance using the specified properties.
         * @function create
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {deviceapi.ISetBleNameReq=} [properties] Properties to set
         * @returns {deviceapi.SetBleNameReq} SetBleNameReq instance
         */
        SetBleNameReq.create = function create(properties) {
            return new SetBleNameReq(properties);
        };

        /**
         * Encodes the specified SetBleNameReq message. Does not implicitly {@link deviceapi.SetBleNameReq.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {deviceapi.ISetBleNameReq} message SetBleNameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetBleNameReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bleName != null && Object.hasOwnProperty.call(message, "bleName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bleName);
            return writer;
        };

        /**
         * Encodes the specified SetBleNameReq message, length delimited. Does not implicitly {@link deviceapi.SetBleNameReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {deviceapi.ISetBleNameReq} message SetBleNameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetBleNameReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetBleNameReq message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.SetBleNameReq} SetBleNameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetBleNameReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.SetBleNameReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bleName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetBleNameReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.SetBleNameReq} SetBleNameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetBleNameReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetBleNameReq message.
         * @function verify
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetBleNameReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bleName != null && message.hasOwnProperty("bleName"))
                if (!$util.isString(message.bleName))
                    return "bleName: string expected";
            return null;
        };

        /**
         * Creates a SetBleNameReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.SetBleNameReq} SetBleNameReq
         */
        SetBleNameReq.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.SetBleNameReq)
                return object;
            var message = new $root.deviceapi.SetBleNameReq();
            if (object.bleName != null)
                message.bleName = String(object.bleName);
            return message;
        };

        /**
         * Creates a plain object from a SetBleNameReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.SetBleNameReq
         * @static
         * @param {deviceapi.SetBleNameReq} message SetBleNameReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetBleNameReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bleName = "";
            if (message.bleName != null && message.hasOwnProperty("bleName"))
                object.bleName = message.bleName;
            return object;
        };

        /**
         * Converts this SetBleNameReq to JSON.
         * @function toJSON
         * @memberof deviceapi.SetBleNameReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetBleNameReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SetBleNameReq;
    })();

    deviceapi.GetBleVersionRes = (function() {

        /**
         * Properties of a GetBleVersionRes.
         * @memberof deviceapi
         * @interface IGetBleVersionRes
         * @property {string|null} [bleVersion] GetBleVersionRes bleVersion
         */

        /**
         * Constructs a new GetBleVersionRes.
         * @memberof deviceapi
         * @classdesc Represents a GetBleVersionRes.
         * @implements IGetBleVersionRes
         * @constructor
         * @param {deviceapi.IGetBleVersionRes=} [properties] Properties to set
         */
        function GetBleVersionRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetBleVersionRes bleVersion.
         * @member {string} bleVersion
         * @memberof deviceapi.GetBleVersionRes
         * @instance
         */
        GetBleVersionRes.prototype.bleVersion = "";

        /**
         * Creates a new GetBleVersionRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {deviceapi.IGetBleVersionRes=} [properties] Properties to set
         * @returns {deviceapi.GetBleVersionRes} GetBleVersionRes instance
         */
        GetBleVersionRes.create = function create(properties) {
            return new GetBleVersionRes(properties);
        };

        /**
         * Encodes the specified GetBleVersionRes message. Does not implicitly {@link deviceapi.GetBleVersionRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {deviceapi.IGetBleVersionRes} message GetBleVersionRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetBleVersionRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bleVersion != null && Object.hasOwnProperty.call(message, "bleVersion"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.bleVersion);
            return writer;
        };

        /**
         * Encodes the specified GetBleVersionRes message, length delimited. Does not implicitly {@link deviceapi.GetBleVersionRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {deviceapi.IGetBleVersionRes} message GetBleVersionRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetBleVersionRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetBleVersionRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetBleVersionRes} GetBleVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetBleVersionRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetBleVersionRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.bleVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetBleVersionRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetBleVersionRes} GetBleVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetBleVersionRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetBleVersionRes message.
         * @function verify
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetBleVersionRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bleVersion != null && message.hasOwnProperty("bleVersion"))
                if (!$util.isString(message.bleVersion))
                    return "bleVersion: string expected";
            return null;
        };

        /**
         * Creates a GetBleVersionRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetBleVersionRes} GetBleVersionRes
         */
        GetBleVersionRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetBleVersionRes)
                return object;
            var message = new $root.deviceapi.GetBleVersionRes();
            if (object.bleVersion != null)
                message.bleVersion = String(object.bleVersion);
            return message;
        };

        /**
         * Creates a plain object from a GetBleVersionRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetBleVersionRes
         * @static
         * @param {deviceapi.GetBleVersionRes} message GetBleVersionRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetBleVersionRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.bleVersion = "";
            if (message.bleVersion != null && message.hasOwnProperty("bleVersion"))
                object.bleVersion = message.bleVersion;
            return object;
        };

        /**
         * Converts this GetBleVersionRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetBleVersionRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetBleVersionRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetBleVersionRes;
    })();

    deviceapi.GetSdkInfoRes = (function() {

        /**
         * Properties of a GetSdkInfoRes.
         * @memberof deviceapi
         * @interface IGetSdkInfoRes
         * @property {string|null} [sdkVersion] GetSdkInfoRes sdkVersion
         */

        /**
         * Constructs a new GetSdkInfoRes.
         * @memberof deviceapi
         * @classdesc Represents a GetSdkInfoRes.
         * @implements IGetSdkInfoRes
         * @constructor
         * @param {deviceapi.IGetSdkInfoRes=} [properties] Properties to set
         */
        function GetSdkInfoRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetSdkInfoRes sdkVersion.
         * @member {string} sdkVersion
         * @memberof deviceapi.GetSdkInfoRes
         * @instance
         */
        GetSdkInfoRes.prototype.sdkVersion = "";

        /**
         * Creates a new GetSdkInfoRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {deviceapi.IGetSdkInfoRes=} [properties] Properties to set
         * @returns {deviceapi.GetSdkInfoRes} GetSdkInfoRes instance
         */
        GetSdkInfoRes.create = function create(properties) {
            return new GetSdkInfoRes(properties);
        };

        /**
         * Encodes the specified GetSdkInfoRes message. Does not implicitly {@link deviceapi.GetSdkInfoRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {deviceapi.IGetSdkInfoRes} message GetSdkInfoRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetSdkInfoRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sdkVersion != null && Object.hasOwnProperty.call(message, "sdkVersion"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sdkVersion);
            return writer;
        };

        /**
         * Encodes the specified GetSdkInfoRes message, length delimited. Does not implicitly {@link deviceapi.GetSdkInfoRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {deviceapi.IGetSdkInfoRes} message GetSdkInfoRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetSdkInfoRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetSdkInfoRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.GetSdkInfoRes} GetSdkInfoRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetSdkInfoRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.GetSdkInfoRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sdkVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetSdkInfoRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.GetSdkInfoRes} GetSdkInfoRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetSdkInfoRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetSdkInfoRes message.
         * @function verify
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetSdkInfoRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sdkVersion != null && message.hasOwnProperty("sdkVersion"))
                if (!$util.isString(message.sdkVersion))
                    return "sdkVersion: string expected";
            return null;
        };

        /**
         * Creates a GetSdkInfoRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.GetSdkInfoRes} GetSdkInfoRes
         */
        GetSdkInfoRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.GetSdkInfoRes)
                return object;
            var message = new $root.deviceapi.GetSdkInfoRes();
            if (object.sdkVersion != null)
                message.sdkVersion = String(object.sdkVersion);
            return message;
        };

        /**
         * Creates a plain object from a GetSdkInfoRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.GetSdkInfoRes
         * @static
         * @param {deviceapi.GetSdkInfoRes} message GetSdkInfoRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetSdkInfoRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.sdkVersion = "";
            if (message.sdkVersion != null && message.hasOwnProperty("sdkVersion"))
                object.sdkVersion = message.sdkVersion;
            return object;
        };

        /**
         * Converts this GetSdkInfoRes to JSON.
         * @function toJSON
         * @memberof deviceapi.GetSdkInfoRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetSdkInfoRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetSdkInfoRes;
    })();

    deviceapi.DeviceConnectReq = (function() {

        /**
         * Properties of a DeviceConnectReq.
         * @memberof deviceapi
         * @interface IDeviceConnectReq
         * @property {string|null} [deviceModelName] DeviceConnectReq deviceModelName
         */

        /**
         * Constructs a new DeviceConnectReq.
         * @memberof deviceapi
         * @classdesc Represents a DeviceConnectReq.
         * @implements IDeviceConnectReq
         * @constructor
         * @param {deviceapi.IDeviceConnectReq=} [properties] Properties to set
         */
        function DeviceConnectReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeviceConnectReq deviceModelName.
         * @member {string} deviceModelName
         * @memberof deviceapi.DeviceConnectReq
         * @instance
         */
        DeviceConnectReq.prototype.deviceModelName = "";

        /**
         * Creates a new DeviceConnectReq instance using the specified properties.
         * @function create
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {deviceapi.IDeviceConnectReq=} [properties] Properties to set
         * @returns {deviceapi.DeviceConnectReq} DeviceConnectReq instance
         */
        DeviceConnectReq.create = function create(properties) {
            return new DeviceConnectReq(properties);
        };

        /**
         * Encodes the specified DeviceConnectReq message. Does not implicitly {@link deviceapi.DeviceConnectReq.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {deviceapi.IDeviceConnectReq} message DeviceConnectReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceConnectReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.deviceModelName != null && Object.hasOwnProperty.call(message, "deviceModelName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.deviceModelName);
            return writer;
        };

        /**
         * Encodes the specified DeviceConnectReq message, length delimited. Does not implicitly {@link deviceapi.DeviceConnectReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {deviceapi.IDeviceConnectReq} message DeviceConnectReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeviceConnectReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeviceConnectReq message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.DeviceConnectReq} DeviceConnectReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceConnectReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.DeviceConnectReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.deviceModelName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeviceConnectReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.DeviceConnectReq} DeviceConnectReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeviceConnectReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeviceConnectReq message.
         * @function verify
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeviceConnectReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.deviceModelName != null && message.hasOwnProperty("deviceModelName"))
                if (!$util.isString(message.deviceModelName))
                    return "deviceModelName: string expected";
            return null;
        };

        /**
         * Creates a DeviceConnectReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.DeviceConnectReq} DeviceConnectReq
         */
        DeviceConnectReq.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.DeviceConnectReq)
                return object;
            var message = new $root.deviceapi.DeviceConnectReq();
            if (object.deviceModelName != null)
                message.deviceModelName = String(object.deviceModelName);
            return message;
        };

        /**
         * Creates a plain object from a DeviceConnectReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.DeviceConnectReq
         * @static
         * @param {deviceapi.DeviceConnectReq} message DeviceConnectReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeviceConnectReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.deviceModelName = "";
            if (message.deviceModelName != null && message.hasOwnProperty("deviceModelName"))
                object.deviceModelName = message.deviceModelName;
            return object;
        };

        /**
         * Converts this DeviceConnectReq to JSON.
         * @function toJSON
         * @memberof deviceapi.DeviceConnectReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeviceConnectReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeviceConnectReq;
    })();

    deviceapi.CosCheckUpdateRes = (function() {

        /**
         * Properties of a CosCheckUpdateRes.
         * @memberof deviceapi
         * @interface ICosCheckUpdateRes
         * @property {string|null} [seid] CosCheckUpdateRes seid
         * @property {boolean|null} [isLatest] CosCheckUpdateRes isLatest
         * @property {string|null} [latestCosVersion] CosCheckUpdateRes latestCosVersion
         * @property {string|null} [updateType] CosCheckUpdateRes updateType
         * @property {string|null} [description] CosCheckUpdateRes description
         * @property {boolean|null} [isUpdateSuccess] CosCheckUpdateRes isUpdateSuccess
         */

        /**
         * Constructs a new CosCheckUpdateRes.
         * @memberof deviceapi
         * @classdesc Represents a CosCheckUpdateRes.
         * @implements ICosCheckUpdateRes
         * @constructor
         * @param {deviceapi.ICosCheckUpdateRes=} [properties] Properties to set
         */
        function CosCheckUpdateRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CosCheckUpdateRes seid.
         * @member {string} seid
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         */
        CosCheckUpdateRes.prototype.seid = "";

        /**
         * CosCheckUpdateRes isLatest.
         * @member {boolean} isLatest
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         */
        CosCheckUpdateRes.prototype.isLatest = false;

        /**
         * CosCheckUpdateRes latestCosVersion.
         * @member {string} latestCosVersion
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         */
        CosCheckUpdateRes.prototype.latestCosVersion = "";

        /**
         * CosCheckUpdateRes updateType.
         * @member {string} updateType
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         */
        CosCheckUpdateRes.prototype.updateType = "";

        /**
         * CosCheckUpdateRes description.
         * @member {string} description
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         */
        CosCheckUpdateRes.prototype.description = "";

        /**
         * CosCheckUpdateRes isUpdateSuccess.
         * @member {boolean} isUpdateSuccess
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         */
        CosCheckUpdateRes.prototype.isUpdateSuccess = false;

        /**
         * Creates a new CosCheckUpdateRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {deviceapi.ICosCheckUpdateRes=} [properties] Properties to set
         * @returns {deviceapi.CosCheckUpdateRes} CosCheckUpdateRes instance
         */
        CosCheckUpdateRes.create = function create(properties) {
            return new CosCheckUpdateRes(properties);
        };

        /**
         * Encodes the specified CosCheckUpdateRes message. Does not implicitly {@link deviceapi.CosCheckUpdateRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {deviceapi.ICosCheckUpdateRes} message CosCheckUpdateRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CosCheckUpdateRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.seid != null && Object.hasOwnProperty.call(message, "seid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.seid);
            if (message.isLatest != null && Object.hasOwnProperty.call(message, "isLatest"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isLatest);
            if (message.latestCosVersion != null && Object.hasOwnProperty.call(message, "latestCosVersion"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.latestCosVersion);
            if (message.updateType != null && Object.hasOwnProperty.call(message, "updateType"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.updateType);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.description);
            if (message.isUpdateSuccess != null && Object.hasOwnProperty.call(message, "isUpdateSuccess"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isUpdateSuccess);
            return writer;
        };

        /**
         * Encodes the specified CosCheckUpdateRes message, length delimited. Does not implicitly {@link deviceapi.CosCheckUpdateRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {deviceapi.ICosCheckUpdateRes} message CosCheckUpdateRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CosCheckUpdateRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CosCheckUpdateRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.CosCheckUpdateRes} CosCheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CosCheckUpdateRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.CosCheckUpdateRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.seid = reader.string();
                    break;
                case 2:
                    message.isLatest = reader.bool();
                    break;
                case 3:
                    message.latestCosVersion = reader.string();
                    break;
                case 4:
                    message.updateType = reader.string();
                    break;
                case 5:
                    message.description = reader.string();
                    break;
                case 6:
                    message.isUpdateSuccess = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CosCheckUpdateRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.CosCheckUpdateRes} CosCheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CosCheckUpdateRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CosCheckUpdateRes message.
         * @function verify
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CosCheckUpdateRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.seid != null && message.hasOwnProperty("seid"))
                if (!$util.isString(message.seid))
                    return "seid: string expected";
            if (message.isLatest != null && message.hasOwnProperty("isLatest"))
                if (typeof message.isLatest !== "boolean")
                    return "isLatest: boolean expected";
            if (message.latestCosVersion != null && message.hasOwnProperty("latestCosVersion"))
                if (!$util.isString(message.latestCosVersion))
                    return "latestCosVersion: string expected";
            if (message.updateType != null && message.hasOwnProperty("updateType"))
                if (!$util.isString(message.updateType))
                    return "updateType: string expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.isUpdateSuccess != null && message.hasOwnProperty("isUpdateSuccess"))
                if (typeof message.isUpdateSuccess !== "boolean")
                    return "isUpdateSuccess: boolean expected";
            return null;
        };

        /**
         * Creates a CosCheckUpdateRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.CosCheckUpdateRes} CosCheckUpdateRes
         */
        CosCheckUpdateRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.CosCheckUpdateRes)
                return object;
            var message = new $root.deviceapi.CosCheckUpdateRes();
            if (object.seid != null)
                message.seid = String(object.seid);
            if (object.isLatest != null)
                message.isLatest = Boolean(object.isLatest);
            if (object.latestCosVersion != null)
                message.latestCosVersion = String(object.latestCosVersion);
            if (object.updateType != null)
                message.updateType = String(object.updateType);
            if (object.description != null)
                message.description = String(object.description);
            if (object.isUpdateSuccess != null)
                message.isUpdateSuccess = Boolean(object.isUpdateSuccess);
            return message;
        };

        /**
         * Creates a plain object from a CosCheckUpdateRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.CosCheckUpdateRes
         * @static
         * @param {deviceapi.CosCheckUpdateRes} message CosCheckUpdateRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CosCheckUpdateRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.seid = "";
                object.isLatest = false;
                object.latestCosVersion = "";
                object.updateType = "";
                object.description = "";
                object.isUpdateSuccess = false;
            }
            if (message.seid != null && message.hasOwnProperty("seid"))
                object.seid = message.seid;
            if (message.isLatest != null && message.hasOwnProperty("isLatest"))
                object.isLatest = message.isLatest;
            if (message.latestCosVersion != null && message.hasOwnProperty("latestCosVersion"))
                object.latestCosVersion = message.latestCosVersion;
            if (message.updateType != null && message.hasOwnProperty("updateType"))
                object.updateType = message.updateType;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.isUpdateSuccess != null && message.hasOwnProperty("isUpdateSuccess"))
                object.isUpdateSuccess = message.isUpdateSuccess;
            return object;
        };

        /**
         * Converts this CosCheckUpdateRes to JSON.
         * @function toJSON
         * @memberof deviceapi.CosCheckUpdateRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CosCheckUpdateRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CosCheckUpdateRes;
    })();

    deviceapi.IsBlStatusRes = (function() {

        /**
         * Properties of an IsBlStatusRes.
         * @memberof deviceapi
         * @interface IIsBlStatusRes
         * @property {boolean|null} [checkResult] IsBlStatusRes checkResult
         */

        /**
         * Constructs a new IsBlStatusRes.
         * @memberof deviceapi
         * @classdesc Represents an IsBlStatusRes.
         * @implements IIsBlStatusRes
         * @constructor
         * @param {deviceapi.IIsBlStatusRes=} [properties] Properties to set
         */
        function IsBlStatusRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IsBlStatusRes checkResult.
         * @member {boolean} checkResult
         * @memberof deviceapi.IsBlStatusRes
         * @instance
         */
        IsBlStatusRes.prototype.checkResult = false;

        /**
         * Creates a new IsBlStatusRes instance using the specified properties.
         * @function create
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {deviceapi.IIsBlStatusRes=} [properties] Properties to set
         * @returns {deviceapi.IsBlStatusRes} IsBlStatusRes instance
         */
        IsBlStatusRes.create = function create(properties) {
            return new IsBlStatusRes(properties);
        };

        /**
         * Encodes the specified IsBlStatusRes message. Does not implicitly {@link deviceapi.IsBlStatusRes.verify|verify} messages.
         * @function encode
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {deviceapi.IIsBlStatusRes} message IsBlStatusRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IsBlStatusRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.checkResult != null && Object.hasOwnProperty.call(message, "checkResult"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.checkResult);
            return writer;
        };

        /**
         * Encodes the specified IsBlStatusRes message, length delimited. Does not implicitly {@link deviceapi.IsBlStatusRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {deviceapi.IIsBlStatusRes} message IsBlStatusRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IsBlStatusRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an IsBlStatusRes message from the specified reader or buffer.
         * @function decode
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {deviceapi.IsBlStatusRes} IsBlStatusRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IsBlStatusRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.deviceapi.IsBlStatusRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.checkResult = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an IsBlStatusRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {deviceapi.IsBlStatusRes} IsBlStatusRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IsBlStatusRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an IsBlStatusRes message.
         * @function verify
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        IsBlStatusRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.checkResult != null && message.hasOwnProperty("checkResult"))
                if (typeof message.checkResult !== "boolean")
                    return "checkResult: boolean expected";
            return null;
        };

        /**
         * Creates an IsBlStatusRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {deviceapi.IsBlStatusRes} IsBlStatusRes
         */
        IsBlStatusRes.fromObject = function fromObject(object) {
            if (object instanceof $root.deviceapi.IsBlStatusRes)
                return object;
            var message = new $root.deviceapi.IsBlStatusRes();
            if (object.checkResult != null)
                message.checkResult = Boolean(object.checkResult);
            return message;
        };

        /**
         * Creates a plain object from an IsBlStatusRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof deviceapi.IsBlStatusRes
         * @static
         * @param {deviceapi.IsBlStatusRes} message IsBlStatusRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        IsBlStatusRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.checkResult = false;
            if (message.checkResult != null && message.hasOwnProperty("checkResult"))
                object.checkResult = message.checkResult;
            return object;
        };

        /**
         * Converts this IsBlStatusRes to JSON.
         * @function toJSON
         * @memberof deviceapi.IsBlStatusRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        IsBlStatusRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return IsBlStatusRes;
    })();

    return deviceapi;
})();

$root.eosapi = (function() {

    /**
     * Namespace eosapi.
     * @exports eosapi
     * @namespace
     */
    var eosapi = {};

    eosapi.EosTxInput = (function() {

        /**
         * Properties of an EosTxInput.
         * @memberof eosapi
         * @interface IEosTxInput
         * @property {Array.<eosapi.IEosSignData>|null} [transactions] EosTxInput transactions
         */

        /**
         * Constructs a new EosTxInput.
         * @memberof eosapi
         * @classdesc Represents an EosTxInput.
         * @implements IEosTxInput
         * @constructor
         * @param {eosapi.IEosTxInput=} [properties] Properties to set
         */
        function EosTxInput(properties) {
            this.transactions = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosTxInput transactions.
         * @member {Array.<eosapi.IEosSignData>} transactions
         * @memberof eosapi.EosTxInput
         * @instance
         */
        EosTxInput.prototype.transactions = $util.emptyArray;

        /**
         * Creates a new EosTxInput instance using the specified properties.
         * @function create
         * @memberof eosapi.EosTxInput
         * @static
         * @param {eosapi.IEosTxInput=} [properties] Properties to set
         * @returns {eosapi.EosTxInput} EosTxInput instance
         */
        EosTxInput.create = function create(properties) {
            return new EosTxInput(properties);
        };

        /**
         * Encodes the specified EosTxInput message. Does not implicitly {@link eosapi.EosTxInput.verify|verify} messages.
         * @function encode
         * @memberof eosapi.EosTxInput
         * @static
         * @param {eosapi.IEosTxInput} message EosTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosTxInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.transactions != null && message.transactions.length)
                for (var i = 0; i < message.transactions.length; ++i)
                    $root.eosapi.EosSignData.encode(message.transactions[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EosTxInput message, length delimited. Does not implicitly {@link eosapi.EosTxInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof eosapi.EosTxInput
         * @static
         * @param {eosapi.IEosTxInput} message EosTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosTxInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosTxInput message from the specified reader or buffer.
         * @function decode
         * @memberof eosapi.EosTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {eosapi.EosTxInput} EosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosTxInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.eosapi.EosTxInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.transactions && message.transactions.length))
                        message.transactions = [];
                    message.transactions.push($root.eosapi.EosSignData.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosTxInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof eosapi.EosTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {eosapi.EosTxInput} EosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosTxInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosTxInput message.
         * @function verify
         * @memberof eosapi.EosTxInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosTxInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.transactions != null && message.hasOwnProperty("transactions")) {
                if (!Array.isArray(message.transactions))
                    return "transactions: array expected";
                for (var i = 0; i < message.transactions.length; ++i) {
                    var error = $root.eosapi.EosSignData.verify(message.transactions[i]);
                    if (error)
                        return "transactions." + error;
                }
            }
            return null;
        };

        /**
         * Creates an EosTxInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof eosapi.EosTxInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {eosapi.EosTxInput} EosTxInput
         */
        EosTxInput.fromObject = function fromObject(object) {
            if (object instanceof $root.eosapi.EosTxInput)
                return object;
            var message = new $root.eosapi.EosTxInput();
            if (object.transactions) {
                if (!Array.isArray(object.transactions))
                    throw TypeError(".eosapi.EosTxInput.transactions: array expected");
                message.transactions = [];
                for (var i = 0; i < object.transactions.length; ++i) {
                    if (typeof object.transactions[i] !== "object")
                        throw TypeError(".eosapi.EosTxInput.transactions: object expected");
                    message.transactions[i] = $root.eosapi.EosSignData.fromObject(object.transactions[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an EosTxInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof eosapi.EosTxInput
         * @static
         * @param {eosapi.EosTxInput} message EosTxInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosTxInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.transactions = [];
            if (message.transactions && message.transactions.length) {
                object.transactions = [];
                for (var j = 0; j < message.transactions.length; ++j)
                    object.transactions[j] = $root.eosapi.EosSignData.toObject(message.transactions[j], options);
            }
            return object;
        };

        /**
         * Converts this EosTxInput to JSON.
         * @function toJSON
         * @memberof eosapi.EosTxInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosTxInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EosTxInput;
    })();

    eosapi.EosSignData = (function() {

        /**
         * Properties of an EosSignData.
         * @memberof eosapi
         * @interface IEosSignData
         * @property {string|null} [txHex] EosSignData txHex
         * @property {Array.<string>|null} [publicKeys] EosSignData publicKeys
         * @property {string|null} [chainId] EosSignData chainId
         * @property {string|null} [receiver] EosSignData receiver
         * @property {string|null} [payment] EosSignData payment
         * @property {string|null} [sender] EosSignData sender
         */

        /**
         * Constructs a new EosSignData.
         * @memberof eosapi
         * @classdesc Represents an EosSignData.
         * @implements IEosSignData
         * @constructor
         * @param {eosapi.IEosSignData=} [properties] Properties to set
         */
        function EosSignData(properties) {
            this.publicKeys = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosSignData txHex.
         * @member {string} txHex
         * @memberof eosapi.EosSignData
         * @instance
         */
        EosSignData.prototype.txHex = "";

        /**
         * EosSignData publicKeys.
         * @member {Array.<string>} publicKeys
         * @memberof eosapi.EosSignData
         * @instance
         */
        EosSignData.prototype.publicKeys = $util.emptyArray;

        /**
         * EosSignData chainId.
         * @member {string} chainId
         * @memberof eosapi.EosSignData
         * @instance
         */
        EosSignData.prototype.chainId = "";

        /**
         * EosSignData receiver.
         * @member {string} receiver
         * @memberof eosapi.EosSignData
         * @instance
         */
        EosSignData.prototype.receiver = "";

        /**
         * EosSignData payment.
         * @member {string} payment
         * @memberof eosapi.EosSignData
         * @instance
         */
        EosSignData.prototype.payment = "";

        /**
         * EosSignData sender.
         * @member {string} sender
         * @memberof eosapi.EosSignData
         * @instance
         */
        EosSignData.prototype.sender = "";

        /**
         * Creates a new EosSignData instance using the specified properties.
         * @function create
         * @memberof eosapi.EosSignData
         * @static
         * @param {eosapi.IEosSignData=} [properties] Properties to set
         * @returns {eosapi.EosSignData} EosSignData instance
         */
        EosSignData.create = function create(properties) {
            return new EosSignData(properties);
        };

        /**
         * Encodes the specified EosSignData message. Does not implicitly {@link eosapi.EosSignData.verify|verify} messages.
         * @function encode
         * @memberof eosapi.EosSignData
         * @static
         * @param {eosapi.IEosSignData} message EosSignData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosSignData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.txHex != null && Object.hasOwnProperty.call(message, "txHex"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.txHex);
            if (message.publicKeys != null && message.publicKeys.length)
                for (var i = 0; i < message.publicKeys.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.publicKeys[i]);
            if (message.chainId != null && Object.hasOwnProperty.call(message, "chainId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.chainId);
            if (message.receiver != null && Object.hasOwnProperty.call(message, "receiver"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.receiver);
            if (message.payment != null && Object.hasOwnProperty.call(message, "payment"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.payment);
            if (message.sender != null && Object.hasOwnProperty.call(message, "sender"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.sender);
            return writer;
        };

        /**
         * Encodes the specified EosSignData message, length delimited. Does not implicitly {@link eosapi.EosSignData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof eosapi.EosSignData
         * @static
         * @param {eosapi.IEosSignData} message EosSignData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosSignData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosSignData message from the specified reader or buffer.
         * @function decode
         * @memberof eosapi.EosSignData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {eosapi.EosSignData} EosSignData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosSignData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.eosapi.EosSignData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.txHex = reader.string();
                    break;
                case 2:
                    if (!(message.publicKeys && message.publicKeys.length))
                        message.publicKeys = [];
                    message.publicKeys.push(reader.string());
                    break;
                case 3:
                    message.chainId = reader.string();
                    break;
                case 4:
                    message.receiver = reader.string();
                    break;
                case 5:
                    message.payment = reader.string();
                    break;
                case 6:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosSignData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof eosapi.EosSignData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {eosapi.EosSignData} EosSignData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosSignData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosSignData message.
         * @function verify
         * @memberof eosapi.EosSignData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosSignData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.txHex != null && message.hasOwnProperty("txHex"))
                if (!$util.isString(message.txHex))
                    return "txHex: string expected";
            if (message.publicKeys != null && message.hasOwnProperty("publicKeys")) {
                if (!Array.isArray(message.publicKeys))
                    return "publicKeys: array expected";
                for (var i = 0; i < message.publicKeys.length; ++i)
                    if (!$util.isString(message.publicKeys[i]))
                        return "publicKeys: string[] expected";
            }
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                if (!$util.isString(message.chainId))
                    return "chainId: string expected";
            if (message.receiver != null && message.hasOwnProperty("receiver"))
                if (!$util.isString(message.receiver))
                    return "receiver: string expected";
            if (message.payment != null && message.hasOwnProperty("payment"))
                if (!$util.isString(message.payment))
                    return "payment: string expected";
            if (message.sender != null && message.hasOwnProperty("sender"))
                if (!$util.isString(message.sender))
                    return "sender: string expected";
            return null;
        };

        /**
         * Creates an EosSignData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof eosapi.EosSignData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {eosapi.EosSignData} EosSignData
         */
        EosSignData.fromObject = function fromObject(object) {
            if (object instanceof $root.eosapi.EosSignData)
                return object;
            var message = new $root.eosapi.EosSignData();
            if (object.txHex != null)
                message.txHex = String(object.txHex);
            if (object.publicKeys) {
                if (!Array.isArray(object.publicKeys))
                    throw TypeError(".eosapi.EosSignData.publicKeys: array expected");
                message.publicKeys = [];
                for (var i = 0; i < object.publicKeys.length; ++i)
                    message.publicKeys[i] = String(object.publicKeys[i]);
            }
            if (object.chainId != null)
                message.chainId = String(object.chainId);
            if (object.receiver != null)
                message.receiver = String(object.receiver);
            if (object.payment != null)
                message.payment = String(object.payment);
            if (object.sender != null)
                message.sender = String(object.sender);
            return message;
        };

        /**
         * Creates a plain object from an EosSignData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof eosapi.EosSignData
         * @static
         * @param {eosapi.EosSignData} message EosSignData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosSignData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.publicKeys = [];
            if (options.defaults) {
                object.txHex = "";
                object.chainId = "";
                object.receiver = "";
                object.payment = "";
                object.sender = "";
            }
            if (message.txHex != null && message.hasOwnProperty("txHex"))
                object.txHex = message.txHex;
            if (message.publicKeys && message.publicKeys.length) {
                object.publicKeys = [];
                for (var j = 0; j < message.publicKeys.length; ++j)
                    object.publicKeys[j] = message.publicKeys[j];
            }
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                object.chainId = message.chainId;
            if (message.receiver != null && message.hasOwnProperty("receiver"))
                object.receiver = message.receiver;
            if (message.payment != null && message.hasOwnProperty("payment"))
                object.payment = message.payment;
            if (message.sender != null && message.hasOwnProperty("sender"))
                object.sender = message.sender;
            return object;
        };

        /**
         * Converts this EosSignData to JSON.
         * @function toJSON
         * @memberof eosapi.EosSignData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosSignData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EosSignData;
    })();

    eosapi.EosTxOutput = (function() {

        /**
         * Properties of an EosTxOutput.
         * @memberof eosapi
         * @interface IEosTxOutput
         * @property {Array.<eosapi.IEosSignResult>|null} [transMultiSigns] EosTxOutput transMultiSigns
         */

        /**
         * Constructs a new EosTxOutput.
         * @memberof eosapi
         * @classdesc Represents an EosTxOutput.
         * @implements IEosTxOutput
         * @constructor
         * @param {eosapi.IEosTxOutput=} [properties] Properties to set
         */
        function EosTxOutput(properties) {
            this.transMultiSigns = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosTxOutput transMultiSigns.
         * @member {Array.<eosapi.IEosSignResult>} transMultiSigns
         * @memberof eosapi.EosTxOutput
         * @instance
         */
        EosTxOutput.prototype.transMultiSigns = $util.emptyArray;

        /**
         * Creates a new EosTxOutput instance using the specified properties.
         * @function create
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {eosapi.IEosTxOutput=} [properties] Properties to set
         * @returns {eosapi.EosTxOutput} EosTxOutput instance
         */
        EosTxOutput.create = function create(properties) {
            return new EosTxOutput(properties);
        };

        /**
         * Encodes the specified EosTxOutput message. Does not implicitly {@link eosapi.EosTxOutput.verify|verify} messages.
         * @function encode
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {eosapi.IEosTxOutput} message EosTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosTxOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.transMultiSigns != null && message.transMultiSigns.length)
                for (var i = 0; i < message.transMultiSigns.length; ++i)
                    $root.eosapi.EosSignResult.encode(message.transMultiSigns[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EosTxOutput message, length delimited. Does not implicitly {@link eosapi.EosTxOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {eosapi.IEosTxOutput} message EosTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosTxOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosTxOutput message from the specified reader or buffer.
         * @function decode
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {eosapi.EosTxOutput} EosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosTxOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.eosapi.EosTxOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.transMultiSigns && message.transMultiSigns.length))
                        message.transMultiSigns = [];
                    message.transMultiSigns.push($root.eosapi.EosSignResult.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosTxOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {eosapi.EosTxOutput} EosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosTxOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosTxOutput message.
         * @function verify
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosTxOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.transMultiSigns != null && message.hasOwnProperty("transMultiSigns")) {
                if (!Array.isArray(message.transMultiSigns))
                    return "transMultiSigns: array expected";
                for (var i = 0; i < message.transMultiSigns.length; ++i) {
                    var error = $root.eosapi.EosSignResult.verify(message.transMultiSigns[i]);
                    if (error)
                        return "transMultiSigns." + error;
                }
            }
            return null;
        };

        /**
         * Creates an EosTxOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {eosapi.EosTxOutput} EosTxOutput
         */
        EosTxOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.eosapi.EosTxOutput)
                return object;
            var message = new $root.eosapi.EosTxOutput();
            if (object.transMultiSigns) {
                if (!Array.isArray(object.transMultiSigns))
                    throw TypeError(".eosapi.EosTxOutput.transMultiSigns: array expected");
                message.transMultiSigns = [];
                for (var i = 0; i < object.transMultiSigns.length; ++i) {
                    if (typeof object.transMultiSigns[i] !== "object")
                        throw TypeError(".eosapi.EosTxOutput.transMultiSigns: object expected");
                    message.transMultiSigns[i] = $root.eosapi.EosSignResult.fromObject(object.transMultiSigns[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an EosTxOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof eosapi.EosTxOutput
         * @static
         * @param {eosapi.EosTxOutput} message EosTxOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosTxOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.transMultiSigns = [];
            if (message.transMultiSigns && message.transMultiSigns.length) {
                object.transMultiSigns = [];
                for (var j = 0; j < message.transMultiSigns.length; ++j)
                    object.transMultiSigns[j] = $root.eosapi.EosSignResult.toObject(message.transMultiSigns[j], options);
            }
            return object;
        };

        /**
         * Converts this EosTxOutput to JSON.
         * @function toJSON
         * @memberof eosapi.EosTxOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosTxOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EosTxOutput;
    })();

    eosapi.EosSignResult = (function() {

        /**
         * Properties of an EosSignResult.
         * @memberof eosapi
         * @interface IEosSignResult
         * @property {string|null} [hash] EosSignResult hash
         * @property {Array.<string>|null} [signs] EosSignResult signs
         */

        /**
         * Constructs a new EosSignResult.
         * @memberof eosapi
         * @classdesc Represents an EosSignResult.
         * @implements IEosSignResult
         * @constructor
         * @param {eosapi.IEosSignResult=} [properties] Properties to set
         */
        function EosSignResult(properties) {
            this.signs = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosSignResult hash.
         * @member {string} hash
         * @memberof eosapi.EosSignResult
         * @instance
         */
        EosSignResult.prototype.hash = "";

        /**
         * EosSignResult signs.
         * @member {Array.<string>} signs
         * @memberof eosapi.EosSignResult
         * @instance
         */
        EosSignResult.prototype.signs = $util.emptyArray;

        /**
         * Creates a new EosSignResult instance using the specified properties.
         * @function create
         * @memberof eosapi.EosSignResult
         * @static
         * @param {eosapi.IEosSignResult=} [properties] Properties to set
         * @returns {eosapi.EosSignResult} EosSignResult instance
         */
        EosSignResult.create = function create(properties) {
            return new EosSignResult(properties);
        };

        /**
         * Encodes the specified EosSignResult message. Does not implicitly {@link eosapi.EosSignResult.verify|verify} messages.
         * @function encode
         * @memberof eosapi.EosSignResult
         * @static
         * @param {eosapi.IEosSignResult} message EosSignResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosSignResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hash != null && Object.hasOwnProperty.call(message, "hash"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.hash);
            if (message.signs != null && message.signs.length)
                for (var i = 0; i < message.signs.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.signs[i]);
            return writer;
        };

        /**
         * Encodes the specified EosSignResult message, length delimited. Does not implicitly {@link eosapi.EosSignResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof eosapi.EosSignResult
         * @static
         * @param {eosapi.IEosSignResult} message EosSignResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosSignResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosSignResult message from the specified reader or buffer.
         * @function decode
         * @memberof eosapi.EosSignResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {eosapi.EosSignResult} EosSignResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosSignResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.eosapi.EosSignResult();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.hash = reader.string();
                    break;
                case 2:
                    if (!(message.signs && message.signs.length))
                        message.signs = [];
                    message.signs.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosSignResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof eosapi.EosSignResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {eosapi.EosSignResult} EosSignResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosSignResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosSignResult message.
         * @function verify
         * @memberof eosapi.EosSignResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosSignResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hash != null && message.hasOwnProperty("hash"))
                if (!$util.isString(message.hash))
                    return "hash: string expected";
            if (message.signs != null && message.hasOwnProperty("signs")) {
                if (!Array.isArray(message.signs))
                    return "signs: array expected";
                for (var i = 0; i < message.signs.length; ++i)
                    if (!$util.isString(message.signs[i]))
                        return "signs: string[] expected";
            }
            return null;
        };

        /**
         * Creates an EosSignResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof eosapi.EosSignResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {eosapi.EosSignResult} EosSignResult
         */
        EosSignResult.fromObject = function fromObject(object) {
            if (object instanceof $root.eosapi.EosSignResult)
                return object;
            var message = new $root.eosapi.EosSignResult();
            if (object.hash != null)
                message.hash = String(object.hash);
            if (object.signs) {
                if (!Array.isArray(object.signs))
                    throw TypeError(".eosapi.EosSignResult.signs: array expected");
                message.signs = [];
                for (var i = 0; i < object.signs.length; ++i)
                    message.signs[i] = String(object.signs[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from an EosSignResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof eosapi.EosSignResult
         * @static
         * @param {eosapi.EosSignResult} message EosSignResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosSignResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.signs = [];
            if (options.defaults)
                object.hash = "";
            if (message.hash != null && message.hasOwnProperty("hash"))
                object.hash = message.hash;
            if (message.signs && message.signs.length) {
                object.signs = [];
                for (var j = 0; j < message.signs.length; ++j)
                    object.signs[j] = message.signs[j];
            }
            return object;
        };

        /**
         * Converts this EosSignResult to JSON.
         * @function toJSON
         * @memberof eosapi.EosSignResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosSignResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EosSignResult;
    })();

    eosapi.EosMessageInput = (function() {

        /**
         * Properties of an EosMessageInput.
         * @memberof eosapi
         * @interface IEosMessageInput
         * @property {string|null} [data] EosMessageInput data
         * @property {string|null} [pubkey] EosMessageInput pubkey
         * @property {boolean|null} [isHex] EosMessageInput isHex
         */

        /**
         * Constructs a new EosMessageInput.
         * @memberof eosapi
         * @classdesc Represents an EosMessageInput.
         * @implements IEosMessageInput
         * @constructor
         * @param {eosapi.IEosMessageInput=} [properties] Properties to set
         */
        function EosMessageInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosMessageInput data.
         * @member {string} data
         * @memberof eosapi.EosMessageInput
         * @instance
         */
        EosMessageInput.prototype.data = "";

        /**
         * EosMessageInput pubkey.
         * @member {string} pubkey
         * @memberof eosapi.EosMessageInput
         * @instance
         */
        EosMessageInput.prototype.pubkey = "";

        /**
         * EosMessageInput isHex.
         * @member {boolean} isHex
         * @memberof eosapi.EosMessageInput
         * @instance
         */
        EosMessageInput.prototype.isHex = false;

        /**
         * Creates a new EosMessageInput instance using the specified properties.
         * @function create
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {eosapi.IEosMessageInput=} [properties] Properties to set
         * @returns {eosapi.EosMessageInput} EosMessageInput instance
         */
        EosMessageInput.create = function create(properties) {
            return new EosMessageInput(properties);
        };

        /**
         * Encodes the specified EosMessageInput message. Does not implicitly {@link eosapi.EosMessageInput.verify|verify} messages.
         * @function encode
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {eosapi.IEosMessageInput} message EosMessageInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosMessageInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
            if (message.pubkey != null && Object.hasOwnProperty.call(message, "pubkey"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.pubkey);
            if (message.isHex != null && Object.hasOwnProperty.call(message, "isHex"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isHex);
            return writer;
        };

        /**
         * Encodes the specified EosMessageInput message, length delimited. Does not implicitly {@link eosapi.EosMessageInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {eosapi.IEosMessageInput} message EosMessageInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosMessageInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosMessageInput message from the specified reader or buffer.
         * @function decode
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {eosapi.EosMessageInput} EosMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosMessageInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.eosapi.EosMessageInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.data = reader.string();
                    break;
                case 2:
                    message.pubkey = reader.string();
                    break;
                case 3:
                    message.isHex = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosMessageInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {eosapi.EosMessageInput} EosMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosMessageInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosMessageInput message.
         * @function verify
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosMessageInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                if (!$util.isString(message.pubkey))
                    return "pubkey: string expected";
            if (message.isHex != null && message.hasOwnProperty("isHex"))
                if (typeof message.isHex !== "boolean")
                    return "isHex: boolean expected";
            return null;
        };

        /**
         * Creates an EosMessageInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {eosapi.EosMessageInput} EosMessageInput
         */
        EosMessageInput.fromObject = function fromObject(object) {
            if (object instanceof $root.eosapi.EosMessageInput)
                return object;
            var message = new $root.eosapi.EosMessageInput();
            if (object.data != null)
                message.data = String(object.data);
            if (object.pubkey != null)
                message.pubkey = String(object.pubkey);
            if (object.isHex != null)
                message.isHex = Boolean(object.isHex);
            return message;
        };

        /**
         * Creates a plain object from an EosMessageInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof eosapi.EosMessageInput
         * @static
         * @param {eosapi.EosMessageInput} message EosMessageInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosMessageInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.data = "";
                object.pubkey = "";
                object.isHex = false;
            }
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            if (message.pubkey != null && message.hasOwnProperty("pubkey"))
                object.pubkey = message.pubkey;
            if (message.isHex != null && message.hasOwnProperty("isHex"))
                object.isHex = message.isHex;
            return object;
        };

        /**
         * Converts this EosMessageInput to JSON.
         * @function toJSON
         * @memberof eosapi.EosMessageInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosMessageInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EosMessageInput;
    })();

    eosapi.EosMessageOutput = (function() {

        /**
         * Properties of an EosMessageOutput.
         * @memberof eosapi
         * @interface IEosMessageOutput
         * @property {string|null} [signature] EosMessageOutput signature
         */

        /**
         * Constructs a new EosMessageOutput.
         * @memberof eosapi
         * @classdesc Represents an EosMessageOutput.
         * @implements IEosMessageOutput
         * @constructor
         * @param {eosapi.IEosMessageOutput=} [properties] Properties to set
         */
        function EosMessageOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EosMessageOutput signature.
         * @member {string} signature
         * @memberof eosapi.EosMessageOutput
         * @instance
         */
        EosMessageOutput.prototype.signature = "";

        /**
         * Creates a new EosMessageOutput instance using the specified properties.
         * @function create
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {eosapi.IEosMessageOutput=} [properties] Properties to set
         * @returns {eosapi.EosMessageOutput} EosMessageOutput instance
         */
        EosMessageOutput.create = function create(properties) {
            return new EosMessageOutput(properties);
        };

        /**
         * Encodes the specified EosMessageOutput message. Does not implicitly {@link eosapi.EosMessageOutput.verify|verify} messages.
         * @function encode
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {eosapi.IEosMessageOutput} message EosMessageOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosMessageOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            return writer;
        };

        /**
         * Encodes the specified EosMessageOutput message, length delimited. Does not implicitly {@link eosapi.EosMessageOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {eosapi.IEosMessageOutput} message EosMessageOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EosMessageOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EosMessageOutput message from the specified reader or buffer.
         * @function decode
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {eosapi.EosMessageOutput} EosMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosMessageOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.eosapi.EosMessageOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EosMessageOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {eosapi.EosMessageOutput} EosMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EosMessageOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EosMessageOutput message.
         * @function verify
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EosMessageOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            return null;
        };

        /**
         * Creates an EosMessageOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {eosapi.EosMessageOutput} EosMessageOutput
         */
        EosMessageOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.eosapi.EosMessageOutput)
                return object;
            var message = new $root.eosapi.EosMessageOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            return message;
        };

        /**
         * Creates a plain object from an EosMessageOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof eosapi.EosMessageOutput
         * @static
         * @param {eosapi.EosMessageOutput} message EosMessageOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EosMessageOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.signature = "";
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            return object;
        };

        /**
         * Converts this EosMessageOutput to JSON.
         * @function toJSON
         * @memberof eosapi.EosMessageOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EosMessageOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EosMessageOutput;
    })();

    return eosapi;
})();

$root.ethapi = (function() {

    /**
     * Namespace ethapi.
     * @exports ethapi
     * @namespace
     */
    var ethapi = {};

    ethapi.EthTxInput = (function() {

        /**
         * Properties of an EthTxInput.
         * @memberof ethapi
         * @interface IEthTxInput
         * @property {string|null} [nonce] EthTxInput nonce
         * @property {string|null} [gasPrice] EthTxInput gasPrice
         * @property {string|null} [gasLimit] EthTxInput gasLimit
         * @property {string|null} [to] EthTxInput to
         * @property {string|null} [value] EthTxInput value
         * @property {string|null} [data] EthTxInput data
         * @property {string|null} [chainId] EthTxInput chainId
         */

        /**
         * Constructs a new EthTxInput.
         * @memberof ethapi
         * @classdesc Represents an EthTxInput.
         * @implements IEthTxInput
         * @constructor
         * @param {ethapi.IEthTxInput=} [properties] Properties to set
         */
        function EthTxInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EthTxInput nonce.
         * @member {string} nonce
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.nonce = "";

        /**
         * EthTxInput gasPrice.
         * @member {string} gasPrice
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.gasPrice = "";

        /**
         * EthTxInput gasLimit.
         * @member {string} gasLimit
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.gasLimit = "";

        /**
         * EthTxInput to.
         * @member {string} to
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.to = "";

        /**
         * EthTxInput value.
         * @member {string} value
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.value = "";

        /**
         * EthTxInput data.
         * @member {string} data
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.data = "";

        /**
         * EthTxInput chainId.
         * @member {string} chainId
         * @memberof ethapi.EthTxInput
         * @instance
         */
        EthTxInput.prototype.chainId = "";

        /**
         * Creates a new EthTxInput instance using the specified properties.
         * @function create
         * @memberof ethapi.EthTxInput
         * @static
         * @param {ethapi.IEthTxInput=} [properties] Properties to set
         * @returns {ethapi.EthTxInput} EthTxInput instance
         */
        EthTxInput.create = function create(properties) {
            return new EthTxInput(properties);
        };

        /**
         * Encodes the specified EthTxInput message. Does not implicitly {@link ethapi.EthTxInput.verify|verify} messages.
         * @function encode
         * @memberof ethapi.EthTxInput
         * @static
         * @param {ethapi.IEthTxInput} message EthTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthTxInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nonce != null && Object.hasOwnProperty.call(message, "nonce"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nonce);
            if (message.gasPrice != null && Object.hasOwnProperty.call(message, "gasPrice"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.gasPrice);
            if (message.gasLimit != null && Object.hasOwnProperty.call(message, "gasLimit"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.gasLimit);
            if (message.to != null && Object.hasOwnProperty.call(message, "to"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.to);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.value);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.data);
            if (message.chainId != null && Object.hasOwnProperty.call(message, "chainId"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.chainId);
            return writer;
        };

        /**
         * Encodes the specified EthTxInput message, length delimited. Does not implicitly {@link ethapi.EthTxInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ethapi.EthTxInput
         * @static
         * @param {ethapi.IEthTxInput} message EthTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthTxInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EthTxInput message from the specified reader or buffer.
         * @function decode
         * @memberof ethapi.EthTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ethapi.EthTxInput} EthTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthTxInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ethapi.EthTxInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nonce = reader.string();
                    break;
                case 2:
                    message.gasPrice = reader.string();
                    break;
                case 3:
                    message.gasLimit = reader.string();
                    break;
                case 4:
                    message.to = reader.string();
                    break;
                case 5:
                    message.value = reader.string();
                    break;
                case 6:
                    message.data = reader.string();
                    break;
                case 7:
                    message.chainId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EthTxInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ethapi.EthTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ethapi.EthTxInput} EthTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthTxInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EthTxInput message.
         * @function verify
         * @memberof ethapi.EthTxInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EthTxInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nonce != null && message.hasOwnProperty("nonce"))
                if (!$util.isString(message.nonce))
                    return "nonce: string expected";
            if (message.gasPrice != null && message.hasOwnProperty("gasPrice"))
                if (!$util.isString(message.gasPrice))
                    return "gasPrice: string expected";
            if (message.gasLimit != null && message.hasOwnProperty("gasLimit"))
                if (!$util.isString(message.gasLimit))
                    return "gasLimit: string expected";
            if (message.to != null && message.hasOwnProperty("to"))
                if (!$util.isString(message.to))
                    return "to: string expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                if (!$util.isString(message.chainId))
                    return "chainId: string expected";
            return null;
        };

        /**
         * Creates an EthTxInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ethapi.EthTxInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ethapi.EthTxInput} EthTxInput
         */
        EthTxInput.fromObject = function fromObject(object) {
            if (object instanceof $root.ethapi.EthTxInput)
                return object;
            var message = new $root.ethapi.EthTxInput();
            if (object.nonce != null)
                message.nonce = String(object.nonce);
            if (object.gasPrice != null)
                message.gasPrice = String(object.gasPrice);
            if (object.gasLimit != null)
                message.gasLimit = String(object.gasLimit);
            if (object.to != null)
                message.to = String(object.to);
            if (object.value != null)
                message.value = String(object.value);
            if (object.data != null)
                message.data = String(object.data);
            if (object.chainId != null)
                message.chainId = String(object.chainId);
            return message;
        };

        /**
         * Creates a plain object from an EthTxInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ethapi.EthTxInput
         * @static
         * @param {ethapi.EthTxInput} message EthTxInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EthTxInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nonce = "";
                object.gasPrice = "";
                object.gasLimit = "";
                object.to = "";
                object.value = "";
                object.data = "";
                object.chainId = "";
            }
            if (message.nonce != null && message.hasOwnProperty("nonce"))
                object.nonce = message.nonce;
            if (message.gasPrice != null && message.hasOwnProperty("gasPrice"))
                object.gasPrice = message.gasPrice;
            if (message.gasLimit != null && message.hasOwnProperty("gasLimit"))
                object.gasLimit = message.gasLimit;
            if (message.to != null && message.hasOwnProperty("to"))
                object.to = message.to;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            if (message.chainId != null && message.hasOwnProperty("chainId"))
                object.chainId = message.chainId;
            return object;
        };

        /**
         * Converts this EthTxInput to JSON.
         * @function toJSON
         * @memberof ethapi.EthTxInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EthTxInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EthTxInput;
    })();

    ethapi.EthTxOutput = (function() {

        /**
         * Properties of an EthTxOutput.
         * @memberof ethapi
         * @interface IEthTxOutput
         * @property {string|null} [signature] EthTxOutput signature
         * @property {string|null} [txHash] EthTxOutput txHash
         */

        /**
         * Constructs a new EthTxOutput.
         * @memberof ethapi
         * @classdesc Represents an EthTxOutput.
         * @implements IEthTxOutput
         * @constructor
         * @param {ethapi.IEthTxOutput=} [properties] Properties to set
         */
        function EthTxOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EthTxOutput signature.
         * @member {string} signature
         * @memberof ethapi.EthTxOutput
         * @instance
         */
        EthTxOutput.prototype.signature = "";

        /**
         * EthTxOutput txHash.
         * @member {string} txHash
         * @memberof ethapi.EthTxOutput
         * @instance
         */
        EthTxOutput.prototype.txHash = "";

        /**
         * Creates a new EthTxOutput instance using the specified properties.
         * @function create
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {ethapi.IEthTxOutput=} [properties] Properties to set
         * @returns {ethapi.EthTxOutput} EthTxOutput instance
         */
        EthTxOutput.create = function create(properties) {
            return new EthTxOutput(properties);
        };

        /**
         * Encodes the specified EthTxOutput message. Does not implicitly {@link ethapi.EthTxOutput.verify|verify} messages.
         * @function encode
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {ethapi.IEthTxOutput} message EthTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthTxOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            if (message.txHash != null && Object.hasOwnProperty.call(message, "txHash"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.txHash);
            return writer;
        };

        /**
         * Encodes the specified EthTxOutput message, length delimited. Does not implicitly {@link ethapi.EthTxOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {ethapi.IEthTxOutput} message EthTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthTxOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EthTxOutput message from the specified reader or buffer.
         * @function decode
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ethapi.EthTxOutput} EthTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthTxOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ethapi.EthTxOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                case 2:
                    message.txHash = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EthTxOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ethapi.EthTxOutput} EthTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthTxOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EthTxOutput message.
         * @function verify
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EthTxOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                if (!$util.isString(message.txHash))
                    return "txHash: string expected";
            return null;
        };

        /**
         * Creates an EthTxOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ethapi.EthTxOutput} EthTxOutput
         */
        EthTxOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.ethapi.EthTxOutput)
                return object;
            var message = new $root.ethapi.EthTxOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            if (object.txHash != null)
                message.txHash = String(object.txHash);
            return message;
        };

        /**
         * Creates a plain object from an EthTxOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ethapi.EthTxOutput
         * @static
         * @param {ethapi.EthTxOutput} message EthTxOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EthTxOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.signature = "";
                object.txHash = "";
            }
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            if (message.txHash != null && message.hasOwnProperty("txHash"))
                object.txHash = message.txHash;
            return object;
        };

        /**
         * Converts this EthTxOutput to JSON.
         * @function toJSON
         * @memberof ethapi.EthTxOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EthTxOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EthTxOutput;
    })();

    ethapi.EthMessageInput = (function() {

        /**
         * Properties of an EthMessageInput.
         * @memberof ethapi
         * @interface IEthMessageInput
         * @property {string|null} [message] EthMessageInput message
         * @property {boolean|null} [isPersonalSign] EthMessageInput isPersonalSign
         */

        /**
         * Constructs a new EthMessageInput.
         * @memberof ethapi
         * @classdesc Represents an EthMessageInput.
         * @implements IEthMessageInput
         * @constructor
         * @param {ethapi.IEthMessageInput=} [properties] Properties to set
         */
        function EthMessageInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EthMessageInput message.
         * @member {string} message
         * @memberof ethapi.EthMessageInput
         * @instance
         */
        EthMessageInput.prototype.message = "";

        /**
         * EthMessageInput isPersonalSign.
         * @member {boolean} isPersonalSign
         * @memberof ethapi.EthMessageInput
         * @instance
         */
        EthMessageInput.prototype.isPersonalSign = false;

        /**
         * Creates a new EthMessageInput instance using the specified properties.
         * @function create
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {ethapi.IEthMessageInput=} [properties] Properties to set
         * @returns {ethapi.EthMessageInput} EthMessageInput instance
         */
        EthMessageInput.create = function create(properties) {
            return new EthMessageInput(properties);
        };

        /**
         * Encodes the specified EthMessageInput message. Does not implicitly {@link ethapi.EthMessageInput.verify|verify} messages.
         * @function encode
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {ethapi.IEthMessageInput} message EthMessageInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthMessageInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            if (message.isPersonalSign != null && Object.hasOwnProperty.call(message, "isPersonalSign"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isPersonalSign);
            return writer;
        };

        /**
         * Encodes the specified EthMessageInput message, length delimited. Does not implicitly {@link ethapi.EthMessageInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {ethapi.IEthMessageInput} message EthMessageInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthMessageInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EthMessageInput message from the specified reader or buffer.
         * @function decode
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ethapi.EthMessageInput} EthMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthMessageInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ethapi.EthMessageInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.message = reader.string();
                    break;
                case 2:
                    message.isPersonalSign = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EthMessageInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ethapi.EthMessageInput} EthMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthMessageInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EthMessageInput message.
         * @function verify
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EthMessageInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.isPersonalSign != null && message.hasOwnProperty("isPersonalSign"))
                if (typeof message.isPersonalSign !== "boolean")
                    return "isPersonalSign: boolean expected";
            return null;
        };

        /**
         * Creates an EthMessageInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ethapi.EthMessageInput} EthMessageInput
         */
        EthMessageInput.fromObject = function fromObject(object) {
            if (object instanceof $root.ethapi.EthMessageInput)
                return object;
            var message = new $root.ethapi.EthMessageInput();
            if (object.message != null)
                message.message = String(object.message);
            if (object.isPersonalSign != null)
                message.isPersonalSign = Boolean(object.isPersonalSign);
            return message;
        };

        /**
         * Creates a plain object from an EthMessageInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ethapi.EthMessageInput
         * @static
         * @param {ethapi.EthMessageInput} message EthMessageInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EthMessageInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.message = "";
                object.isPersonalSign = false;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.isPersonalSign != null && message.hasOwnProperty("isPersonalSign"))
                object.isPersonalSign = message.isPersonalSign;
            return object;
        };

        /**
         * Converts this EthMessageInput to JSON.
         * @function toJSON
         * @memberof ethapi.EthMessageInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EthMessageInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EthMessageInput;
    })();

    ethapi.EthMessageOutput = (function() {

        /**
         * Properties of an EthMessageOutput.
         * @memberof ethapi
         * @interface IEthMessageOutput
         * @property {string|null} [signature] EthMessageOutput signature
         */

        /**
         * Constructs a new EthMessageOutput.
         * @memberof ethapi
         * @classdesc Represents an EthMessageOutput.
         * @implements IEthMessageOutput
         * @constructor
         * @param {ethapi.IEthMessageOutput=} [properties] Properties to set
         */
        function EthMessageOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EthMessageOutput signature.
         * @member {string} signature
         * @memberof ethapi.EthMessageOutput
         * @instance
         */
        EthMessageOutput.prototype.signature = "";

        /**
         * Creates a new EthMessageOutput instance using the specified properties.
         * @function create
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {ethapi.IEthMessageOutput=} [properties] Properties to set
         * @returns {ethapi.EthMessageOutput} EthMessageOutput instance
         */
        EthMessageOutput.create = function create(properties) {
            return new EthMessageOutput(properties);
        };

        /**
         * Encodes the specified EthMessageOutput message. Does not implicitly {@link ethapi.EthMessageOutput.verify|verify} messages.
         * @function encode
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {ethapi.IEthMessageOutput} message EthMessageOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthMessageOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            return writer;
        };

        /**
         * Encodes the specified EthMessageOutput message, length delimited. Does not implicitly {@link ethapi.EthMessageOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {ethapi.IEthMessageOutput} message EthMessageOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EthMessageOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EthMessageOutput message from the specified reader or buffer.
         * @function decode
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ethapi.EthMessageOutput} EthMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthMessageOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ethapi.EthMessageOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EthMessageOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ethapi.EthMessageOutput} EthMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EthMessageOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EthMessageOutput message.
         * @function verify
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EthMessageOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            return null;
        };

        /**
         * Creates an EthMessageOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ethapi.EthMessageOutput} EthMessageOutput
         */
        EthMessageOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.ethapi.EthMessageOutput)
                return object;
            var message = new $root.ethapi.EthMessageOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            return message;
        };

        /**
         * Creates a plain object from an EthMessageOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ethapi.EthMessageOutput
         * @static
         * @param {ethapi.EthMessageOutput} message EthMessageOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EthMessageOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.signature = "";
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            return object;
        };

        /**
         * Converts this EthMessageOutput to JSON.
         * @function toJSON
         * @memberof ethapi.EthMessageOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EthMessageOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EthMessageOutput;
    })();

    return ethapi;
})();

$root.filecoinapi = (function() {

    /**
     * Namespace filecoinapi.
     * @exports filecoinapi
     * @namespace
     */
    var filecoinapi = {};

    filecoinapi.FilecoinTxInput = (function() {

        /**
         * Properties of a FilecoinTxInput.
         * @memberof filecoinapi
         * @interface IFilecoinTxInput
         * @property {string|null} [to] FilecoinTxInput to
         * @property {string|null} [from] FilecoinTxInput from
         * @property {number|Long|null} [nonce] FilecoinTxInput nonce
         * @property {string|null} [value] FilecoinTxInput value
         * @property {number|Long|null} [gasLimit] FilecoinTxInput gasLimit
         * @property {string|null} [gasFeeCap] FilecoinTxInput gasFeeCap
         * @property {string|null} [gasPremium] FilecoinTxInput gasPremium
         * @property {number|Long|null} [method] FilecoinTxInput method
         * @property {string|null} [params] FilecoinTxInput params
         */

        /**
         * Constructs a new FilecoinTxInput.
         * @memberof filecoinapi
         * @classdesc Represents a FilecoinTxInput.
         * @implements IFilecoinTxInput
         * @constructor
         * @param {filecoinapi.IFilecoinTxInput=} [properties] Properties to set
         */
        function FilecoinTxInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FilecoinTxInput to.
         * @member {string} to
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.to = "";

        /**
         * FilecoinTxInput from.
         * @member {string} from
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.from = "";

        /**
         * FilecoinTxInput nonce.
         * @member {number|Long} nonce
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.nonce = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FilecoinTxInput value.
         * @member {string} value
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.value = "";

        /**
         * FilecoinTxInput gasLimit.
         * @member {number|Long} gasLimit
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.gasLimit = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * FilecoinTxInput gasFeeCap.
         * @member {string} gasFeeCap
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.gasFeeCap = "";

        /**
         * FilecoinTxInput gasPremium.
         * @member {string} gasPremium
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.gasPremium = "";

        /**
         * FilecoinTxInput method.
         * @member {number|Long} method
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.method = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FilecoinTxInput params.
         * @member {string} params
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         */
        FilecoinTxInput.prototype.params = "";

        /**
         * Creates a new FilecoinTxInput instance using the specified properties.
         * @function create
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {filecoinapi.IFilecoinTxInput=} [properties] Properties to set
         * @returns {filecoinapi.FilecoinTxInput} FilecoinTxInput instance
         */
        FilecoinTxInput.create = function create(properties) {
            return new FilecoinTxInput(properties);
        };

        /**
         * Encodes the specified FilecoinTxInput message. Does not implicitly {@link filecoinapi.FilecoinTxInput.verify|verify} messages.
         * @function encode
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {filecoinapi.IFilecoinTxInput} message FilecoinTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FilecoinTxInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.to != null && Object.hasOwnProperty.call(message, "to"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.to);
            if (message.from != null && Object.hasOwnProperty.call(message, "from"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.from);
            if (message.nonce != null && Object.hasOwnProperty.call(message, "nonce"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.nonce);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.value);
            if (message.gasLimit != null && Object.hasOwnProperty.call(message, "gasLimit"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.gasLimit);
            if (message.gasFeeCap != null && Object.hasOwnProperty.call(message, "gasFeeCap"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.gasFeeCap);
            if (message.gasPremium != null && Object.hasOwnProperty.call(message, "gasPremium"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.gasPremium);
            if (message.method != null && Object.hasOwnProperty.call(message, "method"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint64(message.method);
            if (message.params != null && Object.hasOwnProperty.call(message, "params"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.params);
            return writer;
        };

        /**
         * Encodes the specified FilecoinTxInput message, length delimited. Does not implicitly {@link filecoinapi.FilecoinTxInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {filecoinapi.IFilecoinTxInput} message FilecoinTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FilecoinTxInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FilecoinTxInput message from the specified reader or buffer.
         * @function decode
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {filecoinapi.FilecoinTxInput} FilecoinTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FilecoinTxInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.filecoinapi.FilecoinTxInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.to = reader.string();
                    break;
                case 2:
                    message.from = reader.string();
                    break;
                case 3:
                    message.nonce = reader.uint64();
                    break;
                case 4:
                    message.value = reader.string();
                    break;
                case 5:
                    message.gasLimit = reader.int64();
                    break;
                case 6:
                    message.gasFeeCap = reader.string();
                    break;
                case 7:
                    message.gasPremium = reader.string();
                    break;
                case 8:
                    message.method = reader.uint64();
                    break;
                case 9:
                    message.params = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FilecoinTxInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {filecoinapi.FilecoinTxInput} FilecoinTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FilecoinTxInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FilecoinTxInput message.
         * @function verify
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FilecoinTxInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.to != null && message.hasOwnProperty("to"))
                if (!$util.isString(message.to))
                    return "to: string expected";
            if (message.from != null && message.hasOwnProperty("from"))
                if (!$util.isString(message.from))
                    return "from: string expected";
            if (message.nonce != null && message.hasOwnProperty("nonce"))
                if (!$util.isInteger(message.nonce) && !(message.nonce && $util.isInteger(message.nonce.low) && $util.isInteger(message.nonce.high)))
                    return "nonce: integer|Long expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            if (message.gasLimit != null && message.hasOwnProperty("gasLimit"))
                if (!$util.isInteger(message.gasLimit) && !(message.gasLimit && $util.isInteger(message.gasLimit.low) && $util.isInteger(message.gasLimit.high)))
                    return "gasLimit: integer|Long expected";
            if (message.gasFeeCap != null && message.hasOwnProperty("gasFeeCap"))
                if (!$util.isString(message.gasFeeCap))
                    return "gasFeeCap: string expected";
            if (message.gasPremium != null && message.hasOwnProperty("gasPremium"))
                if (!$util.isString(message.gasPremium))
                    return "gasPremium: string expected";
            if (message.method != null && message.hasOwnProperty("method"))
                if (!$util.isInteger(message.method) && !(message.method && $util.isInteger(message.method.low) && $util.isInteger(message.method.high)))
                    return "method: integer|Long expected";
            if (message.params != null && message.hasOwnProperty("params"))
                if (!$util.isString(message.params))
                    return "params: string expected";
            return null;
        };

        /**
         * Creates a FilecoinTxInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {filecoinapi.FilecoinTxInput} FilecoinTxInput
         */
        FilecoinTxInput.fromObject = function fromObject(object) {
            if (object instanceof $root.filecoinapi.FilecoinTxInput)
                return object;
            var message = new $root.filecoinapi.FilecoinTxInput();
            if (object.to != null)
                message.to = String(object.to);
            if (object.from != null)
                message.from = String(object.from);
            if (object.nonce != null)
                if ($util.Long)
                    (message.nonce = $util.Long.fromValue(object.nonce)).unsigned = true;
                else if (typeof object.nonce === "string")
                    message.nonce = parseInt(object.nonce, 10);
                else if (typeof object.nonce === "number")
                    message.nonce = object.nonce;
                else if (typeof object.nonce === "object")
                    message.nonce = new $util.LongBits(object.nonce.low >>> 0, object.nonce.high >>> 0).toNumber(true);
            if (object.value != null)
                message.value = String(object.value);
            if (object.gasLimit != null)
                if ($util.Long)
                    (message.gasLimit = $util.Long.fromValue(object.gasLimit)).unsigned = false;
                else if (typeof object.gasLimit === "string")
                    message.gasLimit = parseInt(object.gasLimit, 10);
                else if (typeof object.gasLimit === "number")
                    message.gasLimit = object.gasLimit;
                else if (typeof object.gasLimit === "object")
                    message.gasLimit = new $util.LongBits(object.gasLimit.low >>> 0, object.gasLimit.high >>> 0).toNumber();
            if (object.gasFeeCap != null)
                message.gasFeeCap = String(object.gasFeeCap);
            if (object.gasPremium != null)
                message.gasPremium = String(object.gasPremium);
            if (object.method != null)
                if ($util.Long)
                    (message.method = $util.Long.fromValue(object.method)).unsigned = true;
                else if (typeof object.method === "string")
                    message.method = parseInt(object.method, 10);
                else if (typeof object.method === "number")
                    message.method = object.method;
                else if (typeof object.method === "object")
                    message.method = new $util.LongBits(object.method.low >>> 0, object.method.high >>> 0).toNumber(true);
            if (object.params != null)
                message.params = String(object.params);
            return message;
        };

        /**
         * Creates a plain object from a FilecoinTxInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof filecoinapi.FilecoinTxInput
         * @static
         * @param {filecoinapi.FilecoinTxInput} message FilecoinTxInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FilecoinTxInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.to = "";
                object.from = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.nonce = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.nonce = options.longs === String ? "0" : 0;
                object.value = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.gasLimit = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.gasLimit = options.longs === String ? "0" : 0;
                object.gasFeeCap = "";
                object.gasPremium = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.method = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.method = options.longs === String ? "0" : 0;
                object.params = "";
            }
            if (message.to != null && message.hasOwnProperty("to"))
                object.to = message.to;
            if (message.from != null && message.hasOwnProperty("from"))
                object.from = message.from;
            if (message.nonce != null && message.hasOwnProperty("nonce"))
                if (typeof message.nonce === "number")
                    object.nonce = options.longs === String ? String(message.nonce) : message.nonce;
                else
                    object.nonce = options.longs === String ? $util.Long.prototype.toString.call(message.nonce) : options.longs === Number ? new $util.LongBits(message.nonce.low >>> 0, message.nonce.high >>> 0).toNumber(true) : message.nonce;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            if (message.gasLimit != null && message.hasOwnProperty("gasLimit"))
                if (typeof message.gasLimit === "number")
                    object.gasLimit = options.longs === String ? String(message.gasLimit) : message.gasLimit;
                else
                    object.gasLimit = options.longs === String ? $util.Long.prototype.toString.call(message.gasLimit) : options.longs === Number ? new $util.LongBits(message.gasLimit.low >>> 0, message.gasLimit.high >>> 0).toNumber() : message.gasLimit;
            if (message.gasFeeCap != null && message.hasOwnProperty("gasFeeCap"))
                object.gasFeeCap = message.gasFeeCap;
            if (message.gasPremium != null && message.hasOwnProperty("gasPremium"))
                object.gasPremium = message.gasPremium;
            if (message.method != null && message.hasOwnProperty("method"))
                if (typeof message.method === "number")
                    object.method = options.longs === String ? String(message.method) : message.method;
                else
                    object.method = options.longs === String ? $util.Long.prototype.toString.call(message.method) : options.longs === Number ? new $util.LongBits(message.method.low >>> 0, message.method.high >>> 0).toNumber(true) : message.method;
            if (message.params != null && message.hasOwnProperty("params"))
                object.params = message.params;
            return object;
        };

        /**
         * Converts this FilecoinTxInput to JSON.
         * @function toJSON
         * @memberof filecoinapi.FilecoinTxInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FilecoinTxInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FilecoinTxInput;
    })();

    filecoinapi.FilecoinTxOutput = (function() {

        /**
         * Properties of a FilecoinTxOutput.
         * @memberof filecoinapi
         * @interface IFilecoinTxOutput
         * @property {string|null} [cid] FilecoinTxOutput cid
         * @property {filecoinapi.IFilecoinTxInput|null} [message] FilecoinTxOutput message
         * @property {filecoinapi.ISignature|null} [signature] FilecoinTxOutput signature
         */

        /**
         * Constructs a new FilecoinTxOutput.
         * @memberof filecoinapi
         * @classdesc Represents a FilecoinTxOutput.
         * @implements IFilecoinTxOutput
         * @constructor
         * @param {filecoinapi.IFilecoinTxOutput=} [properties] Properties to set
         */
        function FilecoinTxOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FilecoinTxOutput cid.
         * @member {string} cid
         * @memberof filecoinapi.FilecoinTxOutput
         * @instance
         */
        FilecoinTxOutput.prototype.cid = "";

        /**
         * FilecoinTxOutput message.
         * @member {filecoinapi.IFilecoinTxInput|null|undefined} message
         * @memberof filecoinapi.FilecoinTxOutput
         * @instance
         */
        FilecoinTxOutput.prototype.message = null;

        /**
         * FilecoinTxOutput signature.
         * @member {filecoinapi.ISignature|null|undefined} signature
         * @memberof filecoinapi.FilecoinTxOutput
         * @instance
         */
        FilecoinTxOutput.prototype.signature = null;

        /**
         * Creates a new FilecoinTxOutput instance using the specified properties.
         * @function create
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {filecoinapi.IFilecoinTxOutput=} [properties] Properties to set
         * @returns {filecoinapi.FilecoinTxOutput} FilecoinTxOutput instance
         */
        FilecoinTxOutput.create = function create(properties) {
            return new FilecoinTxOutput(properties);
        };

        /**
         * Encodes the specified FilecoinTxOutput message. Does not implicitly {@link filecoinapi.FilecoinTxOutput.verify|verify} messages.
         * @function encode
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {filecoinapi.IFilecoinTxOutput} message FilecoinTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FilecoinTxOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                $root.filecoinapi.FilecoinTxInput.encode(message.message, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                $root.filecoinapi.Signature.encode(message.signature, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FilecoinTxOutput message, length delimited. Does not implicitly {@link filecoinapi.FilecoinTxOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {filecoinapi.IFilecoinTxOutput} message FilecoinTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FilecoinTxOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FilecoinTxOutput message from the specified reader or buffer.
         * @function decode
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {filecoinapi.FilecoinTxOutput} FilecoinTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FilecoinTxOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.filecoinapi.FilecoinTxOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cid = reader.string();
                    break;
                case 2:
                    message.message = $root.filecoinapi.FilecoinTxInput.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.signature = $root.filecoinapi.Signature.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FilecoinTxOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {filecoinapi.FilecoinTxOutput} FilecoinTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FilecoinTxOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FilecoinTxOutput message.
         * @function verify
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FilecoinTxOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cid != null && message.hasOwnProperty("cid"))
                if (!$util.isString(message.cid))
                    return "cid: string expected";
            if (message.message != null && message.hasOwnProperty("message")) {
                var error = $root.filecoinapi.FilecoinTxInput.verify(message.message);
                if (error)
                    return "message." + error;
            }
            if (message.signature != null && message.hasOwnProperty("signature")) {
                var error = $root.filecoinapi.Signature.verify(message.signature);
                if (error)
                    return "signature." + error;
            }
            return null;
        };

        /**
         * Creates a FilecoinTxOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {filecoinapi.FilecoinTxOutput} FilecoinTxOutput
         */
        FilecoinTxOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.filecoinapi.FilecoinTxOutput)
                return object;
            var message = new $root.filecoinapi.FilecoinTxOutput();
            if (object.cid != null)
                message.cid = String(object.cid);
            if (object.message != null) {
                if (typeof object.message !== "object")
                    throw TypeError(".filecoinapi.FilecoinTxOutput.message: object expected");
                message.message = $root.filecoinapi.FilecoinTxInput.fromObject(object.message);
            }
            if (object.signature != null) {
                if (typeof object.signature !== "object")
                    throw TypeError(".filecoinapi.FilecoinTxOutput.signature: object expected");
                message.signature = $root.filecoinapi.Signature.fromObject(object.signature);
            }
            return message;
        };

        /**
         * Creates a plain object from a FilecoinTxOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof filecoinapi.FilecoinTxOutput
         * @static
         * @param {filecoinapi.FilecoinTxOutput} message FilecoinTxOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FilecoinTxOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cid = "";
                object.message = null;
                object.signature = null;
            }
            if (message.cid != null && message.hasOwnProperty("cid"))
                object.cid = message.cid;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = $root.filecoinapi.FilecoinTxInput.toObject(message.message, options);
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = $root.filecoinapi.Signature.toObject(message.signature, options);
            return object;
        };

        /**
         * Converts this FilecoinTxOutput to JSON.
         * @function toJSON
         * @memberof filecoinapi.FilecoinTxOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FilecoinTxOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FilecoinTxOutput;
    })();

    filecoinapi.Signature = (function() {

        /**
         * Properties of a Signature.
         * @memberof filecoinapi
         * @interface ISignature
         * @property {number|null} [type] Signature type
         * @property {string|null} [data] Signature data
         */

        /**
         * Constructs a new Signature.
         * @memberof filecoinapi
         * @classdesc Represents a Signature.
         * @implements ISignature
         * @constructor
         * @param {filecoinapi.ISignature=} [properties] Properties to set
         */
        function Signature(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Signature type.
         * @member {number} type
         * @memberof filecoinapi.Signature
         * @instance
         */
        Signature.prototype.type = 0;

        /**
         * Signature data.
         * @member {string} data
         * @memberof filecoinapi.Signature
         * @instance
         */
        Signature.prototype.data = "";

        /**
         * Creates a new Signature instance using the specified properties.
         * @function create
         * @memberof filecoinapi.Signature
         * @static
         * @param {filecoinapi.ISignature=} [properties] Properties to set
         * @returns {filecoinapi.Signature} Signature instance
         */
        Signature.create = function create(properties) {
            return new Signature(properties);
        };

        /**
         * Encodes the specified Signature message. Does not implicitly {@link filecoinapi.Signature.verify|verify} messages.
         * @function encode
         * @memberof filecoinapi.Signature
         * @static
         * @param {filecoinapi.ISignature} message Signature message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Signature.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.type);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.data);
            return writer;
        };

        /**
         * Encodes the specified Signature message, length delimited. Does not implicitly {@link filecoinapi.Signature.verify|verify} messages.
         * @function encodeDelimited
         * @memberof filecoinapi.Signature
         * @static
         * @param {filecoinapi.ISignature} message Signature message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Signature.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Signature message from the specified reader or buffer.
         * @function decode
         * @memberof filecoinapi.Signature
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {filecoinapi.Signature} Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Signature.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.filecoinapi.Signature();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.uint32();
                    break;
                case 2:
                    message.data = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Signature message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof filecoinapi.Signature
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {filecoinapi.Signature} Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Signature.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Signature message.
         * @function verify
         * @memberof filecoinapi.Signature
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Signature.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            return null;
        };

        /**
         * Creates a Signature message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof filecoinapi.Signature
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {filecoinapi.Signature} Signature
         */
        Signature.fromObject = function fromObject(object) {
            if (object instanceof $root.filecoinapi.Signature)
                return object;
            var message = new $root.filecoinapi.Signature();
            if (object.type != null)
                message.type = object.type >>> 0;
            if (object.data != null)
                message.data = String(object.data);
            return message;
        };

        /**
         * Creates a plain object from a Signature message. Also converts values to other types if specified.
         * @function toObject
         * @memberof filecoinapi.Signature
         * @static
         * @param {filecoinapi.Signature} message Signature
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Signature.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = 0;
                object.data = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            return object;
        };

        /**
         * Converts this Signature to JSON.
         * @function toJSON
         * @memberof filecoinapi.Signature
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Signature.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Signature;
    })();

    return filecoinapi;
})();

$root.substrateapi = (function() {

    /**
     * Namespace substrateapi.
     * @exports substrateapi
     * @namespace
     */
    var substrateapi = {};

    substrateapi.SubstrateRawTxIn = (function() {

        /**
         * Properties of a SubstrateRawTxIn.
         * @memberof substrateapi
         * @interface ISubstrateRawTxIn
         * @property {string|null} [rawData] SubstrateRawTxIn rawData
         */

        /**
         * Constructs a new SubstrateRawTxIn.
         * @memberof substrateapi
         * @classdesc Represents a SubstrateRawTxIn.
         * @implements ISubstrateRawTxIn
         * @constructor
         * @param {substrateapi.ISubstrateRawTxIn=} [properties] Properties to set
         */
        function SubstrateRawTxIn(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SubstrateRawTxIn rawData.
         * @member {string} rawData
         * @memberof substrateapi.SubstrateRawTxIn
         * @instance
         */
        SubstrateRawTxIn.prototype.rawData = "";

        /**
         * Creates a new SubstrateRawTxIn instance using the specified properties.
         * @function create
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {substrateapi.ISubstrateRawTxIn=} [properties] Properties to set
         * @returns {substrateapi.SubstrateRawTxIn} SubstrateRawTxIn instance
         */
        SubstrateRawTxIn.create = function create(properties) {
            return new SubstrateRawTxIn(properties);
        };

        /**
         * Encodes the specified SubstrateRawTxIn message. Does not implicitly {@link substrateapi.SubstrateRawTxIn.verify|verify} messages.
         * @function encode
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {substrateapi.ISubstrateRawTxIn} message SubstrateRawTxIn message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubstrateRawTxIn.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rawData != null && Object.hasOwnProperty.call(message, "rawData"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.rawData);
            return writer;
        };

        /**
         * Encodes the specified SubstrateRawTxIn message, length delimited. Does not implicitly {@link substrateapi.SubstrateRawTxIn.verify|verify} messages.
         * @function encodeDelimited
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {substrateapi.ISubstrateRawTxIn} message SubstrateRawTxIn message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubstrateRawTxIn.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SubstrateRawTxIn message from the specified reader or buffer.
         * @function decode
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {substrateapi.SubstrateRawTxIn} SubstrateRawTxIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubstrateRawTxIn.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.substrateapi.SubstrateRawTxIn();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.rawData = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SubstrateRawTxIn message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {substrateapi.SubstrateRawTxIn} SubstrateRawTxIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubstrateRawTxIn.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SubstrateRawTxIn message.
         * @function verify
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubstrateRawTxIn.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rawData != null && message.hasOwnProperty("rawData"))
                if (!$util.isString(message.rawData))
                    return "rawData: string expected";
            return null;
        };

        /**
         * Creates a SubstrateRawTxIn message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {substrateapi.SubstrateRawTxIn} SubstrateRawTxIn
         */
        SubstrateRawTxIn.fromObject = function fromObject(object) {
            if (object instanceof $root.substrateapi.SubstrateRawTxIn)
                return object;
            var message = new $root.substrateapi.SubstrateRawTxIn();
            if (object.rawData != null)
                message.rawData = String(object.rawData);
            return message;
        };

        /**
         * Creates a plain object from a SubstrateRawTxIn message. Also converts values to other types if specified.
         * @function toObject
         * @memberof substrateapi.SubstrateRawTxIn
         * @static
         * @param {substrateapi.SubstrateRawTxIn} message SubstrateRawTxIn
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubstrateRawTxIn.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.rawData = "";
            if (message.rawData != null && message.hasOwnProperty("rawData"))
                object.rawData = message.rawData;
            return object;
        };

        /**
         * Converts this SubstrateRawTxIn to JSON.
         * @function toJSON
         * @memberof substrateapi.SubstrateRawTxIn
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubstrateRawTxIn.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SubstrateRawTxIn;
    })();

    substrateapi.SubstrateTxOut = (function() {

        /**
         * Properties of a SubstrateTxOut.
         * @memberof substrateapi
         * @interface ISubstrateTxOut
         * @property {string|null} [signature] SubstrateTxOut signature
         */

        /**
         * Constructs a new SubstrateTxOut.
         * @memberof substrateapi
         * @classdesc Represents a SubstrateTxOut.
         * @implements ISubstrateTxOut
         * @constructor
         * @param {substrateapi.ISubstrateTxOut=} [properties] Properties to set
         */
        function SubstrateTxOut(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SubstrateTxOut signature.
         * @member {string} signature
         * @memberof substrateapi.SubstrateTxOut
         * @instance
         */
        SubstrateTxOut.prototype.signature = "";

        /**
         * Creates a new SubstrateTxOut instance using the specified properties.
         * @function create
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {substrateapi.ISubstrateTxOut=} [properties] Properties to set
         * @returns {substrateapi.SubstrateTxOut} SubstrateTxOut instance
         */
        SubstrateTxOut.create = function create(properties) {
            return new SubstrateTxOut(properties);
        };

        /**
         * Encodes the specified SubstrateTxOut message. Does not implicitly {@link substrateapi.SubstrateTxOut.verify|verify} messages.
         * @function encode
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {substrateapi.ISubstrateTxOut} message SubstrateTxOut message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubstrateTxOut.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            return writer;
        };

        /**
         * Encodes the specified SubstrateTxOut message, length delimited. Does not implicitly {@link substrateapi.SubstrateTxOut.verify|verify} messages.
         * @function encodeDelimited
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {substrateapi.ISubstrateTxOut} message SubstrateTxOut message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SubstrateTxOut.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SubstrateTxOut message from the specified reader or buffer.
         * @function decode
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {substrateapi.SubstrateTxOut} SubstrateTxOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubstrateTxOut.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.substrateapi.SubstrateTxOut();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SubstrateTxOut message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {substrateapi.SubstrateTxOut} SubstrateTxOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SubstrateTxOut.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SubstrateTxOut message.
         * @function verify
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SubstrateTxOut.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            return null;
        };

        /**
         * Creates a SubstrateTxOut message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {substrateapi.SubstrateTxOut} SubstrateTxOut
         */
        SubstrateTxOut.fromObject = function fromObject(object) {
            if (object instanceof $root.substrateapi.SubstrateTxOut)
                return object;
            var message = new $root.substrateapi.SubstrateTxOut();
            if (object.signature != null)
                message.signature = String(object.signature);
            return message;
        };

        /**
         * Creates a plain object from a SubstrateTxOut message. Also converts values to other types if specified.
         * @function toObject
         * @memberof substrateapi.SubstrateTxOut
         * @static
         * @param {substrateapi.SubstrateTxOut} message SubstrateTxOut
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SubstrateTxOut.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.signature = "";
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            return object;
        };

        /**
         * Converts this SubstrateTxOut to JSON.
         * @function toJSON
         * @memberof substrateapi.SubstrateTxOut
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SubstrateTxOut.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SubstrateTxOut;
    })();

    return substrateapi;
})();

$root.tronapi = (function() {

    /**
     * Namespace tronapi.
     * @exports tronapi
     * @namespace
     */
    var tronapi = {};

    tronapi.TronTxInput = (function() {

        /**
         * Properties of a TronTxInput.
         * @memberof tronapi
         * @interface ITronTxInput
         * @property {string|null} [rawData] TronTxInput rawData
         */

        /**
         * Constructs a new TronTxInput.
         * @memberof tronapi
         * @classdesc Represents a TronTxInput.
         * @implements ITronTxInput
         * @constructor
         * @param {tronapi.ITronTxInput=} [properties] Properties to set
         */
        function TronTxInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TronTxInput rawData.
         * @member {string} rawData
         * @memberof tronapi.TronTxInput
         * @instance
         */
        TronTxInput.prototype.rawData = "";

        /**
         * Creates a new TronTxInput instance using the specified properties.
         * @function create
         * @memberof tronapi.TronTxInput
         * @static
         * @param {tronapi.ITronTxInput=} [properties] Properties to set
         * @returns {tronapi.TronTxInput} TronTxInput instance
         */
        TronTxInput.create = function create(properties) {
            return new TronTxInput(properties);
        };

        /**
         * Encodes the specified TronTxInput message. Does not implicitly {@link tronapi.TronTxInput.verify|verify} messages.
         * @function encode
         * @memberof tronapi.TronTxInput
         * @static
         * @param {tronapi.ITronTxInput} message TronTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronTxInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rawData != null && Object.hasOwnProperty.call(message, "rawData"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.rawData);
            return writer;
        };

        /**
         * Encodes the specified TronTxInput message, length delimited. Does not implicitly {@link tronapi.TronTxInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tronapi.TronTxInput
         * @static
         * @param {tronapi.ITronTxInput} message TronTxInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronTxInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TronTxInput message from the specified reader or buffer.
         * @function decode
         * @memberof tronapi.TronTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tronapi.TronTxInput} TronTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronTxInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tronapi.TronTxInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.rawData = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TronTxInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tronapi.TronTxInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tronapi.TronTxInput} TronTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronTxInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TronTxInput message.
         * @function verify
         * @memberof tronapi.TronTxInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TronTxInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rawData != null && message.hasOwnProperty("rawData"))
                if (!$util.isString(message.rawData))
                    return "rawData: string expected";
            return null;
        };

        /**
         * Creates a TronTxInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tronapi.TronTxInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tronapi.TronTxInput} TronTxInput
         */
        TronTxInput.fromObject = function fromObject(object) {
            if (object instanceof $root.tronapi.TronTxInput)
                return object;
            var message = new $root.tronapi.TronTxInput();
            if (object.rawData != null)
                message.rawData = String(object.rawData);
            return message;
        };

        /**
         * Creates a plain object from a TronTxInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tronapi.TronTxInput
         * @static
         * @param {tronapi.TronTxInput} message TronTxInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TronTxInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.rawData = "";
            if (message.rawData != null && message.hasOwnProperty("rawData"))
                object.rawData = message.rawData;
            return object;
        };

        /**
         * Converts this TronTxInput to JSON.
         * @function toJSON
         * @memberof tronapi.TronTxInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TronTxInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TronTxInput;
    })();

    tronapi.TronTxOutput = (function() {

        /**
         * Properties of a TronTxOutput.
         * @memberof tronapi
         * @interface ITronTxOutput
         * @property {string|null} [signature] TronTxOutput signature
         */

        /**
         * Constructs a new TronTxOutput.
         * @memberof tronapi
         * @classdesc Represents a TronTxOutput.
         * @implements ITronTxOutput
         * @constructor
         * @param {tronapi.ITronTxOutput=} [properties] Properties to set
         */
        function TronTxOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TronTxOutput signature.
         * @member {string} signature
         * @memberof tronapi.TronTxOutput
         * @instance
         */
        TronTxOutput.prototype.signature = "";

        /**
         * Creates a new TronTxOutput instance using the specified properties.
         * @function create
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {tronapi.ITronTxOutput=} [properties] Properties to set
         * @returns {tronapi.TronTxOutput} TronTxOutput instance
         */
        TronTxOutput.create = function create(properties) {
            return new TronTxOutput(properties);
        };

        /**
         * Encodes the specified TronTxOutput message. Does not implicitly {@link tronapi.TronTxOutput.verify|verify} messages.
         * @function encode
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {tronapi.ITronTxOutput} message TronTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronTxOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            return writer;
        };

        /**
         * Encodes the specified TronTxOutput message, length delimited. Does not implicitly {@link tronapi.TronTxOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {tronapi.ITronTxOutput} message TronTxOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronTxOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TronTxOutput message from the specified reader or buffer.
         * @function decode
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tronapi.TronTxOutput} TronTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronTxOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tronapi.TronTxOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TronTxOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tronapi.TronTxOutput} TronTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronTxOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TronTxOutput message.
         * @function verify
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TronTxOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            return null;
        };

        /**
         * Creates a TronTxOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tronapi.TronTxOutput} TronTxOutput
         */
        TronTxOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.tronapi.TronTxOutput)
                return object;
            var message = new $root.tronapi.TronTxOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            return message;
        };

        /**
         * Creates a plain object from a TronTxOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tronapi.TronTxOutput
         * @static
         * @param {tronapi.TronTxOutput} message TronTxOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TronTxOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.signature = "";
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            return object;
        };

        /**
         * Converts this TronTxOutput to JSON.
         * @function toJSON
         * @memberof tronapi.TronTxOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TronTxOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TronTxOutput;
    })();

    tronapi.TronMessageInput = (function() {

        /**
         * Properties of a TronMessageInput.
         * @memberof tronapi
         * @interface ITronMessageInput
         * @property {string|null} [message] TronMessageInput message
         * @property {boolean|null} [isHex] TronMessageInput isHex
         * @property {boolean|null} [isTronHeader] TronMessageInput isTronHeader
         */

        /**
         * Constructs a new TronMessageInput.
         * @memberof tronapi
         * @classdesc Represents a TronMessageInput.
         * @implements ITronMessageInput
         * @constructor
         * @param {tronapi.ITronMessageInput=} [properties] Properties to set
         */
        function TronMessageInput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TronMessageInput message.
         * @member {string} message
         * @memberof tronapi.TronMessageInput
         * @instance
         */
        TronMessageInput.prototype.message = "";

        /**
         * TronMessageInput isHex.
         * @member {boolean} isHex
         * @memberof tronapi.TronMessageInput
         * @instance
         */
        TronMessageInput.prototype.isHex = false;

        /**
         * TronMessageInput isTronHeader.
         * @member {boolean} isTronHeader
         * @memberof tronapi.TronMessageInput
         * @instance
         */
        TronMessageInput.prototype.isTronHeader = false;

        /**
         * Creates a new TronMessageInput instance using the specified properties.
         * @function create
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {tronapi.ITronMessageInput=} [properties] Properties to set
         * @returns {tronapi.TronMessageInput} TronMessageInput instance
         */
        TronMessageInput.create = function create(properties) {
            return new TronMessageInput(properties);
        };

        /**
         * Encodes the specified TronMessageInput message. Does not implicitly {@link tronapi.TronMessageInput.verify|verify} messages.
         * @function encode
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {tronapi.ITronMessageInput} message TronMessageInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronMessageInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.isHex != null && Object.hasOwnProperty.call(message, "isHex"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isHex);
            if (message.isTronHeader != null && Object.hasOwnProperty.call(message, "isTronHeader"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.isTronHeader);
            return writer;
        };

        /**
         * Encodes the specified TronMessageInput message, length delimited. Does not implicitly {@link tronapi.TronMessageInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {tronapi.ITronMessageInput} message TronMessageInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronMessageInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TronMessageInput message from the specified reader or buffer.
         * @function decode
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tronapi.TronMessageInput} TronMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronMessageInput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tronapi.TronMessageInput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.message = reader.string();
                    break;
                case 4:
                    message.isHex = reader.bool();
                    break;
                case 5:
                    message.isTronHeader = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TronMessageInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tronapi.TronMessageInput} TronMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronMessageInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TronMessageInput message.
         * @function verify
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TronMessageInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.isHex != null && message.hasOwnProperty("isHex"))
                if (typeof message.isHex !== "boolean")
                    return "isHex: boolean expected";
            if (message.isTronHeader != null && message.hasOwnProperty("isTronHeader"))
                if (typeof message.isTronHeader !== "boolean")
                    return "isTronHeader: boolean expected";
            return null;
        };

        /**
         * Creates a TronMessageInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tronapi.TronMessageInput} TronMessageInput
         */
        TronMessageInput.fromObject = function fromObject(object) {
            if (object instanceof $root.tronapi.TronMessageInput)
                return object;
            var message = new $root.tronapi.TronMessageInput();
            if (object.message != null)
                message.message = String(object.message);
            if (object.isHex != null)
                message.isHex = Boolean(object.isHex);
            if (object.isTronHeader != null)
                message.isTronHeader = Boolean(object.isTronHeader);
            return message;
        };

        /**
         * Creates a plain object from a TronMessageInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tronapi.TronMessageInput
         * @static
         * @param {tronapi.TronMessageInput} message TronMessageInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TronMessageInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.message = "";
                object.isHex = false;
                object.isTronHeader = false;
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.isHex != null && message.hasOwnProperty("isHex"))
                object.isHex = message.isHex;
            if (message.isTronHeader != null && message.hasOwnProperty("isTronHeader"))
                object.isTronHeader = message.isTronHeader;
            return object;
        };

        /**
         * Converts this TronMessageInput to JSON.
         * @function toJSON
         * @memberof tronapi.TronMessageInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TronMessageInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TronMessageInput;
    })();

    tronapi.TronMessageOutput = (function() {

        /**
         * Properties of a TronMessageOutput.
         * @memberof tronapi
         * @interface ITronMessageOutput
         * @property {string|null} [signature] TronMessageOutput signature
         */

        /**
         * Constructs a new TronMessageOutput.
         * @memberof tronapi
         * @classdesc Represents a TronMessageOutput.
         * @implements ITronMessageOutput
         * @constructor
         * @param {tronapi.ITronMessageOutput=} [properties] Properties to set
         */
        function TronMessageOutput(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TronMessageOutput signature.
         * @member {string} signature
         * @memberof tronapi.TronMessageOutput
         * @instance
         */
        TronMessageOutput.prototype.signature = "";

        /**
         * Creates a new TronMessageOutput instance using the specified properties.
         * @function create
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {tronapi.ITronMessageOutput=} [properties] Properties to set
         * @returns {tronapi.TronMessageOutput} TronMessageOutput instance
         */
        TronMessageOutput.create = function create(properties) {
            return new TronMessageOutput(properties);
        };

        /**
         * Encodes the specified TronMessageOutput message. Does not implicitly {@link tronapi.TronMessageOutput.verify|verify} messages.
         * @function encode
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {tronapi.ITronMessageOutput} message TronMessageOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronMessageOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
            return writer;
        };

        /**
         * Encodes the specified TronMessageOutput message, length delimited. Does not implicitly {@link tronapi.TronMessageOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {tronapi.ITronMessageOutput} message TronMessageOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TronMessageOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TronMessageOutput message from the specified reader or buffer.
         * @function decode
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tronapi.TronMessageOutput} TronMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronMessageOutput.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.tronapi.TronMessageOutput();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TronMessageOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tronapi.TronMessageOutput} TronMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TronMessageOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TronMessageOutput message.
         * @function verify
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TronMessageOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!$util.isString(message.signature))
                    return "signature: string expected";
            return null;
        };

        /**
         * Creates a TronMessageOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tronapi.TronMessageOutput} TronMessageOutput
         */
        TronMessageOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.tronapi.TronMessageOutput)
                return object;
            var message = new $root.tronapi.TronMessageOutput();
            if (object.signature != null)
                message.signature = String(object.signature);
            return message;
        };

        /**
         * Creates a plain object from a TronMessageOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tronapi.TronMessageOutput
         * @static
         * @param {tronapi.TronMessageOutput} message TronMessageOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TronMessageOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.signature = "";
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = message.signature;
            return object;
        };

        /**
         * Converts this TronMessageOutput to JSON.
         * @function toJSON
         * @memberof tronapi.TronMessageOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TronMessageOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TronMessageOutput;
    })();

    return tronapi;
})();

module.exports = $root;
