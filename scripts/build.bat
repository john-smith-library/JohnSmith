cd ..
node scripts/build_core.js --configuration debug
node scripts/build_core.js --configuration release --outFileName out/john-smith.js --outMinFileName out/john-smith.min.js
ccjs "out/john-smith.js" > "out/john-smith.min.js"