mv src/util/Globals.js src/util/Globals_local.js
mv Globals_deploy.js src/util/Globals.js
npm run build
mv src/util/Globals.js Globals_deploy.js
mv src/util/Globals_local.js src/util/Globals.js
zip -r build.zip build
scp build.zip root@37.148.212.132:/tmp/build.zip
rm build.zip

ssh root@37.148.212.132
rm -r /var/www/nasilbiri/public_html/*
cd /var/www/nasilbiri/public_html/
unzip /tmp/build.zip -d .
mv build/* .
rm /tmp/build.zip
