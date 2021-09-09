tre-svg-editor
---

## Demo

### Clone this repo and install tre-cli-tools:

```
npm -g tre-cli-tools
```

### Run `tre init` to create an ssb network and all needed keypairs:

```
tre init
```

### Import the example svg

```
tre server run "tre import-files package.json" > msgs.json
```

You now have the message keys of the newly published messages in msgs.json. Put the contents of msg.json into .trerc under a new key named "tre". The message keys will then be available to the webapp.

### Run the webapp

```
bay-of-plenty -- demo.js
```

License: MIT
