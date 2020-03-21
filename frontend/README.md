# ts-project

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Known Issues on Docker for Windows
Service 'connbackend' failed to build: no matching manifest for windows/amd64 10.0.17763 in the manifest list entries

FIX:
1. Right click Docker instance
2. Go to Settings
3. Daemon
4. Advanced
5. Set the "experimental": true
6. Restart Docker

Error 1260 
 
FIX:
regedit 
in Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\safer\codeidentifiers\0\Paths\{037fbed5-6686-4d5e-a1b4-c0887771a079} 
change value of ItemData to *.doc