cd ..
tsc --out "out/john-smith.debug.js" --comments src/Common.ts src/Binding.ts src/View.ts src/JQuery.ts src/Debug.ts
tsc --out "out/john-smith.js" src/Common.ts src/Binding.ts src/View.ts src/JQuery.ts
ccjs "out/john-smith.js" > "out/john-smith.min.js"