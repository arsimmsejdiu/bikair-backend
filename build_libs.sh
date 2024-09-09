cd libs/axa-api
npm install --production=false
cd ../database
npm install --production=false
cd ../google-api
npm install --production=false
cd ../lambda-utils
npm install --production=false
cd ../s3-utils
npm install --production=false
tsc
cd ../security
npm install --production=false
tsc
cd ../stripe-api
npm install --production=false
cd ../utils
npm install --production=false
