cd src/proto
protoc --js_out=import_style=commonjs,binary:. api.proto
protoc --js_out=import_style=commonjs,binary:. btc.proto
protoc --js_out=import_style=commonjs,binary:. btcfork.proto
protoc --js_out=import_style=commonjs,binary:. cosmos.proto
protoc --js_out=import_style=commonjs,binary:. device.proto
protoc --js_out=import_style=commonjs,binary:. eos.proto
protoc --js_out=import_style=commonjs,binary:. eth.proto
protoc --js_out=import_style=commonjs,binary:. common.proto
protoc --js_out=import_style=commonjs,binary:. filecoin.proto
protoc --js_out=import_style=commonjs,binary:. substrate.proto
protoc --js_out=import_style=commonjs,binary:. tron.proto
cd ../../
