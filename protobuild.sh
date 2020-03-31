;装完以后，可以用cmd命令导出.js文件和.d.ts文件，对应文件路径自己百度去设置，第一行导出js文件，第二行把导出的js生成对应的.d.ts文件，这样就可以在TS代码中调用了。
;-t -static-module参数，表示选的是静态代码模式。
;-w commonjs表示用什么标准来输出js代码，有各种比如es2015、es5、umd、amd什么的，然而我对js不太熟悉，总之只有commonjs可以执行成功，其他都会报错什么的（.d.ts文件反正我是不需要，白鹭引擎看看需要不）
;生成.js：  pbjs -t static-module -w commonjs -o zzz.js zzz.proto
;生成.d.ts：pbts -o zzz.d.ts zzz.js
pbjs -t static-module -w commonjs -o ./src/proto/api.js ./src/proto/api.proto
pbts -o ./src/proto/api.d.ts ./src/proto/api.js
pbjs -t static-module -w commonjs -o ./src/proto/btc.js ./src/proto/btc.proto
pbts -o ./src/proto/btc.d.ts ./src/proto/btc.js
pbjs -t static-module -w commonjs -o ./src/proto/cosmos.js ./src/proto/cosmos.proto
pbts -o ./src/proto/cosmos.d.ts ./src/proto/cosmos.js
pbjs -t static-module -w commonjs -o ./src/proto/device.js ./src/proto/device.proto
pbts -o ./src/proto/device.d.ts ./src/proto/device.js
pbjs -t static-module -w commonjs -o ./src/proto/eos.js ./src/proto/eos.proto
pbts -o ./src/proto/eos.d.ts ./src/proto/eos.js
pbjs -t static-module -w commonjs -o ./src/proto/eth.js ./src/proto/eth.proto
pbts -o ./src/proto/eth.d.ts ./src/proto/eth.js
cd src/proto
protoc --js_out=import_style=commonjs,binary:. api.proto
protoc --js_out=import_style=commonjs,binary:. btc.proto
protoc --js_out=import_style=commonjs,binary:. cosmos.proto
protoc --js_out=import_style=commonjs,binary:. device.proto
protoc --js_out=import_style=commonjs,binary:. eos.proto
protoc --js_out=import_style=commonjs,binary:. eth.proto
cd ../../
