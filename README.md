# typescript

git remote add origin https://github.com/siddGaurav/typescript.git
git branch -M main
git push -u origin main
# node --loader ts-node/esm src/index.ts
# node --inspect-brk -r ts-node/esm src/index.ts
# node --inspect-brk ./node_modules/.bin/tsx src/index.ts
# node --inspect ./node_modules/.bin/tsx src/index.ts
echo "# typescript" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/siddGaurav/typescript.git
git push -u origin main



{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TSX",
      "runtimeExecutable": "node",
      "runtimeArgs": [
        "./node_modules/.bin/tsx"
      ],
      "args": ["src/index.ts"],
      "cwd": "${workspaceFolder}",
      "sourceMaps": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}