/bin/rm -rf ./encog-javascript
/bin/rm -rf ./out
rm ./encog-javascript
mkdir ./out
mkdir ./out/doc
git clone git://github.com/encog/encog-javascript.git
cp ./encog-javascript/encog.js ./out/encog-js-1.0.src.js
cp ./encog-javascript/encog-widget.js ./out/encog-widget.src.js
java -jar ./bin/yuicompressor-2.4.2.jar ./encog-javascript/encog.js -o ./out/encog-js-1.0.js
gzip -c ./out/encog-js-1.0.js > ./out/encog-js-1.0.js.gz
java -jar ./bin/yuicompressor-2.4.2.jar ./encog-javascript/encog-widget.js -o ./out/encog-widget-js-1.0.js
gzip -c ./out/encog-widget-js-1.0.js > ./out/encog-widget-1.0.js.gz
yuidoc -o ./out/doc ./encog-javascript
