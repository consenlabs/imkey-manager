import * as $protobuf from "protobufjs";
/** Namespace api. */
export namespace api {

    /** Properties of an ImkeyAction. */
    interface IImkeyAction {

        /** ImkeyAction method */
        method?: (string|null);

        /** ImkeyAction param */
        param?: (google.protobuf.IAny|null);
    }

    /** Represents an ImkeyAction. */
    class ImkeyAction implements IImkeyAction {

        /**
         * Constructs a new ImkeyAction.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IImkeyAction);

        /** ImkeyAction method. */
        public method: string;

        /** ImkeyAction param. */
        public param?: (google.protobuf.IAny|null);

        /**
         * Creates a new ImkeyAction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ImkeyAction instance
         */
        public static create(properties?: api.IImkeyAction): api.ImkeyAction;

        /**
         * Encodes the specified ImkeyAction message. Does not implicitly {@link api.ImkeyAction.verify|verify} messages.
         * @param message ImkeyAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IImkeyAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ImkeyAction message, length delimited. Does not implicitly {@link api.ImkeyAction.verify|verify} messages.
         * @param message ImkeyAction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IImkeyAction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ImkeyAction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ImkeyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.ImkeyAction;

        /**
         * Decodes an ImkeyAction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ImkeyAction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.ImkeyAction;

        /**
         * Verifies an ImkeyAction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ImkeyAction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ImkeyAction
         */
        public static fromObject(object: { [k: string]: any }): api.ImkeyAction;

        /**
         * Creates a plain object from an ImkeyAction message. Also converts values to other types if specified.
         * @param message ImkeyAction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.ImkeyAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ImkeyAction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ErrorResponse. */
    interface IErrorResponse {

        /** ErrorResponse isSuccess */
        isSuccess?: (boolean|null);

        /** ErrorResponse error */
        error?: (string|null);
    }

    /** Represents an ErrorResponse. */
    class ErrorResponse implements IErrorResponse {

        /**
         * Constructs a new ErrorResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IErrorResponse);

        /** ErrorResponse isSuccess. */
        public isSuccess: boolean;

        /** ErrorResponse error. */
        public error: string;

        /**
         * Creates a new ErrorResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ErrorResponse instance
         */
        public static create(properties?: api.IErrorResponse): api.ErrorResponse;

        /**
         * Encodes the specified ErrorResponse message. Does not implicitly {@link api.ErrorResponse.verify|verify} messages.
         * @param message ErrorResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IErrorResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ErrorResponse message, length delimited. Does not implicitly {@link api.ErrorResponse.verify|verify} messages.
         * @param message ErrorResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IErrorResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.ErrorResponse;

        /**
         * Decodes an ErrorResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ErrorResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.ErrorResponse;

        /**
         * Verifies an ErrorResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ErrorResponse
         */
        public static fromObject(object: { [k: string]: any }): api.ErrorResponse;

        /**
         * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
         * @param message ErrorResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.ErrorResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ErrorResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CommonResponse. */
    interface ICommonResponse {

        /** CommonResponse result */
        result?: (string|null);
    }

    /** Represents a CommonResponse. */
    class CommonResponse implements ICommonResponse {

        /**
         * Constructs a new CommonResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.ICommonResponse);

        /** CommonResponse result. */
        public result: string;

        /**
         * Creates a new CommonResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommonResponse instance
         */
        public static create(properties?: api.ICommonResponse): api.CommonResponse;

        /**
         * Encodes the specified CommonResponse message. Does not implicitly {@link api.CommonResponse.verify|verify} messages.
         * @param message CommonResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.ICommonResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommonResponse message, length delimited. Does not implicitly {@link api.CommonResponse.verify|verify} messages.
         * @param message CommonResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.ICommonResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommonResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.CommonResponse;

        /**
         * Decodes a CommonResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommonResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.CommonResponse;

        /**
         * Verifies a CommonResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommonResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommonResponse
         */
        public static fromObject(object: { [k: string]: any }): api.CommonResponse;

        /**
         * Creates a plain object from a CommonResponse message. Also converts values to other types if specified.
         * @param message CommonResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.CommonResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommonResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddressParam. */
    interface IAddressParam {

        /** AddressParam chainType */
        chainType?: (string|null);

        /** AddressParam path */
        path?: (string|null);

        /** AddressParam network */
        network?: (string|null);

        /** AddressParam isSegWit */
        isSegWit?: (boolean|null);
    }

    /** Represents an AddressParam. */
    class AddressParam implements IAddressParam {

        /**
         * Constructs a new AddressParam.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IAddressParam);

        /** AddressParam chainType. */
        public chainType: string;

        /** AddressParam path. */
        public path: string;

        /** AddressParam network. */
        public network: string;

        /** AddressParam isSegWit. */
        public isSegWit: boolean;

        /**
         * Creates a new AddressParam instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddressParam instance
         */
        public static create(properties?: api.IAddressParam): api.AddressParam;

        /**
         * Encodes the specified AddressParam message. Does not implicitly {@link api.AddressParam.verify|verify} messages.
         * @param message AddressParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IAddressParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddressParam message, length delimited. Does not implicitly {@link api.AddressParam.verify|verify} messages.
         * @param message AddressParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IAddressParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddressParam message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.AddressParam;

        /**
         * Decodes an AddressParam message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.AddressParam;

        /**
         * Verifies an AddressParam message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddressParam message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddressParam
         */
        public static fromObject(object: { [k: string]: any }): api.AddressParam;

        /**
         * Creates a plain object from an AddressParam message. Also converts values to other types if specified.
         * @param message AddressParam
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.AddressParam, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddressParam to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddressResult. */
    interface IAddressResult {

        /** AddressResult path */
        path?: (string|null);

        /** AddressResult chainType */
        chainType?: (string|null);

        /** AddressResult address */
        address?: (string|null);
    }

    /** Represents an AddressResult. */
    class AddressResult implements IAddressResult {

        /**
         * Constructs a new AddressResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IAddressResult);

        /** AddressResult path. */
        public path: string;

        /** AddressResult chainType. */
        public chainType: string;

        /** AddressResult address. */
        public address: string;

        /**
         * Creates a new AddressResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddressResult instance
         */
        public static create(properties?: api.IAddressResult): api.AddressResult;

        /**
         * Encodes the specified AddressResult message. Does not implicitly {@link api.AddressResult.verify|verify} messages.
         * @param message AddressResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IAddressResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddressResult message, length delimited. Does not implicitly {@link api.AddressResult.verify|verify} messages.
         * @param message AddressResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IAddressResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddressResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddressResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.AddressResult;

        /**
         * Decodes an AddressResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddressResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.AddressResult;

        /**
         * Verifies an AddressResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddressResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddressResult
         */
        public static fromObject(object: { [k: string]: any }): api.AddressResult;

        /**
         * Creates a plain object from an AddressResult message. Also converts values to other types if specified.
         * @param message AddressResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.AddressResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddressResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PubKeyParam. */
    interface IPubKeyParam {

        /** PubKeyParam chainType */
        chainType?: (string|null);

        /** PubKeyParam path */
        path?: (string|null);

        /** PubKeyParam network */
        network?: (string|null);

        /** PubKeyParam isSegWit */
        isSegWit?: (string|null);
    }

    /** Represents a PubKeyParam. */
    class PubKeyParam implements IPubKeyParam {

        /**
         * Constructs a new PubKeyParam.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IPubKeyParam);

        /** PubKeyParam chainType. */
        public chainType: string;

        /** PubKeyParam path. */
        public path: string;

        /** PubKeyParam network. */
        public network: string;

        /** PubKeyParam isSegWit. */
        public isSegWit: string;

        /**
         * Creates a new PubKeyParam instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PubKeyParam instance
         */
        public static create(properties?: api.IPubKeyParam): api.PubKeyParam;

        /**
         * Encodes the specified PubKeyParam message. Does not implicitly {@link api.PubKeyParam.verify|verify} messages.
         * @param message PubKeyParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IPubKeyParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PubKeyParam message, length delimited. Does not implicitly {@link api.PubKeyParam.verify|verify} messages.
         * @param message PubKeyParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IPubKeyParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PubKeyParam message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PubKeyParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.PubKeyParam;

        /**
         * Decodes a PubKeyParam message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PubKeyParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.PubKeyParam;

        /**
         * Verifies a PubKeyParam message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PubKeyParam message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PubKeyParam
         */
        public static fromObject(object: { [k: string]: any }): api.PubKeyParam;

        /**
         * Creates a plain object from a PubKeyParam message. Also converts values to other types if specified.
         * @param message PubKeyParam
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.PubKeyParam, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PubKeyParam to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PubKeyResult. */
    interface IPubKeyResult {

        /** PubKeyResult path */
        path?: (string|null);

        /** PubKeyResult chainType */
        chainType?: (string|null);

        /** PubKeyResult pubKey */
        pubKey?: (string|null);

        /** PubKeyResult derivedMode */
        derivedMode?: (string|null);
    }

    /** Represents a PubKeyResult. */
    class PubKeyResult implements IPubKeyResult {

        /**
         * Constructs a new PubKeyResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IPubKeyResult);

        /** PubKeyResult path. */
        public path: string;

        /** PubKeyResult chainType. */
        public chainType: string;

        /** PubKeyResult pubKey. */
        public pubKey: string;

        /** PubKeyResult derivedMode. */
        public derivedMode: string;

        /**
         * Creates a new PubKeyResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PubKeyResult instance
         */
        public static create(properties?: api.IPubKeyResult): api.PubKeyResult;

        /**
         * Encodes the specified PubKeyResult message. Does not implicitly {@link api.PubKeyResult.verify|verify} messages.
         * @param message PubKeyResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IPubKeyResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PubKeyResult message, length delimited. Does not implicitly {@link api.PubKeyResult.verify|verify} messages.
         * @param message PubKeyResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IPubKeyResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PubKeyResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PubKeyResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.PubKeyResult;

        /**
         * Decodes a PubKeyResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PubKeyResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.PubKeyResult;

        /**
         * Verifies a PubKeyResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PubKeyResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PubKeyResult
         */
        public static fromObject(object: { [k: string]: any }): api.PubKeyResult;

        /**
         * Creates a plain object from a PubKeyResult message. Also converts values to other types if specified.
         * @param message PubKeyResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.PubKeyResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PubKeyResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ExternalAddress. */
    interface IExternalAddress {

        /** ExternalAddress address */
        address?: (string|null);

        /** ExternalAddress derivedPath */
        derivedPath?: (string|null);

        /** ExternalAddress type */
        type?: (string|null);
    }

    /** Represents an ExternalAddress. */
    class ExternalAddress implements IExternalAddress {

        /**
         * Constructs a new ExternalAddress.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IExternalAddress);

        /** ExternalAddress address. */
        public address: string;

        /** ExternalAddress derivedPath. */
        public derivedPath: string;

        /** ExternalAddress type. */
        public type: string;

        /**
         * Creates a new ExternalAddress instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExternalAddress instance
         */
        public static create(properties?: api.IExternalAddress): api.ExternalAddress;

        /**
         * Encodes the specified ExternalAddress message. Does not implicitly {@link api.ExternalAddress.verify|verify} messages.
         * @param message ExternalAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IExternalAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExternalAddress message, length delimited. Does not implicitly {@link api.ExternalAddress.verify|verify} messages.
         * @param message ExternalAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IExternalAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExternalAddress message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExternalAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.ExternalAddress;

        /**
         * Decodes an ExternalAddress message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExternalAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.ExternalAddress;

        /**
         * Verifies an ExternalAddress message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExternalAddress message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExternalAddress
         */
        public static fromObject(object: { [k: string]: any }): api.ExternalAddress;

        /**
         * Creates a plain object from an ExternalAddress message. Also converts values to other types if specified.
         * @param message ExternalAddress
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.ExternalAddress, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExternalAddress to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BitcoinWallet. */
    interface IBitcoinWallet {

        /** BitcoinWallet path */
        path?: (string|null);

        /** BitcoinWallet chainType */
        chainType?: (string|null);

        /** BitcoinWallet address */
        address?: (string|null);

        /** BitcoinWallet encXPub */
        encXPub?: (string|null);

        /** BitcoinWallet externalAddress */
        externalAddress?: (api.IExternalAddress|null);
    }

    /** Represents a BitcoinWallet. */
    class BitcoinWallet implements IBitcoinWallet {

        /**
         * Constructs a new BitcoinWallet.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IBitcoinWallet);

        /** BitcoinWallet path. */
        public path: string;

        /** BitcoinWallet chainType. */
        public chainType: string;

        /** BitcoinWallet address. */
        public address: string;

        /** BitcoinWallet encXPub. */
        public encXPub: string;

        /** BitcoinWallet externalAddress. */
        public externalAddress?: (api.IExternalAddress|null);

        /**
         * Creates a new BitcoinWallet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BitcoinWallet instance
         */
        public static create(properties?: api.IBitcoinWallet): api.BitcoinWallet;

        /**
         * Encodes the specified BitcoinWallet message. Does not implicitly {@link api.BitcoinWallet.verify|verify} messages.
         * @param message BitcoinWallet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IBitcoinWallet, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BitcoinWallet message, length delimited. Does not implicitly {@link api.BitcoinWallet.verify|verify} messages.
         * @param message BitcoinWallet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IBitcoinWallet, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BitcoinWallet message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BitcoinWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.BitcoinWallet;

        /**
         * Decodes a BitcoinWallet message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BitcoinWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.BitcoinWallet;

        /**
         * Verifies a BitcoinWallet message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BitcoinWallet message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BitcoinWallet
         */
        public static fromObject(object: { [k: string]: any }): api.BitcoinWallet;

        /**
         * Creates a plain object from a BitcoinWallet message. Also converts values to other types if specified.
         * @param message BitcoinWallet
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.BitcoinWallet, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BitcoinWallet to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EosWallet. */
    interface IEosWallet {

        /** EosWallet chainType */
        chainType?: (string|null);

        /** EosWallet address */
        address?: (string|null);

        /** EosWallet publicKeys */
        publicKeys?: (api.EosWallet.IPubKeyInfo[]|null);
    }

    /** Represents an EosWallet. */
    class EosWallet implements IEosWallet {

        /**
         * Constructs a new EosWallet.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IEosWallet);

        /** EosWallet chainType. */
        public chainType: string;

        /** EosWallet address. */
        public address: string;

        /** EosWallet publicKeys. */
        public publicKeys: api.EosWallet.IPubKeyInfo[];

        /**
         * Creates a new EosWallet instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosWallet instance
         */
        public static create(properties?: api.IEosWallet): api.EosWallet;

        /**
         * Encodes the specified EosWallet message. Does not implicitly {@link api.EosWallet.verify|verify} messages.
         * @param message EosWallet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IEosWallet, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosWallet message, length delimited. Does not implicitly {@link api.EosWallet.verify|verify} messages.
         * @param message EosWallet message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IEosWallet, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosWallet message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.EosWallet;

        /**
         * Decodes an EosWallet message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosWallet
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.EosWallet;

        /**
         * Verifies an EosWallet message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosWallet message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosWallet
         */
        public static fromObject(object: { [k: string]: any }): api.EosWallet;

        /**
         * Creates a plain object from an EosWallet message. Also converts values to other types if specified.
         * @param message EosWallet
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.EosWallet, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosWallet to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace EosWallet {

        /** Properties of a PubKeyInfo. */
        interface IPubKeyInfo {

            /** PubKeyInfo path */
            path?: (string|null);

            /** PubKeyInfo derivedMode */
            derivedMode?: (string|null);

            /** PubKeyInfo publicKey */
            publicKey?: (string|null);
        }

        /** Represents a PubKeyInfo. */
        class PubKeyInfo implements IPubKeyInfo {

            /**
             * Constructs a new PubKeyInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: api.EosWallet.IPubKeyInfo);

            /** PubKeyInfo path. */
            public path: string;

            /** PubKeyInfo derivedMode. */
            public derivedMode: string;

            /** PubKeyInfo publicKey. */
            public publicKey: string;

            /**
             * Creates a new PubKeyInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PubKeyInfo instance
             */
            public static create(properties?: api.EosWallet.IPubKeyInfo): api.EosWallet.PubKeyInfo;

            /**
             * Encodes the specified PubKeyInfo message. Does not implicitly {@link api.EosWallet.PubKeyInfo.verify|verify} messages.
             * @param message PubKeyInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: api.EosWallet.IPubKeyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PubKeyInfo message, length delimited. Does not implicitly {@link api.EosWallet.PubKeyInfo.verify|verify} messages.
             * @param message PubKeyInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: api.EosWallet.IPubKeyInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PubKeyInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PubKeyInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.EosWallet.PubKeyInfo;

            /**
             * Decodes a PubKeyInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PubKeyInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.EosWallet.PubKeyInfo;

            /**
             * Verifies a PubKeyInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PubKeyInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PubKeyInfo
             */
            public static fromObject(object: { [k: string]: any }): api.EosWallet.PubKeyInfo;

            /**
             * Creates a plain object from a PubKeyInfo message. Also converts values to other types if specified.
             * @param message PubKeyInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: api.EosWallet.PubKeyInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PubKeyInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of an ExternalAddressParam. */
    interface IExternalAddressParam {

        /** ExternalAddressParam path */
        path?: (string|null);

        /** ExternalAddressParam chainType */
        chainType?: (string|null);

        /** ExternalAddressParam network */
        network?: (string|null);

        /** ExternalAddressParam segWit */
        segWit?: (string|null);

        /** ExternalAddressParam externalIdx */
        externalIdx?: (number|null);
    }

    /** Represents an ExternalAddressParam. */
    class ExternalAddressParam implements IExternalAddressParam {

        /**
         * Constructs a new ExternalAddressParam.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IExternalAddressParam);

        /** ExternalAddressParam path. */
        public path: string;

        /** ExternalAddressParam chainType. */
        public chainType: string;

        /** ExternalAddressParam network. */
        public network: string;

        /** ExternalAddressParam segWit. */
        public segWit: string;

        /** ExternalAddressParam externalIdx. */
        public externalIdx: number;

        /**
         * Creates a new ExternalAddressParam instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExternalAddressParam instance
         */
        public static create(properties?: api.IExternalAddressParam): api.ExternalAddressParam;

        /**
         * Encodes the specified ExternalAddressParam message. Does not implicitly {@link api.ExternalAddressParam.verify|verify} messages.
         * @param message ExternalAddressParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IExternalAddressParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExternalAddressParam message, length delimited. Does not implicitly {@link api.ExternalAddressParam.verify|verify} messages.
         * @param message ExternalAddressParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IExternalAddressParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExternalAddressParam message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExternalAddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.ExternalAddressParam;

        /**
         * Decodes an ExternalAddressParam message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExternalAddressParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.ExternalAddressParam;

        /**
         * Verifies an ExternalAddressParam message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExternalAddressParam message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExternalAddressParam
         */
        public static fromObject(object: { [k: string]: any }): api.ExternalAddressParam;

        /**
         * Creates a plain object from an ExternalAddressParam message. Also converts values to other types if specified.
         * @param message ExternalAddressParam
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.ExternalAddressParam, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExternalAddressParam to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InitImKeyCoreXParam. */
    interface IInitImKeyCoreXParam {

        /** InitImKeyCoreXParam fileDir */
        fileDir?: (string|null);

        /** InitImKeyCoreXParam xpubCommonKey */
        xpubCommonKey?: (string|null);

        /** InitImKeyCoreXParam xpubCommonIv */
        xpubCommonIv?: (string|null);

        /** InitImKeyCoreXParam isDebug */
        isDebug?: (boolean|null);
    }

    /** Represents an InitImKeyCoreXParam. */
    class InitImKeyCoreXParam implements IInitImKeyCoreXParam {

        /**
         * Constructs a new InitImKeyCoreXParam.
         * @param [properties] Properties to set
         */
        constructor(properties?: api.IInitImKeyCoreXParam);

        /** InitImKeyCoreXParam fileDir. */
        public fileDir: string;

        /** InitImKeyCoreXParam xpubCommonKey. */
        public xpubCommonKey: string;

        /** InitImKeyCoreXParam xpubCommonIv. */
        public xpubCommonIv: string;

        /** InitImKeyCoreXParam isDebug. */
        public isDebug: boolean;

        /**
         * Creates a new InitImKeyCoreXParam instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InitImKeyCoreXParam instance
         */
        public static create(properties?: api.IInitImKeyCoreXParam): api.InitImKeyCoreXParam;

        /**
         * Encodes the specified InitImKeyCoreXParam message. Does not implicitly {@link api.InitImKeyCoreXParam.verify|verify} messages.
         * @param message InitImKeyCoreXParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: api.IInitImKeyCoreXParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InitImKeyCoreXParam message, length delimited. Does not implicitly {@link api.InitImKeyCoreXParam.verify|verify} messages.
         * @param message InitImKeyCoreXParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: api.IInitImKeyCoreXParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InitImKeyCoreXParam message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InitImKeyCoreXParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): api.InitImKeyCoreXParam;

        /**
         * Decodes an InitImKeyCoreXParam message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InitImKeyCoreXParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): api.InitImKeyCoreXParam;

        /**
         * Verifies an InitImKeyCoreXParam message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InitImKeyCoreXParam message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InitImKeyCoreXParam
         */
        public static fromObject(object: { [k: string]: any }): api.InitImKeyCoreXParam;

        /**
         * Creates a plain object from an InitImKeyCoreXParam message. Also converts values to other types if specified.
         * @param message InitImKeyCoreXParam
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: api.InitImKeyCoreXParam, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InitImKeyCoreXParam to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}

/** Namespace btcapi. */
export namespace btcapi {

    /** Properties of an Utxo. */
    interface IUtxo {

        /** Utxo txHash */
        txHash?: (string|null);

        /** Utxo vout */
        vout?: (number|null);

        /** Utxo amount */
        amount?: (number|Long|null);

        /** Utxo address */
        address?: (string|null);

        /** Utxo scriptPubKey */
        scriptPubKey?: (string|null);

        /** Utxo derivedPath */
        derivedPath?: (string|null);

        /** Utxo sequence */
        sequence?: (number|Long|null);
    }

    /** Represents an Utxo. */
    class Utxo implements IUtxo {

        /**
         * Constructs a new Utxo.
         * @param [properties] Properties to set
         */
        constructor(properties?: btcapi.IUtxo);

        /** Utxo txHash. */
        public txHash: string;

        /** Utxo vout. */
        public vout: number;

        /** Utxo amount. */
        public amount: (number|Long);

        /** Utxo address. */
        public address: string;

        /** Utxo scriptPubKey. */
        public scriptPubKey: string;

        /** Utxo derivedPath. */
        public derivedPath: string;

        /** Utxo sequence. */
        public sequence: (number|Long);

        /**
         * Creates a new Utxo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Utxo instance
         */
        public static create(properties?: btcapi.IUtxo): btcapi.Utxo;

        /**
         * Encodes the specified Utxo message. Does not implicitly {@link btcapi.Utxo.verify|verify} messages.
         * @param message Utxo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: btcapi.IUtxo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Utxo message, length delimited. Does not implicitly {@link btcapi.Utxo.verify|verify} messages.
         * @param message Utxo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: btcapi.IUtxo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Utxo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Utxo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): btcapi.Utxo;

        /**
         * Decodes an Utxo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Utxo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): btcapi.Utxo;

        /**
         * Verifies an Utxo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Utxo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Utxo
         */
        public static fromObject(object: { [k: string]: any }): btcapi.Utxo;

        /**
         * Creates a plain object from an Utxo message. Also converts values to other types if specified.
         * @param message Utxo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: btcapi.Utxo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Utxo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BtcTxExtra. */
    interface IBtcTxExtra {

        /** BtcTxExtra opReturn */
        opReturn?: (string|null);

        /** BtcTxExtra propertyId */
        propertyId?: (number|null);

        /** BtcTxExtra feeMode */
        feeMode?: (string|null);
    }

    /** Represents a BtcTxExtra. */
    class BtcTxExtra implements IBtcTxExtra {

        /**
         * Constructs a new BtcTxExtra.
         * @param [properties] Properties to set
         */
        constructor(properties?: btcapi.IBtcTxExtra);

        /** BtcTxExtra opReturn. */
        public opReturn: string;

        /** BtcTxExtra propertyId. */
        public propertyId: number;

        /** BtcTxExtra feeMode. */
        public feeMode: string;

        /**
         * Creates a new BtcTxExtra instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BtcTxExtra instance
         */
        public static create(properties?: btcapi.IBtcTxExtra): btcapi.BtcTxExtra;

        /**
         * Encodes the specified BtcTxExtra message. Does not implicitly {@link btcapi.BtcTxExtra.verify|verify} messages.
         * @param message BtcTxExtra message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: btcapi.IBtcTxExtra, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BtcTxExtra message, length delimited. Does not implicitly {@link btcapi.BtcTxExtra.verify|verify} messages.
         * @param message BtcTxExtra message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: btcapi.IBtcTxExtra, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BtcTxExtra message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BtcTxExtra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): btcapi.BtcTxExtra;

        /**
         * Decodes a BtcTxExtra message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BtcTxExtra
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): btcapi.BtcTxExtra;

        /**
         * Verifies a BtcTxExtra message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BtcTxExtra message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BtcTxExtra
         */
        public static fromObject(object: { [k: string]: any }): btcapi.BtcTxExtra;

        /**
         * Creates a plain object from a BtcTxExtra message. Also converts values to other types if specified.
         * @param message BtcTxExtra
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: btcapi.BtcTxExtra, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BtcTxExtra to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BtcTxInput. */
    interface IBtcTxInput {

        /** BtcTxInput to */
        to?: (string|null);

        /** BtcTxInput amount */
        amount?: (number|Long|null);

        /** BtcTxInput fee */
        fee?: (number|Long|null);

        /** BtcTxInput changeAddressIndex */
        changeAddressIndex?: (number|null);

        /** BtcTxInput unspents */
        unspents?: (btcapi.IUtxo[]|null);

        /** BtcTxInput segWit */
        segWit?: (string|null);

        /** BtcTxInput protocol */
        protocol?: (string|null);

        /** BtcTxInput extra */
        extra?: (btcapi.IBtcTxExtra|null);
    }

    /** Represents a BtcTxInput. */
    class BtcTxInput implements IBtcTxInput {

        /**
         * Constructs a new BtcTxInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: btcapi.IBtcTxInput);

        /** BtcTxInput to. */
        public to: string;

        /** BtcTxInput amount. */
        public amount: (number|Long);

        /** BtcTxInput fee. */
        public fee: (number|Long);

        /** BtcTxInput changeAddressIndex. */
        public changeAddressIndex: number;

        /** BtcTxInput unspents. */
        public unspents: btcapi.IUtxo[];

        /** BtcTxInput segWit. */
        public segWit: string;

        /** BtcTxInput protocol. */
        public protocol: string;

        /** BtcTxInput extra. */
        public extra?: (btcapi.IBtcTxExtra|null);

        /**
         * Creates a new BtcTxInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BtcTxInput instance
         */
        public static create(properties?: btcapi.IBtcTxInput): btcapi.BtcTxInput;

        /**
         * Encodes the specified BtcTxInput message. Does not implicitly {@link btcapi.BtcTxInput.verify|verify} messages.
         * @param message BtcTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: btcapi.IBtcTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BtcTxInput message, length delimited. Does not implicitly {@link btcapi.BtcTxInput.verify|verify} messages.
         * @param message BtcTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: btcapi.IBtcTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BtcTxInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BtcTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): btcapi.BtcTxInput;

        /**
         * Decodes a BtcTxInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BtcTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): btcapi.BtcTxInput;

        /**
         * Verifies a BtcTxInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BtcTxInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BtcTxInput
         */
        public static fromObject(object: { [k: string]: any }): btcapi.BtcTxInput;

        /**
         * Creates a plain object from a BtcTxInput message. Also converts values to other types if specified.
         * @param message BtcTxInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: btcapi.BtcTxInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BtcTxInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BtcTxOutput. */
    interface IBtcTxOutput {

        /** BtcTxOutput signature */
        signature?: (string|null);

        /** BtcTxOutput txHash */
        txHash?: (string|null);

        /** BtcTxOutput wtxHash */
        wtxHash?: (string|null);
    }

    /** Represents a BtcTxOutput. */
    class BtcTxOutput implements IBtcTxOutput {

        /**
         * Constructs a new BtcTxOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: btcapi.IBtcTxOutput);

        /** BtcTxOutput signature. */
        public signature: string;

        /** BtcTxOutput txHash. */
        public txHash: string;

        /** BtcTxOutput wtxHash. */
        public wtxHash: string;

        /**
         * Creates a new BtcTxOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BtcTxOutput instance
         */
        public static create(properties?: btcapi.IBtcTxOutput): btcapi.BtcTxOutput;

        /**
         * Encodes the specified BtcTxOutput message. Does not implicitly {@link btcapi.BtcTxOutput.verify|verify} messages.
         * @param message BtcTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: btcapi.IBtcTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BtcTxOutput message, length delimited. Does not implicitly {@link btcapi.BtcTxOutput.verify|verify} messages.
         * @param message BtcTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: btcapi.IBtcTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BtcTxOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BtcTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): btcapi.BtcTxOutput;

        /**
         * Decodes a BtcTxOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BtcTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): btcapi.BtcTxOutput;

        /**
         * Verifies a BtcTxOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BtcTxOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BtcTxOutput
         */
        public static fromObject(object: { [k: string]: any }): btcapi.BtcTxOutput;

        /**
         * Creates a plain object from a BtcTxOutput message. Also converts values to other types if specified.
         * @param message BtcTxOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: btcapi.BtcTxOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BtcTxOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BtcXpubReq. */
    interface IBtcXpubReq {

        /** BtcXpubReq network */
        network?: (string|null);

        /** BtcXpubReq path */
        path?: (string|null);
    }

    /** Represents a BtcXpubReq. */
    class BtcXpubReq implements IBtcXpubReq {

        /**
         * Constructs a new BtcXpubReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: btcapi.IBtcXpubReq);

        /** BtcXpubReq network. */
        public network: string;

        /** BtcXpubReq path. */
        public path: string;

        /**
         * Creates a new BtcXpubReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BtcXpubReq instance
         */
        public static create(properties?: btcapi.IBtcXpubReq): btcapi.BtcXpubReq;

        /**
         * Encodes the specified BtcXpubReq message. Does not implicitly {@link btcapi.BtcXpubReq.verify|verify} messages.
         * @param message BtcXpubReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: btcapi.IBtcXpubReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BtcXpubReq message, length delimited. Does not implicitly {@link btcapi.BtcXpubReq.verify|verify} messages.
         * @param message BtcXpubReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: btcapi.IBtcXpubReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BtcXpubReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BtcXpubReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): btcapi.BtcXpubReq;

        /**
         * Decodes a BtcXpubReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BtcXpubReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): btcapi.BtcXpubReq;

        /**
         * Verifies a BtcXpubReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BtcXpubReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BtcXpubReq
         */
        public static fromObject(object: { [k: string]: any }): btcapi.BtcXpubReq;

        /**
         * Creates a plain object from a BtcXpubReq message. Also converts values to other types if specified.
         * @param message BtcXpubReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: btcapi.BtcXpubReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BtcXpubReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BtcXpubRes. */
    interface IBtcXpubRes {

        /** BtcXpubRes xpub */
        xpub?: (string|null);
    }

    /** Represents a BtcXpubRes. */
    class BtcXpubRes implements IBtcXpubRes {

        /**
         * Constructs a new BtcXpubRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: btcapi.IBtcXpubRes);

        /** BtcXpubRes xpub. */
        public xpub: string;

        /**
         * Creates a new BtcXpubRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BtcXpubRes instance
         */
        public static create(properties?: btcapi.IBtcXpubRes): btcapi.BtcXpubRes;

        /**
         * Encodes the specified BtcXpubRes message. Does not implicitly {@link btcapi.BtcXpubRes.verify|verify} messages.
         * @param message BtcXpubRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: btcapi.IBtcXpubRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BtcXpubRes message, length delimited. Does not implicitly {@link btcapi.BtcXpubRes.verify|verify} messages.
         * @param message BtcXpubRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: btcapi.IBtcXpubRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BtcXpubRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BtcXpubRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): btcapi.BtcXpubRes;

        /**
         * Decodes a BtcXpubRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BtcXpubRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): btcapi.BtcXpubRes;

        /**
         * Verifies a BtcXpubRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BtcXpubRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BtcXpubRes
         */
        public static fromObject(object: { [k: string]: any }): btcapi.BtcXpubRes;

        /**
         * Creates a plain object from a BtcXpubRes message. Also converts values to other types if specified.
         * @param message BtcXpubRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: btcapi.BtcXpubRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BtcXpubRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace common. */
export namespace common {

    /** Properties of a SignParam. */
    interface ISignParam {

        /** SignParam chainType */
        chainType?: (string|null);

        /** SignParam path */
        path?: (string|null);

        /** SignParam network */
        network?: (string|null);

        /** SignParam input */
        input?: (google.protobuf.IAny|null);

        /** SignParam payment */
        payment?: (string|null);

        /** SignParam receiver */
        receiver?: (string|null);

        /** SignParam sender */
        sender?: (string|null);

        /** SignParam fee */
        fee?: (string|null);
    }

    /** Represents a SignParam. */
    class SignParam implements ISignParam {

        /**
         * Constructs a new SignParam.
         * @param [properties] Properties to set
         */
        constructor(properties?: common.ISignParam);

        /** SignParam chainType. */
        public chainType: string;

        /** SignParam path. */
        public path: string;

        /** SignParam network. */
        public network: string;

        /** SignParam input. */
        public input?: (google.protobuf.IAny|null);

        /** SignParam payment. */
        public payment: string;

        /** SignParam receiver. */
        public receiver: string;

        /** SignParam sender. */
        public sender: string;

        /** SignParam fee. */
        public fee: string;

        /**
         * Creates a new SignParam instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SignParam instance
         */
        public static create(properties?: common.ISignParam): common.SignParam;

        /**
         * Encodes the specified SignParam message. Does not implicitly {@link common.SignParam.verify|verify} messages.
         * @param message SignParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: common.ISignParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SignParam message, length delimited. Does not implicitly {@link common.SignParam.verify|verify} messages.
         * @param message SignParam message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: common.ISignParam, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SignParam message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SignParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): common.SignParam;

        /**
         * Decodes a SignParam message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SignParam
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): common.SignParam;

        /**
         * Verifies a SignParam message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SignParam message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SignParam
         */
        public static fromObject(object: { [k: string]: any }): common.SignParam;

        /**
         * Creates a plain object from a SignParam message. Also converts values to other types if specified.
         * @param message SignParam
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: common.SignParam, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SignParam to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace cosmosapi. */
export namespace cosmosapi {

    /** Properties of a Coin. */
    interface ICoin {

        /** Coin amount */
        amount?: (string|null);

        /** Coin denom */
        denom?: (string|null);
    }

    /** Represents a Coin. */
    class Coin implements ICoin {

        /**
         * Constructs a new Coin.
         * @param [properties] Properties to set
         */
        constructor(properties?: cosmosapi.ICoin);

        /** Coin amount. */
        public amount: string;

        /** Coin denom. */
        public denom: string;

        /**
         * Creates a new Coin instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Coin instance
         */
        public static create(properties?: cosmosapi.ICoin): cosmosapi.Coin;

        /**
         * Encodes the specified Coin message. Does not implicitly {@link cosmosapi.Coin.verify|verify} messages.
         * @param message Coin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cosmosapi.ICoin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Coin message, length delimited. Does not implicitly {@link cosmosapi.Coin.verify|verify} messages.
         * @param message Coin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cosmosapi.ICoin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Coin message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Coin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cosmosapi.Coin;

        /**
         * Decodes a Coin message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Coin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cosmosapi.Coin;

        /**
         * Verifies a Coin message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Coin message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Coin
         */
        public static fromObject(object: { [k: string]: any }): cosmosapi.Coin;

        /**
         * Creates a plain object from a Coin message. Also converts values to other types if specified.
         * @param message Coin
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cosmosapi.Coin, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Coin to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StdFee. */
    interface IStdFee {

        /** StdFee amount */
        amount?: (cosmosapi.ICoin[]|null);

        /** StdFee gas */
        gas?: (string|null);
    }

    /** Represents a StdFee. */
    class StdFee implements IStdFee {

        /**
         * Constructs a new StdFee.
         * @param [properties] Properties to set
         */
        constructor(properties?: cosmosapi.IStdFee);

        /** StdFee amount. */
        public amount: cosmosapi.ICoin[];

        /** StdFee gas. */
        public gas: string;

        /**
         * Creates a new StdFee instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StdFee instance
         */
        public static create(properties?: cosmosapi.IStdFee): cosmosapi.StdFee;

        /**
         * Encodes the specified StdFee message. Does not implicitly {@link cosmosapi.StdFee.verify|verify} messages.
         * @param message StdFee message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cosmosapi.IStdFee, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StdFee message, length delimited. Does not implicitly {@link cosmosapi.StdFee.verify|verify} messages.
         * @param message StdFee message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cosmosapi.IStdFee, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StdFee message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StdFee
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cosmosapi.StdFee;

        /**
         * Decodes a StdFee message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StdFee
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cosmosapi.StdFee;

        /**
         * Verifies a StdFee message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StdFee message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StdFee
         */
        public static fromObject(object: { [k: string]: any }): cosmosapi.StdFee;

        /**
         * Creates a plain object from a StdFee message. Also converts values to other types if specified.
         * @param message StdFee
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cosmosapi.StdFee, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StdFee to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CosmosTxInput. */
    interface ICosmosTxInput {

        /** CosmosTxInput accountNumber */
        accountNumber?: (string|null);

        /** CosmosTxInput chainId */
        chainId?: (string|null);

        /** CosmosTxInput fee */
        fee?: (cosmosapi.IStdFee|null);

        /** CosmosTxInput memo */
        memo?: (string|null);

        /** CosmosTxInput msgs */
        msgs?: (string|null);

        /** CosmosTxInput sequence */
        sequence?: (string|null);
    }

    /** Represents a CosmosTxInput. */
    class CosmosTxInput implements ICosmosTxInput {

        /**
         * Constructs a new CosmosTxInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: cosmosapi.ICosmosTxInput);

        /** CosmosTxInput accountNumber. */
        public accountNumber: string;

        /** CosmosTxInput chainId. */
        public chainId: string;

        /** CosmosTxInput fee. */
        public fee?: (cosmosapi.IStdFee|null);

        /** CosmosTxInput memo. */
        public memo: string;

        /** CosmosTxInput msgs. */
        public msgs: string;

        /** CosmosTxInput sequence. */
        public sequence: string;

        /**
         * Creates a new CosmosTxInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CosmosTxInput instance
         */
        public static create(properties?: cosmosapi.ICosmosTxInput): cosmosapi.CosmosTxInput;

        /**
         * Encodes the specified CosmosTxInput message. Does not implicitly {@link cosmosapi.CosmosTxInput.verify|verify} messages.
         * @param message CosmosTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cosmosapi.ICosmosTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CosmosTxInput message, length delimited. Does not implicitly {@link cosmosapi.CosmosTxInput.verify|verify} messages.
         * @param message CosmosTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cosmosapi.ICosmosTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CosmosTxInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CosmosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cosmosapi.CosmosTxInput;

        /**
         * Decodes a CosmosTxInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CosmosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cosmosapi.CosmosTxInput;

        /**
         * Verifies a CosmosTxInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CosmosTxInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CosmosTxInput
         */
        public static fromObject(object: { [k: string]: any }): cosmosapi.CosmosTxInput;

        /**
         * Creates a plain object from a CosmosTxInput message. Also converts values to other types if specified.
         * @param message CosmosTxInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cosmosapi.CosmosTxInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CosmosTxInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CosmosTxOutput. */
    interface ICosmosTxOutput {

        /** CosmosTxOutput signature */
        signature?: (string|null);

        /** CosmosTxOutput txHash */
        txHash?: (string|null);
    }

    /** Represents a CosmosTxOutput. */
    class CosmosTxOutput implements ICosmosTxOutput {

        /**
         * Constructs a new CosmosTxOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: cosmosapi.ICosmosTxOutput);

        /** CosmosTxOutput signature. */
        public signature: string;

        /** CosmosTxOutput txHash. */
        public txHash: string;

        /**
         * Creates a new CosmosTxOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CosmosTxOutput instance
         */
        public static create(properties?: cosmosapi.ICosmosTxOutput): cosmosapi.CosmosTxOutput;

        /**
         * Encodes the specified CosmosTxOutput message. Does not implicitly {@link cosmosapi.CosmosTxOutput.verify|verify} messages.
         * @param message CosmosTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: cosmosapi.ICosmosTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CosmosTxOutput message, length delimited. Does not implicitly {@link cosmosapi.CosmosTxOutput.verify|verify} messages.
         * @param message CosmosTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: cosmosapi.ICosmosTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CosmosTxOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CosmosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cosmosapi.CosmosTxOutput;

        /**
         * Decodes a CosmosTxOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CosmosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cosmosapi.CosmosTxOutput;

        /**
         * Verifies a CosmosTxOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CosmosTxOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CosmosTxOutput
         */
        public static fromObject(object: { [k: string]: any }): cosmosapi.CosmosTxOutput;

        /**
         * Creates a plain object from a CosmosTxOutput message. Also converts values to other types if specified.
         * @param message CosmosTxOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: cosmosapi.CosmosTxOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CosmosTxOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace deviceapi. */
export namespace deviceapi {

    /** Properties of an AppDownloadReq. */
    interface IAppDownloadReq {

        /** AppDownloadReq appName */
        appName?: (string|null);
    }

    /** Represents an AppDownloadReq. */
    class AppDownloadReq implements IAppDownloadReq {

        /**
         * Constructs a new AppDownloadReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IAppDownloadReq);

        /** AppDownloadReq appName. */
        public appName: string;

        /**
         * Creates a new AppDownloadReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppDownloadReq instance
         */
        public static create(properties?: deviceapi.IAppDownloadReq): deviceapi.AppDownloadReq;

        /**
         * Encodes the specified AppDownloadReq message. Does not implicitly {@link deviceapi.AppDownloadReq.verify|verify} messages.
         * @param message AppDownloadReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IAppDownloadReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppDownloadReq message, length delimited. Does not implicitly {@link deviceapi.AppDownloadReq.verify|verify} messages.
         * @param message AppDownloadReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IAppDownloadReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppDownloadReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppDownloadReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.AppDownloadReq;

        /**
         * Decodes an AppDownloadReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppDownloadReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.AppDownloadReq;

        /**
         * Verifies an AppDownloadReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppDownloadReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppDownloadReq
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.AppDownloadReq;

        /**
         * Creates a plain object from an AppDownloadReq message. Also converts values to other types if specified.
         * @param message AppDownloadReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.AppDownloadReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppDownloadReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AppUpdateReq. */
    interface IAppUpdateReq {

        /** AppUpdateReq appName */
        appName?: (string|null);
    }

    /** Represents an AppUpdateReq. */
    class AppUpdateReq implements IAppUpdateReq {

        /**
         * Constructs a new AppUpdateReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IAppUpdateReq);

        /** AppUpdateReq appName. */
        public appName: string;

        /**
         * Creates a new AppUpdateReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppUpdateReq instance
         */
        public static create(properties?: deviceapi.IAppUpdateReq): deviceapi.AppUpdateReq;

        /**
         * Encodes the specified AppUpdateReq message. Does not implicitly {@link deviceapi.AppUpdateReq.verify|verify} messages.
         * @param message AppUpdateReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IAppUpdateReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppUpdateReq message, length delimited. Does not implicitly {@link deviceapi.AppUpdateReq.verify|verify} messages.
         * @param message AppUpdateReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IAppUpdateReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppUpdateReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppUpdateReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.AppUpdateReq;

        /**
         * Decodes an AppUpdateReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppUpdateReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.AppUpdateReq;

        /**
         * Verifies an AppUpdateReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppUpdateReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppUpdateReq
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.AppUpdateReq;

        /**
         * Creates a plain object from an AppUpdateReq message. Also converts values to other types if specified.
         * @param message AppUpdateReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.AppUpdateReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppUpdateReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AppDeleteReq. */
    interface IAppDeleteReq {

        /** AppDeleteReq appName */
        appName?: (string|null);
    }

    /** Represents an AppDeleteReq. */
    class AppDeleteReq implements IAppDeleteReq {

        /**
         * Constructs a new AppDeleteReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IAppDeleteReq);

        /** AppDeleteReq appName. */
        public appName: string;

        /**
         * Creates a new AppDeleteReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppDeleteReq instance
         */
        public static create(properties?: deviceapi.IAppDeleteReq): deviceapi.AppDeleteReq;

        /**
         * Encodes the specified AppDeleteReq message. Does not implicitly {@link deviceapi.AppDeleteReq.verify|verify} messages.
         * @param message AppDeleteReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IAppDeleteReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppDeleteReq message, length delimited. Does not implicitly {@link deviceapi.AppDeleteReq.verify|verify} messages.
         * @param message AppDeleteReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IAppDeleteReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppDeleteReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppDeleteReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.AppDeleteReq;

        /**
         * Decodes an AppDeleteReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppDeleteReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.AppDeleteReq;

        /**
         * Verifies an AppDeleteReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppDeleteReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppDeleteReq
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.AppDeleteReq;

        /**
         * Creates a plain object from an AppDeleteReq message. Also converts values to other types if specified.
         * @param message AppDeleteReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.AppDeleteReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppDeleteReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CheckUpdateRes. */
    interface ICheckUpdateRes {

        /** CheckUpdateRes seId */
        seId?: (string|null);

        /** CheckUpdateRes sn */
        sn?: (string|null);

        /** CheckUpdateRes status */
        status?: (string|null);

        /** CheckUpdateRes sdkMode */
        sdkMode?: (string|null);

        /** CheckUpdateRes availableAppList */
        availableAppList?: (deviceapi.IAvailableAppBean[]|null);
    }

    /** Represents a CheckUpdateRes. */
    class CheckUpdateRes implements ICheckUpdateRes {

        /**
         * Constructs a new CheckUpdateRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.ICheckUpdateRes);

        /** CheckUpdateRes seId. */
        public seId: string;

        /** CheckUpdateRes sn. */
        public sn: string;

        /** CheckUpdateRes status. */
        public status: string;

        /** CheckUpdateRes sdkMode. */
        public sdkMode: string;

        /** CheckUpdateRes availableAppList. */
        public availableAppList: deviceapi.IAvailableAppBean[];

        /**
         * Creates a new CheckUpdateRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CheckUpdateRes instance
         */
        public static create(properties?: deviceapi.ICheckUpdateRes): deviceapi.CheckUpdateRes;

        /**
         * Encodes the specified CheckUpdateRes message. Does not implicitly {@link deviceapi.CheckUpdateRes.verify|verify} messages.
         * @param message CheckUpdateRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.ICheckUpdateRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CheckUpdateRes message, length delimited. Does not implicitly {@link deviceapi.CheckUpdateRes.verify|verify} messages.
         * @param message CheckUpdateRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.ICheckUpdateRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CheckUpdateRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.CheckUpdateRes;

        /**
         * Decodes a CheckUpdateRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.CheckUpdateRes;

        /**
         * Verifies a CheckUpdateRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CheckUpdateRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CheckUpdateRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.CheckUpdateRes;

        /**
         * Creates a plain object from a CheckUpdateRes message. Also converts values to other types if specified.
         * @param message CheckUpdateRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.CheckUpdateRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CheckUpdateRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AvailableAppBean. */
    interface IAvailableAppBean {

        /** AvailableAppBean appName */
        appName?: (string|null);

        /** AvailableAppBean appLogo */
        appLogo?: (string|null);

        /** AvailableAppBean installedVersion */
        installedVersion?: (string|null);

        /** AvailableAppBean lastUpdated */
        lastUpdated?: (string|null);

        /** AvailableAppBean latestVersion */
        latestVersion?: (string|null);

        /** AvailableAppBean installMode */
        installMode?: (string|null);
    }

    /** Represents an AvailableAppBean. */
    class AvailableAppBean implements IAvailableAppBean {

        /**
         * Constructs a new AvailableAppBean.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IAvailableAppBean);

        /** AvailableAppBean appName. */
        public appName: string;

        /** AvailableAppBean appLogo. */
        public appLogo: string;

        /** AvailableAppBean installedVersion. */
        public installedVersion: string;

        /** AvailableAppBean lastUpdated. */
        public lastUpdated: string;

        /** AvailableAppBean latestVersion. */
        public latestVersion: string;

        /** AvailableAppBean installMode. */
        public installMode: string;

        /**
         * Creates a new AvailableAppBean instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AvailableAppBean instance
         */
        public static create(properties?: deviceapi.IAvailableAppBean): deviceapi.AvailableAppBean;

        /**
         * Encodes the specified AvailableAppBean message. Does not implicitly {@link deviceapi.AvailableAppBean.verify|verify} messages.
         * @param message AvailableAppBean message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IAvailableAppBean, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AvailableAppBean message, length delimited. Does not implicitly {@link deviceapi.AvailableAppBean.verify|verify} messages.
         * @param message AvailableAppBean message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IAvailableAppBean, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AvailableAppBean message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AvailableAppBean
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.AvailableAppBean;

        /**
         * Decodes an AvailableAppBean message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AvailableAppBean
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.AvailableAppBean;

        /**
         * Verifies an AvailableAppBean message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AvailableAppBean message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AvailableAppBean
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.AvailableAppBean;

        /**
         * Creates a plain object from an AvailableAppBean message. Also converts values to other types if specified.
         * @param message AvailableAppBean
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.AvailableAppBean, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AvailableAppBean to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BindCheckRes. */
    interface IBindCheckRes {

        /** BindCheckRes bindStatus */
        bindStatus?: (string|null);
    }

    /** Represents a BindCheckRes. */
    class BindCheckRes implements IBindCheckRes {

        /**
         * Constructs a new BindCheckRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IBindCheckRes);

        /** BindCheckRes bindStatus. */
        public bindStatus: string;

        /**
         * Creates a new BindCheckRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BindCheckRes instance
         */
        public static create(properties?: deviceapi.IBindCheckRes): deviceapi.BindCheckRes;

        /**
         * Encodes the specified BindCheckRes message. Does not implicitly {@link deviceapi.BindCheckRes.verify|verify} messages.
         * @param message BindCheckRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IBindCheckRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BindCheckRes message, length delimited. Does not implicitly {@link deviceapi.BindCheckRes.verify|verify} messages.
         * @param message BindCheckRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IBindCheckRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BindCheckRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BindCheckRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.BindCheckRes;

        /**
         * Decodes a BindCheckRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BindCheckRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.BindCheckRes;

        /**
         * Verifies a BindCheckRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BindCheckRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BindCheckRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.BindCheckRes;

        /**
         * Creates a plain object from a BindCheckRes message. Also converts values to other types if specified.
         * @param message BindCheckRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.BindCheckRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BindCheckRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BindAcquireReq. */
    interface IBindAcquireReq {

        /** BindAcquireReq bindCode */
        bindCode?: (string|null);
    }

    /** Represents a BindAcquireReq. */
    class BindAcquireReq implements IBindAcquireReq {

        /**
         * Constructs a new BindAcquireReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IBindAcquireReq);

        /** BindAcquireReq bindCode. */
        public bindCode: string;

        /**
         * Creates a new BindAcquireReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BindAcquireReq instance
         */
        public static create(properties?: deviceapi.IBindAcquireReq): deviceapi.BindAcquireReq;

        /**
         * Encodes the specified BindAcquireReq message. Does not implicitly {@link deviceapi.BindAcquireReq.verify|verify} messages.
         * @param message BindAcquireReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IBindAcquireReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BindAcquireReq message, length delimited. Does not implicitly {@link deviceapi.BindAcquireReq.verify|verify} messages.
         * @param message BindAcquireReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IBindAcquireReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BindAcquireReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BindAcquireReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.BindAcquireReq;

        /**
         * Decodes a BindAcquireReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BindAcquireReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.BindAcquireReq;

        /**
         * Verifies a BindAcquireReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BindAcquireReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BindAcquireReq
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.BindAcquireReq;

        /**
         * Creates a plain object from a BindAcquireReq message. Also converts values to other types if specified.
         * @param message BindAcquireReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.BindAcquireReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BindAcquireReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BindAcquireRes. */
    interface IBindAcquireRes {

        /** BindAcquireRes bindResult */
        bindResult?: (string|null);
    }

    /** Represents a BindAcquireRes. */
    class BindAcquireRes implements IBindAcquireRes {

        /**
         * Constructs a new BindAcquireRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IBindAcquireRes);

        /** BindAcquireRes bindResult. */
        public bindResult: string;

        /**
         * Creates a new BindAcquireRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BindAcquireRes instance
         */
        public static create(properties?: deviceapi.IBindAcquireRes): deviceapi.BindAcquireRes;

        /**
         * Encodes the specified BindAcquireRes message. Does not implicitly {@link deviceapi.BindAcquireRes.verify|verify} messages.
         * @param message BindAcquireRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IBindAcquireRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BindAcquireRes message, length delimited. Does not implicitly {@link deviceapi.BindAcquireRes.verify|verify} messages.
         * @param message BindAcquireRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IBindAcquireRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BindAcquireRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BindAcquireRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.BindAcquireRes;

        /**
         * Decodes a BindAcquireRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BindAcquireRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.BindAcquireRes;

        /**
         * Verifies a BindAcquireRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BindAcquireRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BindAcquireRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.BindAcquireRes;

        /**
         * Creates a plain object from a BindAcquireRes message. Also converts values to other types if specified.
         * @param message BindAcquireRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.BindAcquireRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BindAcquireRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetSeidRes. */
    interface IGetSeidRes {

        /** GetSeidRes seid */
        seid?: (string|null);
    }

    /** Represents a GetSeidRes. */
    class GetSeidRes implements IGetSeidRes {

        /**
         * Constructs a new GetSeidRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetSeidRes);

        /** GetSeidRes seid. */
        public seid: string;

        /**
         * Creates a new GetSeidRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetSeidRes instance
         */
        public static create(properties?: deviceapi.IGetSeidRes): deviceapi.GetSeidRes;

        /**
         * Encodes the specified GetSeidRes message. Does not implicitly {@link deviceapi.GetSeidRes.verify|verify} messages.
         * @param message GetSeidRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetSeidRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetSeidRes message, length delimited. Does not implicitly {@link deviceapi.GetSeidRes.verify|verify} messages.
         * @param message GetSeidRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetSeidRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetSeidRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetSeidRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetSeidRes;

        /**
         * Decodes a GetSeidRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetSeidRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetSeidRes;

        /**
         * Verifies a GetSeidRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetSeidRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetSeidRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetSeidRes;

        /**
         * Creates a plain object from a GetSeidRes message. Also converts values to other types if specified.
         * @param message GetSeidRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetSeidRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetSeidRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetSnRes. */
    interface IGetSnRes {

        /** GetSnRes sn */
        sn?: (string|null);
    }

    /** Represents a GetSnRes. */
    class GetSnRes implements IGetSnRes {

        /**
         * Constructs a new GetSnRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetSnRes);

        /** GetSnRes sn. */
        public sn: string;

        /**
         * Creates a new GetSnRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetSnRes instance
         */
        public static create(properties?: deviceapi.IGetSnRes): deviceapi.GetSnRes;

        /**
         * Encodes the specified GetSnRes message. Does not implicitly {@link deviceapi.GetSnRes.verify|verify} messages.
         * @param message GetSnRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetSnRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetSnRes message, length delimited. Does not implicitly {@link deviceapi.GetSnRes.verify|verify} messages.
         * @param message GetSnRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetSnRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetSnRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetSnRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetSnRes;

        /**
         * Decodes a GetSnRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetSnRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetSnRes;

        /**
         * Verifies a GetSnRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetSnRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetSnRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetSnRes;

        /**
         * Creates a plain object from a GetSnRes message. Also converts values to other types if specified.
         * @param message GetSnRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetSnRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetSnRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetRamSizeRes. */
    interface IGetRamSizeRes {

        /** GetRamSizeRes ramSize */
        ramSize?: (string|null);
    }

    /** Represents a GetRamSizeRes. */
    class GetRamSizeRes implements IGetRamSizeRes {

        /**
         * Constructs a new GetRamSizeRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetRamSizeRes);

        /** GetRamSizeRes ramSize. */
        public ramSize: string;

        /**
         * Creates a new GetRamSizeRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetRamSizeRes instance
         */
        public static create(properties?: deviceapi.IGetRamSizeRes): deviceapi.GetRamSizeRes;

        /**
         * Encodes the specified GetRamSizeRes message. Does not implicitly {@link deviceapi.GetRamSizeRes.verify|verify} messages.
         * @param message GetRamSizeRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetRamSizeRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetRamSizeRes message, length delimited. Does not implicitly {@link deviceapi.GetRamSizeRes.verify|verify} messages.
         * @param message GetRamSizeRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetRamSizeRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetRamSizeRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetRamSizeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetRamSizeRes;

        /**
         * Decodes a GetRamSizeRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetRamSizeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetRamSizeRes;

        /**
         * Verifies a GetRamSizeRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetRamSizeRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetRamSizeRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetRamSizeRes;

        /**
         * Creates a plain object from a GetRamSizeRes message. Also converts values to other types if specified.
         * @param message GetRamSizeRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetRamSizeRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetRamSizeRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetFirmwareVersionRes. */
    interface IGetFirmwareVersionRes {

        /** GetFirmwareVersionRes firmwareVersion */
        firmwareVersion?: (string|null);
    }

    /** Represents a GetFirmwareVersionRes. */
    class GetFirmwareVersionRes implements IGetFirmwareVersionRes {

        /**
         * Constructs a new GetFirmwareVersionRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetFirmwareVersionRes);

        /** GetFirmwareVersionRes firmwareVersion. */
        public firmwareVersion: string;

        /**
         * Creates a new GetFirmwareVersionRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetFirmwareVersionRes instance
         */
        public static create(properties?: deviceapi.IGetFirmwareVersionRes): deviceapi.GetFirmwareVersionRes;

        /**
         * Encodes the specified GetFirmwareVersionRes message. Does not implicitly {@link deviceapi.GetFirmwareVersionRes.verify|verify} messages.
         * @param message GetFirmwareVersionRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetFirmwareVersionRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetFirmwareVersionRes message, length delimited. Does not implicitly {@link deviceapi.GetFirmwareVersionRes.verify|verify} messages.
         * @param message GetFirmwareVersionRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetFirmwareVersionRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetFirmwareVersionRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetFirmwareVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetFirmwareVersionRes;

        /**
         * Decodes a GetFirmwareVersionRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetFirmwareVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetFirmwareVersionRes;

        /**
         * Verifies a GetFirmwareVersionRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetFirmwareVersionRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetFirmwareVersionRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetFirmwareVersionRes;

        /**
         * Creates a plain object from a GetFirmwareVersionRes message. Also converts values to other types if specified.
         * @param message GetFirmwareVersionRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetFirmwareVersionRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetFirmwareVersionRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetBatteryPowerRes. */
    interface IGetBatteryPowerRes {

        /** GetBatteryPowerRes batteryPower */
        batteryPower?: (string|null);
    }

    /** Represents a GetBatteryPowerRes. */
    class GetBatteryPowerRes implements IGetBatteryPowerRes {

        /**
         * Constructs a new GetBatteryPowerRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetBatteryPowerRes);

        /** GetBatteryPowerRes batteryPower. */
        public batteryPower: string;

        /**
         * Creates a new GetBatteryPowerRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetBatteryPowerRes instance
         */
        public static create(properties?: deviceapi.IGetBatteryPowerRes): deviceapi.GetBatteryPowerRes;

        /**
         * Encodes the specified GetBatteryPowerRes message. Does not implicitly {@link deviceapi.GetBatteryPowerRes.verify|verify} messages.
         * @param message GetBatteryPowerRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetBatteryPowerRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetBatteryPowerRes message, length delimited. Does not implicitly {@link deviceapi.GetBatteryPowerRes.verify|verify} messages.
         * @param message GetBatteryPowerRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetBatteryPowerRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetBatteryPowerRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetBatteryPowerRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetBatteryPowerRes;

        /**
         * Decodes a GetBatteryPowerRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetBatteryPowerRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetBatteryPowerRes;

        /**
         * Verifies a GetBatteryPowerRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetBatteryPowerRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetBatteryPowerRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetBatteryPowerRes;

        /**
         * Creates a plain object from a GetBatteryPowerRes message. Also converts values to other types if specified.
         * @param message GetBatteryPowerRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetBatteryPowerRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetBatteryPowerRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetLifeTimeRes. */
    interface IGetLifeTimeRes {

        /** GetLifeTimeRes lifeTime */
        lifeTime?: (string|null);
    }

    /** Represents a GetLifeTimeRes. */
    class GetLifeTimeRes implements IGetLifeTimeRes {

        /**
         * Constructs a new GetLifeTimeRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetLifeTimeRes);

        /** GetLifeTimeRes lifeTime. */
        public lifeTime: string;

        /**
         * Creates a new GetLifeTimeRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetLifeTimeRes instance
         */
        public static create(properties?: deviceapi.IGetLifeTimeRes): deviceapi.GetLifeTimeRes;

        /**
         * Encodes the specified GetLifeTimeRes message. Does not implicitly {@link deviceapi.GetLifeTimeRes.verify|verify} messages.
         * @param message GetLifeTimeRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetLifeTimeRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetLifeTimeRes message, length delimited. Does not implicitly {@link deviceapi.GetLifeTimeRes.verify|verify} messages.
         * @param message GetLifeTimeRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetLifeTimeRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetLifeTimeRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetLifeTimeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetLifeTimeRes;

        /**
         * Decodes a GetLifeTimeRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetLifeTimeRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetLifeTimeRes;

        /**
         * Verifies a GetLifeTimeRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetLifeTimeRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetLifeTimeRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetLifeTimeRes;

        /**
         * Creates a plain object from a GetLifeTimeRes message. Also converts values to other types if specified.
         * @param message GetLifeTimeRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetLifeTimeRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetLifeTimeRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetBleNameRes. */
    interface IGetBleNameRes {

        /** GetBleNameRes bleName */
        bleName?: (string|null);
    }

    /** Represents a GetBleNameRes. */
    class GetBleNameRes implements IGetBleNameRes {

        /**
         * Constructs a new GetBleNameRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetBleNameRes);

        /** GetBleNameRes bleName. */
        public bleName: string;

        /**
         * Creates a new GetBleNameRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetBleNameRes instance
         */
        public static create(properties?: deviceapi.IGetBleNameRes): deviceapi.GetBleNameRes;

        /**
         * Encodes the specified GetBleNameRes message. Does not implicitly {@link deviceapi.GetBleNameRes.verify|verify} messages.
         * @param message GetBleNameRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetBleNameRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetBleNameRes message, length delimited. Does not implicitly {@link deviceapi.GetBleNameRes.verify|verify} messages.
         * @param message GetBleNameRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetBleNameRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetBleNameRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetBleNameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetBleNameRes;

        /**
         * Decodes a GetBleNameRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetBleNameRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetBleNameRes;

        /**
         * Verifies a GetBleNameRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetBleNameRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetBleNameRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetBleNameRes;

        /**
         * Creates a plain object from a GetBleNameRes message. Also converts values to other types if specified.
         * @param message GetBleNameRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetBleNameRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetBleNameRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetBleNameReq. */
    interface ISetBleNameReq {

        /** SetBleNameReq bleName */
        bleName?: (string|null);
    }

    /** Represents a SetBleNameReq. */
    class SetBleNameReq implements ISetBleNameReq {

        /**
         * Constructs a new SetBleNameReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.ISetBleNameReq);

        /** SetBleNameReq bleName. */
        public bleName: string;

        /**
         * Creates a new SetBleNameReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetBleNameReq instance
         */
        public static create(properties?: deviceapi.ISetBleNameReq): deviceapi.SetBleNameReq;

        /**
         * Encodes the specified SetBleNameReq message. Does not implicitly {@link deviceapi.SetBleNameReq.verify|verify} messages.
         * @param message SetBleNameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.ISetBleNameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetBleNameReq message, length delimited. Does not implicitly {@link deviceapi.SetBleNameReq.verify|verify} messages.
         * @param message SetBleNameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.ISetBleNameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetBleNameReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetBleNameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.SetBleNameReq;

        /**
         * Decodes a SetBleNameReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetBleNameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.SetBleNameReq;

        /**
         * Verifies a SetBleNameReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetBleNameReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetBleNameReq
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.SetBleNameReq;

        /**
         * Creates a plain object from a SetBleNameReq message. Also converts values to other types if specified.
         * @param message SetBleNameReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.SetBleNameReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetBleNameReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetBleVersionRes. */
    interface IGetBleVersionRes {

        /** GetBleVersionRes bleVersion */
        bleVersion?: (string|null);
    }

    /** Represents a GetBleVersionRes. */
    class GetBleVersionRes implements IGetBleVersionRes {

        /**
         * Constructs a new GetBleVersionRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetBleVersionRes);

        /** GetBleVersionRes bleVersion. */
        public bleVersion: string;

        /**
         * Creates a new GetBleVersionRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetBleVersionRes instance
         */
        public static create(properties?: deviceapi.IGetBleVersionRes): deviceapi.GetBleVersionRes;

        /**
         * Encodes the specified GetBleVersionRes message. Does not implicitly {@link deviceapi.GetBleVersionRes.verify|verify} messages.
         * @param message GetBleVersionRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetBleVersionRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetBleVersionRes message, length delimited. Does not implicitly {@link deviceapi.GetBleVersionRes.verify|verify} messages.
         * @param message GetBleVersionRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetBleVersionRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetBleVersionRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetBleVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetBleVersionRes;

        /**
         * Decodes a GetBleVersionRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetBleVersionRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetBleVersionRes;

        /**
         * Verifies a GetBleVersionRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetBleVersionRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetBleVersionRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetBleVersionRes;

        /**
         * Creates a plain object from a GetBleVersionRes message. Also converts values to other types if specified.
         * @param message GetBleVersionRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetBleVersionRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetBleVersionRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetSdkInfoRes. */
    interface IGetSdkInfoRes {

        /** GetSdkInfoRes sdkVersion */
        sdkVersion?: (string|null);
    }

    /** Represents a GetSdkInfoRes. */
    class GetSdkInfoRes implements IGetSdkInfoRes {

        /**
         * Constructs a new GetSdkInfoRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IGetSdkInfoRes);

        /** GetSdkInfoRes sdkVersion. */
        public sdkVersion: string;

        /**
         * Creates a new GetSdkInfoRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetSdkInfoRes instance
         */
        public static create(properties?: deviceapi.IGetSdkInfoRes): deviceapi.GetSdkInfoRes;

        /**
         * Encodes the specified GetSdkInfoRes message. Does not implicitly {@link deviceapi.GetSdkInfoRes.verify|verify} messages.
         * @param message GetSdkInfoRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IGetSdkInfoRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetSdkInfoRes message, length delimited. Does not implicitly {@link deviceapi.GetSdkInfoRes.verify|verify} messages.
         * @param message GetSdkInfoRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IGetSdkInfoRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetSdkInfoRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetSdkInfoRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.GetSdkInfoRes;

        /**
         * Decodes a GetSdkInfoRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetSdkInfoRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.GetSdkInfoRes;

        /**
         * Verifies a GetSdkInfoRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetSdkInfoRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetSdkInfoRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.GetSdkInfoRes;

        /**
         * Creates a plain object from a GetSdkInfoRes message. Also converts values to other types if specified.
         * @param message GetSdkInfoRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.GetSdkInfoRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetSdkInfoRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeviceConnectReq. */
    interface IDeviceConnectReq {

        /** DeviceConnectReq deviceModelName */
        deviceModelName?: (string|null);
    }

    /** Represents a DeviceConnectReq. */
    class DeviceConnectReq implements IDeviceConnectReq {

        /**
         * Constructs a new DeviceConnectReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IDeviceConnectReq);

        /** DeviceConnectReq deviceModelName. */
        public deviceModelName: string;

        /**
         * Creates a new DeviceConnectReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeviceConnectReq instance
         */
        public static create(properties?: deviceapi.IDeviceConnectReq): deviceapi.DeviceConnectReq;

        /**
         * Encodes the specified DeviceConnectReq message. Does not implicitly {@link deviceapi.DeviceConnectReq.verify|verify} messages.
         * @param message DeviceConnectReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IDeviceConnectReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeviceConnectReq message, length delimited. Does not implicitly {@link deviceapi.DeviceConnectReq.verify|verify} messages.
         * @param message DeviceConnectReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IDeviceConnectReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeviceConnectReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeviceConnectReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.DeviceConnectReq;

        /**
         * Decodes a DeviceConnectReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeviceConnectReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.DeviceConnectReq;

        /**
         * Verifies a DeviceConnectReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeviceConnectReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeviceConnectReq
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.DeviceConnectReq;

        /**
         * Creates a plain object from a DeviceConnectReq message. Also converts values to other types if specified.
         * @param message DeviceConnectReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.DeviceConnectReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeviceConnectReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CosCheckUpdateRes. */
    interface ICosCheckUpdateRes {

        /** CosCheckUpdateRes seid */
        seid?: (string|null);

        /** CosCheckUpdateRes isLatest */
        isLatest?: (boolean|null);

        /** CosCheckUpdateRes latestCosVersion */
        latestCosVersion?: (string|null);

        /** CosCheckUpdateRes updateType */
        updateType?: (string|null);

        /** CosCheckUpdateRes description */
        description?: (string|null);

        /** CosCheckUpdateRes isUpdateSuccess */
        isUpdateSuccess?: (boolean|null);
    }

    /** Represents a CosCheckUpdateRes. */
    class CosCheckUpdateRes implements ICosCheckUpdateRes {

        /**
         * Constructs a new CosCheckUpdateRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.ICosCheckUpdateRes);

        /** CosCheckUpdateRes seid. */
        public seid: string;

        /** CosCheckUpdateRes isLatest. */
        public isLatest: boolean;

        /** CosCheckUpdateRes latestCosVersion. */
        public latestCosVersion: string;

        /** CosCheckUpdateRes updateType. */
        public updateType: string;

        /** CosCheckUpdateRes description. */
        public description: string;

        /** CosCheckUpdateRes isUpdateSuccess. */
        public isUpdateSuccess: boolean;

        /**
         * Creates a new CosCheckUpdateRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CosCheckUpdateRes instance
         */
        public static create(properties?: deviceapi.ICosCheckUpdateRes): deviceapi.CosCheckUpdateRes;

        /**
         * Encodes the specified CosCheckUpdateRes message. Does not implicitly {@link deviceapi.CosCheckUpdateRes.verify|verify} messages.
         * @param message CosCheckUpdateRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.ICosCheckUpdateRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CosCheckUpdateRes message, length delimited. Does not implicitly {@link deviceapi.CosCheckUpdateRes.verify|verify} messages.
         * @param message CosCheckUpdateRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.ICosCheckUpdateRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CosCheckUpdateRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CosCheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.CosCheckUpdateRes;

        /**
         * Decodes a CosCheckUpdateRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CosCheckUpdateRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.CosCheckUpdateRes;

        /**
         * Verifies a CosCheckUpdateRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CosCheckUpdateRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CosCheckUpdateRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.CosCheckUpdateRes;

        /**
         * Creates a plain object from a CosCheckUpdateRes message. Also converts values to other types if specified.
         * @param message CosCheckUpdateRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.CosCheckUpdateRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CosCheckUpdateRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an IsBlStatusRes. */
    interface IIsBlStatusRes {

        /** IsBlStatusRes checkResult */
        checkResult?: (boolean|null);
    }

    /** Represents an IsBlStatusRes. */
    class IsBlStatusRes implements IIsBlStatusRes {

        /**
         * Constructs a new IsBlStatusRes.
         * @param [properties] Properties to set
         */
        constructor(properties?: deviceapi.IIsBlStatusRes);

        /** IsBlStatusRes checkResult. */
        public checkResult: boolean;

        /**
         * Creates a new IsBlStatusRes instance using the specified properties.
         * @param [properties] Properties to set
         * @returns IsBlStatusRes instance
         */
        public static create(properties?: deviceapi.IIsBlStatusRes): deviceapi.IsBlStatusRes;

        /**
         * Encodes the specified IsBlStatusRes message. Does not implicitly {@link deviceapi.IsBlStatusRes.verify|verify} messages.
         * @param message IsBlStatusRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: deviceapi.IIsBlStatusRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified IsBlStatusRes message, length delimited. Does not implicitly {@link deviceapi.IsBlStatusRes.verify|verify} messages.
         * @param message IsBlStatusRes message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: deviceapi.IIsBlStatusRes, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IsBlStatusRes message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IsBlStatusRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): deviceapi.IsBlStatusRes;

        /**
         * Decodes an IsBlStatusRes message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns IsBlStatusRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): deviceapi.IsBlStatusRes;

        /**
         * Verifies an IsBlStatusRes message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an IsBlStatusRes message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns IsBlStatusRes
         */
        public static fromObject(object: { [k: string]: any }): deviceapi.IsBlStatusRes;

        /**
         * Creates a plain object from an IsBlStatusRes message. Also converts values to other types if specified.
         * @param message IsBlStatusRes
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: deviceapi.IsBlStatusRes, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this IsBlStatusRes to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace eosapi. */
export namespace eosapi {

    /** Properties of an EosTxInput. */
    interface IEosTxInput {

        /** EosTxInput transactions */
        transactions?: (eosapi.IEosSignData[]|null);
    }

    /** Represents an EosTxInput. */
    class EosTxInput implements IEosTxInput {

        /**
         * Constructs a new EosTxInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: eosapi.IEosTxInput);

        /** EosTxInput transactions. */
        public transactions: eosapi.IEosSignData[];

        /**
         * Creates a new EosTxInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosTxInput instance
         */
        public static create(properties?: eosapi.IEosTxInput): eosapi.EosTxInput;

        /**
         * Encodes the specified EosTxInput message. Does not implicitly {@link eosapi.EosTxInput.verify|verify} messages.
         * @param message EosTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: eosapi.IEosTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosTxInput message, length delimited. Does not implicitly {@link eosapi.EosTxInput.verify|verify} messages.
         * @param message EosTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: eosapi.IEosTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosTxInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eosapi.EosTxInput;

        /**
         * Decodes an EosTxInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eosapi.EosTxInput;

        /**
         * Verifies an EosTxInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosTxInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosTxInput
         */
        public static fromObject(object: { [k: string]: any }): eosapi.EosTxInput;

        /**
         * Creates a plain object from an EosTxInput message. Also converts values to other types if specified.
         * @param message EosTxInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: eosapi.EosTxInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosTxInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EosSignData. */
    interface IEosSignData {

        /** EosSignData txHex */
        txHex?: (string|null);

        /** EosSignData publicKeys */
        publicKeys?: (string[]|null);

        /** EosSignData chainId */
        chainId?: (string|null);

        /** EosSignData receiver */
        receiver?: (string|null);

        /** EosSignData payment */
        payment?: (string|null);

        /** EosSignData sender */
        sender?: (string|null);
    }

    /** Represents an EosSignData. */
    class EosSignData implements IEosSignData {

        /**
         * Constructs a new EosSignData.
         * @param [properties] Properties to set
         */
        constructor(properties?: eosapi.IEosSignData);

        /** EosSignData txHex. */
        public txHex: string;

        /** EosSignData publicKeys. */
        public publicKeys: string[];

        /** EosSignData chainId. */
        public chainId: string;

        /** EosSignData receiver. */
        public receiver: string;

        /** EosSignData payment. */
        public payment: string;

        /** EosSignData sender. */
        public sender: string;

        /**
         * Creates a new EosSignData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosSignData instance
         */
        public static create(properties?: eosapi.IEosSignData): eosapi.EosSignData;

        /**
         * Encodes the specified EosSignData message. Does not implicitly {@link eosapi.EosSignData.verify|verify} messages.
         * @param message EosSignData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: eosapi.IEosSignData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosSignData message, length delimited. Does not implicitly {@link eosapi.EosSignData.verify|verify} messages.
         * @param message EosSignData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: eosapi.IEosSignData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosSignData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosSignData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eosapi.EosSignData;

        /**
         * Decodes an EosSignData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosSignData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eosapi.EosSignData;

        /**
         * Verifies an EosSignData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosSignData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosSignData
         */
        public static fromObject(object: { [k: string]: any }): eosapi.EosSignData;

        /**
         * Creates a plain object from an EosSignData message. Also converts values to other types if specified.
         * @param message EosSignData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: eosapi.EosSignData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosSignData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EosTxOutput. */
    interface IEosTxOutput {

        /** EosTxOutput transMultiSigns */
        transMultiSigns?: (eosapi.IEosSignResult[]|null);
    }

    /** Represents an EosTxOutput. */
    class EosTxOutput implements IEosTxOutput {

        /**
         * Constructs a new EosTxOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: eosapi.IEosTxOutput);

        /** EosTxOutput transMultiSigns. */
        public transMultiSigns: eosapi.IEosSignResult[];

        /**
         * Creates a new EosTxOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosTxOutput instance
         */
        public static create(properties?: eosapi.IEosTxOutput): eosapi.EosTxOutput;

        /**
         * Encodes the specified EosTxOutput message. Does not implicitly {@link eosapi.EosTxOutput.verify|verify} messages.
         * @param message EosTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: eosapi.IEosTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosTxOutput message, length delimited. Does not implicitly {@link eosapi.EosTxOutput.verify|verify} messages.
         * @param message EosTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: eosapi.IEosTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosTxOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eosapi.EosTxOutput;

        /**
         * Decodes an EosTxOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eosapi.EosTxOutput;

        /**
         * Verifies an EosTxOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosTxOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosTxOutput
         */
        public static fromObject(object: { [k: string]: any }): eosapi.EosTxOutput;

        /**
         * Creates a plain object from an EosTxOutput message. Also converts values to other types if specified.
         * @param message EosTxOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: eosapi.EosTxOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosTxOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EosSignResult. */
    interface IEosSignResult {

        /** EosSignResult hash */
        hash?: (string|null);

        /** EosSignResult signs */
        signs?: (string[]|null);
    }

    /** Represents an EosSignResult. */
    class EosSignResult implements IEosSignResult {

        /**
         * Constructs a new EosSignResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: eosapi.IEosSignResult);

        /** EosSignResult hash. */
        public hash: string;

        /** EosSignResult signs. */
        public signs: string[];

        /**
         * Creates a new EosSignResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosSignResult instance
         */
        public static create(properties?: eosapi.IEosSignResult): eosapi.EosSignResult;

        /**
         * Encodes the specified EosSignResult message. Does not implicitly {@link eosapi.EosSignResult.verify|verify} messages.
         * @param message EosSignResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: eosapi.IEosSignResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosSignResult message, length delimited. Does not implicitly {@link eosapi.EosSignResult.verify|verify} messages.
         * @param message EosSignResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: eosapi.IEosSignResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosSignResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosSignResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eosapi.EosSignResult;

        /**
         * Decodes an EosSignResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosSignResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eosapi.EosSignResult;

        /**
         * Verifies an EosSignResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosSignResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosSignResult
         */
        public static fromObject(object: { [k: string]: any }): eosapi.EosSignResult;

        /**
         * Creates a plain object from an EosSignResult message. Also converts values to other types if specified.
         * @param message EosSignResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: eosapi.EosSignResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosSignResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EosMessageInput. */
    interface IEosMessageInput {

        /** EosMessageInput data */
        data?: (string|null);

        /** EosMessageInput pubkey */
        pubkey?: (string|null);

        /** EosMessageInput isHex */
        isHex?: (boolean|null);
    }

    /** Represents an EosMessageInput. */
    class EosMessageInput implements IEosMessageInput {

        /**
         * Constructs a new EosMessageInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: eosapi.IEosMessageInput);

        /** EosMessageInput data. */
        public data: string;

        /** EosMessageInput pubkey. */
        public pubkey: string;

        /** EosMessageInput isHex. */
        public isHex: boolean;

        /**
         * Creates a new EosMessageInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosMessageInput instance
         */
        public static create(properties?: eosapi.IEosMessageInput): eosapi.EosMessageInput;

        /**
         * Encodes the specified EosMessageInput message. Does not implicitly {@link eosapi.EosMessageInput.verify|verify} messages.
         * @param message EosMessageInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: eosapi.IEosMessageInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosMessageInput message, length delimited. Does not implicitly {@link eosapi.EosMessageInput.verify|verify} messages.
         * @param message EosMessageInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: eosapi.IEosMessageInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosMessageInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eosapi.EosMessageInput;

        /**
         * Decodes an EosMessageInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eosapi.EosMessageInput;

        /**
         * Verifies an EosMessageInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosMessageInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosMessageInput
         */
        public static fromObject(object: { [k: string]: any }): eosapi.EosMessageInput;

        /**
         * Creates a plain object from an EosMessageInput message. Also converts values to other types if specified.
         * @param message EosMessageInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: eosapi.EosMessageInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosMessageInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EosMessageOutput. */
    interface IEosMessageOutput {

        /** EosMessageOutput signature */
        signature?: (string|null);
    }

    /** Represents an EosMessageOutput. */
    class EosMessageOutput implements IEosMessageOutput {

        /**
         * Constructs a new EosMessageOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: eosapi.IEosMessageOutput);

        /** EosMessageOutput signature. */
        public signature: string;

        /**
         * Creates a new EosMessageOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EosMessageOutput instance
         */
        public static create(properties?: eosapi.IEosMessageOutput): eosapi.EosMessageOutput;

        /**
         * Encodes the specified EosMessageOutput message. Does not implicitly {@link eosapi.EosMessageOutput.verify|verify} messages.
         * @param message EosMessageOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: eosapi.IEosMessageOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EosMessageOutput message, length delimited. Does not implicitly {@link eosapi.EosMessageOutput.verify|verify} messages.
         * @param message EosMessageOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: eosapi.IEosMessageOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EosMessageOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EosMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): eosapi.EosMessageOutput;

        /**
         * Decodes an EosMessageOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EosMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): eosapi.EosMessageOutput;

        /**
         * Verifies an EosMessageOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EosMessageOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EosMessageOutput
         */
        public static fromObject(object: { [k: string]: any }): eosapi.EosMessageOutput;

        /**
         * Creates a plain object from an EosMessageOutput message. Also converts values to other types if specified.
         * @param message EosMessageOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: eosapi.EosMessageOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EosMessageOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace ethapi. */
export namespace ethapi {

    /** Properties of an EthTxInput. */
    interface IEthTxInput {

        /** EthTxInput nonce */
        nonce?: (string|null);

        /** EthTxInput gasPrice */
        gasPrice?: (string|null);

        /** EthTxInput gasLimit */
        gasLimit?: (string|null);

        /** EthTxInput to */
        to?: (string|null);

        /** EthTxInput value */
        value?: (string|null);

        /** EthTxInput data */
        data?: (string|null);

        /** EthTxInput chainId */
        chainId?: (string|null);
    }

    /** Represents an EthTxInput. */
    class EthTxInput implements IEthTxInput {

        /**
         * Constructs a new EthTxInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: ethapi.IEthTxInput);

        /** EthTxInput nonce. */
        public nonce: string;

        /** EthTxInput gasPrice. */
        public gasPrice: string;

        /** EthTxInput gasLimit. */
        public gasLimit: string;

        /** EthTxInput to. */
        public to: string;

        /** EthTxInput value. */
        public value: string;

        /** EthTxInput data. */
        public data: string;

        /** EthTxInput chainId. */
        public chainId: string;

        /**
         * Creates a new EthTxInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EthTxInput instance
         */
        public static create(properties?: ethapi.IEthTxInput): ethapi.EthTxInput;

        /**
         * Encodes the specified EthTxInput message. Does not implicitly {@link ethapi.EthTxInput.verify|verify} messages.
         * @param message EthTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ethapi.IEthTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EthTxInput message, length delimited. Does not implicitly {@link ethapi.EthTxInput.verify|verify} messages.
         * @param message EthTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ethapi.IEthTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EthTxInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EthTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ethapi.EthTxInput;

        /**
         * Decodes an EthTxInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EthTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ethapi.EthTxInput;

        /**
         * Verifies an EthTxInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EthTxInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EthTxInput
         */
        public static fromObject(object: { [k: string]: any }): ethapi.EthTxInput;

        /**
         * Creates a plain object from an EthTxInput message. Also converts values to other types if specified.
         * @param message EthTxInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ethapi.EthTxInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EthTxInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EthTxOutput. */
    interface IEthTxOutput {

        /** EthTxOutput signature */
        signature?: (string|null);

        /** EthTxOutput txHash */
        txHash?: (string|null);
    }

    /** Represents an EthTxOutput. */
    class EthTxOutput implements IEthTxOutput {

        /**
         * Constructs a new EthTxOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: ethapi.IEthTxOutput);

        /** EthTxOutput signature. */
        public signature: string;

        /** EthTxOutput txHash. */
        public txHash: string;

        /**
         * Creates a new EthTxOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EthTxOutput instance
         */
        public static create(properties?: ethapi.IEthTxOutput): ethapi.EthTxOutput;

        /**
         * Encodes the specified EthTxOutput message. Does not implicitly {@link ethapi.EthTxOutput.verify|verify} messages.
         * @param message EthTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ethapi.IEthTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EthTxOutput message, length delimited. Does not implicitly {@link ethapi.EthTxOutput.verify|verify} messages.
         * @param message EthTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ethapi.IEthTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EthTxOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EthTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ethapi.EthTxOutput;

        /**
         * Decodes an EthTxOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EthTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ethapi.EthTxOutput;

        /**
         * Verifies an EthTxOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EthTxOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EthTxOutput
         */
        public static fromObject(object: { [k: string]: any }): ethapi.EthTxOutput;

        /**
         * Creates a plain object from an EthTxOutput message. Also converts values to other types if specified.
         * @param message EthTxOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ethapi.EthTxOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EthTxOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EthMessageInput. */
    interface IEthMessageInput {

        /** EthMessageInput message */
        message?: (string|null);

        /** EthMessageInput isPersonalSign */
        isPersonalSign?: (boolean|null);
    }

    /** Represents an EthMessageInput. */
    class EthMessageInput implements IEthMessageInput {

        /**
         * Constructs a new EthMessageInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: ethapi.IEthMessageInput);

        /** EthMessageInput message. */
        public message: string;

        /** EthMessageInput isPersonalSign. */
        public isPersonalSign: boolean;

        /**
         * Creates a new EthMessageInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EthMessageInput instance
         */
        public static create(properties?: ethapi.IEthMessageInput): ethapi.EthMessageInput;

        /**
         * Encodes the specified EthMessageInput message. Does not implicitly {@link ethapi.EthMessageInput.verify|verify} messages.
         * @param message EthMessageInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ethapi.IEthMessageInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EthMessageInput message, length delimited. Does not implicitly {@link ethapi.EthMessageInput.verify|verify} messages.
         * @param message EthMessageInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ethapi.IEthMessageInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EthMessageInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EthMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ethapi.EthMessageInput;

        /**
         * Decodes an EthMessageInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EthMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ethapi.EthMessageInput;

        /**
         * Verifies an EthMessageInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EthMessageInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EthMessageInput
         */
        public static fromObject(object: { [k: string]: any }): ethapi.EthMessageInput;

        /**
         * Creates a plain object from an EthMessageInput message. Also converts values to other types if specified.
         * @param message EthMessageInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ethapi.EthMessageInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EthMessageInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EthMessageOutput. */
    interface IEthMessageOutput {

        /** EthMessageOutput signature */
        signature?: (string|null);
    }

    /** Represents an EthMessageOutput. */
    class EthMessageOutput implements IEthMessageOutput {

        /**
         * Constructs a new EthMessageOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: ethapi.IEthMessageOutput);

        /** EthMessageOutput signature. */
        public signature: string;

        /**
         * Creates a new EthMessageOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EthMessageOutput instance
         */
        public static create(properties?: ethapi.IEthMessageOutput): ethapi.EthMessageOutput;

        /**
         * Encodes the specified EthMessageOutput message. Does not implicitly {@link ethapi.EthMessageOutput.verify|verify} messages.
         * @param message EthMessageOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: ethapi.IEthMessageOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EthMessageOutput message, length delimited. Does not implicitly {@link ethapi.EthMessageOutput.verify|verify} messages.
         * @param message EthMessageOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: ethapi.IEthMessageOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EthMessageOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EthMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ethapi.EthMessageOutput;

        /**
         * Decodes an EthMessageOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EthMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ethapi.EthMessageOutput;

        /**
         * Verifies an EthMessageOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EthMessageOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EthMessageOutput
         */
        public static fromObject(object: { [k: string]: any }): ethapi.EthMessageOutput;

        /**
         * Creates a plain object from an EthMessageOutput message. Also converts values to other types if specified.
         * @param message EthMessageOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: ethapi.EthMessageOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EthMessageOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace filecoinapi. */
export namespace filecoinapi {

    /** Properties of a FilecoinTxInput. */
    interface IFilecoinTxInput {

        /** FilecoinTxInput to */
        to?: (string|null);

        /** FilecoinTxInput from */
        from?: (string|null);

        /** FilecoinTxInput nonce */
        nonce?: (number|Long|null);

        /** FilecoinTxInput value */
        value?: (string|null);

        /** FilecoinTxInput gasLimit */
        gasLimit?: (number|Long|null);

        /** FilecoinTxInput gasFeeCap */
        gasFeeCap?: (string|null);

        /** FilecoinTxInput gasPremium */
        gasPremium?: (string|null);

        /** FilecoinTxInput method */
        method?: (number|Long|null);

        /** FilecoinTxInput params */
        params?: (string|null);
    }

    /** Represents a FilecoinTxInput. */
    class FilecoinTxInput implements IFilecoinTxInput {

        /**
         * Constructs a new FilecoinTxInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: filecoinapi.IFilecoinTxInput);

        /** FilecoinTxInput to. */
        public to: string;

        /** FilecoinTxInput from. */
        public from: string;

        /** FilecoinTxInput nonce. */
        public nonce: (number|Long);

        /** FilecoinTxInput value. */
        public value: string;

        /** FilecoinTxInput gasLimit. */
        public gasLimit: (number|Long);

        /** FilecoinTxInput gasFeeCap. */
        public gasFeeCap: string;

        /** FilecoinTxInput gasPremium. */
        public gasPremium: string;

        /** FilecoinTxInput method. */
        public method: (number|Long);

        /** FilecoinTxInput params. */
        public params: string;

        /**
         * Creates a new FilecoinTxInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FilecoinTxInput instance
         */
        public static create(properties?: filecoinapi.IFilecoinTxInput): filecoinapi.FilecoinTxInput;

        /**
         * Encodes the specified FilecoinTxInput message. Does not implicitly {@link filecoinapi.FilecoinTxInput.verify|verify} messages.
         * @param message FilecoinTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: filecoinapi.IFilecoinTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FilecoinTxInput message, length delimited. Does not implicitly {@link filecoinapi.FilecoinTxInput.verify|verify} messages.
         * @param message FilecoinTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: filecoinapi.IFilecoinTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FilecoinTxInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FilecoinTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): filecoinapi.FilecoinTxInput;

        /**
         * Decodes a FilecoinTxInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FilecoinTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): filecoinapi.FilecoinTxInput;

        /**
         * Verifies a FilecoinTxInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FilecoinTxInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FilecoinTxInput
         */
        public static fromObject(object: { [k: string]: any }): filecoinapi.FilecoinTxInput;

        /**
         * Creates a plain object from a FilecoinTxInput message. Also converts values to other types if specified.
         * @param message FilecoinTxInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: filecoinapi.FilecoinTxInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FilecoinTxInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FilecoinTxOutput. */
    interface IFilecoinTxOutput {

        /** FilecoinTxOutput cid */
        cid?: (string|null);

        /** FilecoinTxOutput message */
        message?: (filecoinapi.IFilecoinTxInput|null);

        /** FilecoinTxOutput signature */
        signature?: (filecoinapi.ISignature|null);
    }

    /** Represents a FilecoinTxOutput. */
    class FilecoinTxOutput implements IFilecoinTxOutput {

        /**
         * Constructs a new FilecoinTxOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: filecoinapi.IFilecoinTxOutput);

        /** FilecoinTxOutput cid. */
        public cid: string;

        /** FilecoinTxOutput message. */
        public message?: (filecoinapi.IFilecoinTxInput|null);

        /** FilecoinTxOutput signature. */
        public signature?: (filecoinapi.ISignature|null);

        /**
         * Creates a new FilecoinTxOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FilecoinTxOutput instance
         */
        public static create(properties?: filecoinapi.IFilecoinTxOutput): filecoinapi.FilecoinTxOutput;

        /**
         * Encodes the specified FilecoinTxOutput message. Does not implicitly {@link filecoinapi.FilecoinTxOutput.verify|verify} messages.
         * @param message FilecoinTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: filecoinapi.IFilecoinTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FilecoinTxOutput message, length delimited. Does not implicitly {@link filecoinapi.FilecoinTxOutput.verify|verify} messages.
         * @param message FilecoinTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: filecoinapi.IFilecoinTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FilecoinTxOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FilecoinTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): filecoinapi.FilecoinTxOutput;

        /**
         * Decodes a FilecoinTxOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FilecoinTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): filecoinapi.FilecoinTxOutput;

        /**
         * Verifies a FilecoinTxOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FilecoinTxOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FilecoinTxOutput
         */
        public static fromObject(object: { [k: string]: any }): filecoinapi.FilecoinTxOutput;

        /**
         * Creates a plain object from a FilecoinTxOutput message. Also converts values to other types if specified.
         * @param message FilecoinTxOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: filecoinapi.FilecoinTxOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FilecoinTxOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Signature. */
    interface ISignature {

        /** Signature type */
        type?: (number|null);

        /** Signature data */
        data?: (string|null);
    }

    /** Represents a Signature. */
    class Signature implements ISignature {

        /**
         * Constructs a new Signature.
         * @param [properties] Properties to set
         */
        constructor(properties?: filecoinapi.ISignature);

        /** Signature type. */
        public type: number;

        /** Signature data. */
        public data: string;

        /**
         * Creates a new Signature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Signature instance
         */
        public static create(properties?: filecoinapi.ISignature): filecoinapi.Signature;

        /**
         * Encodes the specified Signature message. Does not implicitly {@link filecoinapi.Signature.verify|verify} messages.
         * @param message Signature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: filecoinapi.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Signature message, length delimited. Does not implicitly {@link filecoinapi.Signature.verify|verify} messages.
         * @param message Signature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: filecoinapi.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Signature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): filecoinapi.Signature;

        /**
         * Decodes a Signature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): filecoinapi.Signature;

        /**
         * Verifies a Signature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Signature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Signature
         */
        public static fromObject(object: { [k: string]: any }): filecoinapi.Signature;

        /**
         * Creates a plain object from a Signature message. Also converts values to other types if specified.
         * @param message Signature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: filecoinapi.Signature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Signature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace substrateapi. */
export namespace substrateapi {

    /** Properties of a SubstrateRawTxIn. */
    interface ISubstrateRawTxIn {

        /** SubstrateRawTxIn rawData */
        rawData?: (string|null);
    }

    /** Represents a SubstrateRawTxIn. */
    class SubstrateRawTxIn implements ISubstrateRawTxIn {

        /**
         * Constructs a new SubstrateRawTxIn.
         * @param [properties] Properties to set
         */
        constructor(properties?: substrateapi.ISubstrateRawTxIn);

        /** SubstrateRawTxIn rawData. */
        public rawData: string;

        /**
         * Creates a new SubstrateRawTxIn instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubstrateRawTxIn instance
         */
        public static create(properties?: substrateapi.ISubstrateRawTxIn): substrateapi.SubstrateRawTxIn;

        /**
         * Encodes the specified SubstrateRawTxIn message. Does not implicitly {@link substrateapi.SubstrateRawTxIn.verify|verify} messages.
         * @param message SubstrateRawTxIn message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: substrateapi.ISubstrateRawTxIn, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubstrateRawTxIn message, length delimited. Does not implicitly {@link substrateapi.SubstrateRawTxIn.verify|verify} messages.
         * @param message SubstrateRawTxIn message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: substrateapi.ISubstrateRawTxIn, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubstrateRawTxIn message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubstrateRawTxIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): substrateapi.SubstrateRawTxIn;

        /**
         * Decodes a SubstrateRawTxIn message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubstrateRawTxIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): substrateapi.SubstrateRawTxIn;

        /**
         * Verifies a SubstrateRawTxIn message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubstrateRawTxIn message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubstrateRawTxIn
         */
        public static fromObject(object: { [k: string]: any }): substrateapi.SubstrateRawTxIn;

        /**
         * Creates a plain object from a SubstrateRawTxIn message. Also converts values to other types if specified.
         * @param message SubstrateRawTxIn
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: substrateapi.SubstrateRawTxIn, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubstrateRawTxIn to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SubstrateTxOut. */
    interface ISubstrateTxOut {

        /** SubstrateTxOut signature */
        signature?: (string|null);
    }

    /** Represents a SubstrateTxOut. */
    class SubstrateTxOut implements ISubstrateTxOut {

        /**
         * Constructs a new SubstrateTxOut.
         * @param [properties] Properties to set
         */
        constructor(properties?: substrateapi.ISubstrateTxOut);

        /** SubstrateTxOut signature. */
        public signature: string;

        /**
         * Creates a new SubstrateTxOut instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubstrateTxOut instance
         */
        public static create(properties?: substrateapi.ISubstrateTxOut): substrateapi.SubstrateTxOut;

        /**
         * Encodes the specified SubstrateTxOut message. Does not implicitly {@link substrateapi.SubstrateTxOut.verify|verify} messages.
         * @param message SubstrateTxOut message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: substrateapi.ISubstrateTxOut, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubstrateTxOut message, length delimited. Does not implicitly {@link substrateapi.SubstrateTxOut.verify|verify} messages.
         * @param message SubstrateTxOut message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: substrateapi.ISubstrateTxOut, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubstrateTxOut message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubstrateTxOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): substrateapi.SubstrateTxOut;

        /**
         * Decodes a SubstrateTxOut message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubstrateTxOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): substrateapi.SubstrateTxOut;

        /**
         * Verifies a SubstrateTxOut message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubstrateTxOut message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubstrateTxOut
         */
        public static fromObject(object: { [k: string]: any }): substrateapi.SubstrateTxOut;

        /**
         * Creates a plain object from a SubstrateTxOut message. Also converts values to other types if specified.
         * @param message SubstrateTxOut
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: substrateapi.SubstrateTxOut, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubstrateTxOut to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace tronapi. */
export namespace tronapi {

    /** Properties of a TronTxInput. */
    interface ITronTxInput {

        /** TronTxInput rawData */
        rawData?: (string|null);
    }

    /** Represents a TronTxInput. */
    class TronTxInput implements ITronTxInput {

        /**
         * Constructs a new TronTxInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: tronapi.ITronTxInput);

        /** TronTxInput rawData. */
        public rawData: string;

        /**
         * Creates a new TronTxInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TronTxInput instance
         */
        public static create(properties?: tronapi.ITronTxInput): tronapi.TronTxInput;

        /**
         * Encodes the specified TronTxInput message. Does not implicitly {@link tronapi.TronTxInput.verify|verify} messages.
         * @param message TronTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: tronapi.ITronTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TronTxInput message, length delimited. Does not implicitly {@link tronapi.TronTxInput.verify|verify} messages.
         * @param message TronTxInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: tronapi.ITronTxInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TronTxInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TronTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tronapi.TronTxInput;

        /**
         * Decodes a TronTxInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TronTxInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tronapi.TronTxInput;

        /**
         * Verifies a TronTxInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TronTxInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TronTxInput
         */
        public static fromObject(object: { [k: string]: any }): tronapi.TronTxInput;

        /**
         * Creates a plain object from a TronTxInput message. Also converts values to other types if specified.
         * @param message TronTxInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: tronapi.TronTxInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TronTxInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TronTxOutput. */
    interface ITronTxOutput {

        /** TronTxOutput signature */
        signature?: (string|null);
    }

    /** Represents a TronTxOutput. */
    class TronTxOutput implements ITronTxOutput {

        /**
         * Constructs a new TronTxOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: tronapi.ITronTxOutput);

        /** TronTxOutput signature. */
        public signature: string;

        /**
         * Creates a new TronTxOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TronTxOutput instance
         */
        public static create(properties?: tronapi.ITronTxOutput): tronapi.TronTxOutput;

        /**
         * Encodes the specified TronTxOutput message. Does not implicitly {@link tronapi.TronTxOutput.verify|verify} messages.
         * @param message TronTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: tronapi.ITronTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TronTxOutput message, length delimited. Does not implicitly {@link tronapi.TronTxOutput.verify|verify} messages.
         * @param message TronTxOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: tronapi.ITronTxOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TronTxOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TronTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tronapi.TronTxOutput;

        /**
         * Decodes a TronTxOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TronTxOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tronapi.TronTxOutput;

        /**
         * Verifies a TronTxOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TronTxOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TronTxOutput
         */
        public static fromObject(object: { [k: string]: any }): tronapi.TronTxOutput;

        /**
         * Creates a plain object from a TronTxOutput message. Also converts values to other types if specified.
         * @param message TronTxOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: tronapi.TronTxOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TronTxOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TronMessageInput. */
    interface ITronMessageInput {

        /** TronMessageInput message */
        message?: (string|null);

        /** TronMessageInput isHex */
        isHex?: (boolean|null);

        /** TronMessageInput isTronHeader */
        isTronHeader?: (boolean|null);
    }

    /** Represents a TronMessageInput. */
    class TronMessageInput implements ITronMessageInput {

        /**
         * Constructs a new TronMessageInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: tronapi.ITronMessageInput);

        /** TronMessageInput message. */
        public message: string;

        /** TronMessageInput isHex. */
        public isHex: boolean;

        /** TronMessageInput isTronHeader. */
        public isTronHeader: boolean;

        /**
         * Creates a new TronMessageInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TronMessageInput instance
         */
        public static create(properties?: tronapi.ITronMessageInput): tronapi.TronMessageInput;

        /**
         * Encodes the specified TronMessageInput message. Does not implicitly {@link tronapi.TronMessageInput.verify|verify} messages.
         * @param message TronMessageInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: tronapi.ITronMessageInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TronMessageInput message, length delimited. Does not implicitly {@link tronapi.TronMessageInput.verify|verify} messages.
         * @param message TronMessageInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: tronapi.ITronMessageInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TronMessageInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TronMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tronapi.TronMessageInput;

        /**
         * Decodes a TronMessageInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TronMessageInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tronapi.TronMessageInput;

        /**
         * Verifies a TronMessageInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TronMessageInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TronMessageInput
         */
        public static fromObject(object: { [k: string]: any }): tronapi.TronMessageInput;

        /**
         * Creates a plain object from a TronMessageInput message. Also converts values to other types if specified.
         * @param message TronMessageInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: tronapi.TronMessageInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TronMessageInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TronMessageOutput. */
    interface ITronMessageOutput {

        /** TronMessageOutput signature */
        signature?: (string|null);
    }

    /** Represents a TronMessageOutput. */
    class TronMessageOutput implements ITronMessageOutput {

        /**
         * Constructs a new TronMessageOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: tronapi.ITronMessageOutput);

        /** TronMessageOutput signature. */
        public signature: string;

        /**
         * Creates a new TronMessageOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TronMessageOutput instance
         */
        public static create(properties?: tronapi.ITronMessageOutput): tronapi.TronMessageOutput;

        /**
         * Encodes the specified TronMessageOutput message. Does not implicitly {@link tronapi.TronMessageOutput.verify|verify} messages.
         * @param message TronMessageOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: tronapi.ITronMessageOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TronMessageOutput message, length delimited. Does not implicitly {@link tronapi.TronMessageOutput.verify|verify} messages.
         * @param message TronMessageOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: tronapi.ITronMessageOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TronMessageOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TronMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tronapi.TronMessageOutput;

        /**
         * Decodes a TronMessageOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TronMessageOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tronapi.TronMessageOutput;

        /**
         * Verifies a TronMessageOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TronMessageOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TronMessageOutput
         */
        public static fromObject(object: { [k: string]: any }): tronapi.TronMessageOutput;

        /**
         * Creates a plain object from a TronMessageOutput message. Also converts values to other types if specified.
         * @param message TronMessageOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: tronapi.TronMessageOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TronMessageOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
