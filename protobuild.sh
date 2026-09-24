cd src/proto
protoc --js_out=import_style=commonjs,binary:. api.proto
protoc --js_out=import_style=commonjs,binary:. btc.proto
protoc --js_out=import_style=commonjs,binary:. device.proto
cd ../../
