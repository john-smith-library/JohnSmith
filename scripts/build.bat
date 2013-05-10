cd ..
tsc --out "out/john-smith.debug.js" --comments src/Common.ts src/Binding.ts src/View.ts src/JQuery.ts src/Debug.ts
tsc --out "out/john-smith.js" src/Common.ts src/Binding.ts src/View.ts src/JQuery.ts
java -jar tools/closure_compiler/compiler.jar --js "out/john-smith.js" --js_output_file "out/john-smith.min.js"
pause