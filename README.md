# log_parser_ts

How to use:
1. Install node.js
2. Clone project
3. Run `npm install`
4. Run `npm run build`
5. Put your logs in `Input` folder
6. Run `start.bat` or `start.sh` (node ./index.js [args]) to start parsing and analyse logs
7. See result in `Output` folder
8. You can change config in `config.json` file to customise input/ouput dirs, plugins, etc.
9. You can add your own plugins in `Plugins` folder

## Project CLI

- `npm install`
- `npm run build` - build project
- `npm run test` - run unit test over project
- `npm run lint-all` - (alias `lint`) lints entire source code of a project
- `start.bat (start.sh)` - (node ./index.js [args]) start parsing and analyse logs'

## CLI args
- -v - log verbose mode
- -c - path to config file (default: root dir ./)

## Project dirs structure

- `src` - typescript source code of a project business logic
- `config.json` - config file with settings for parsing and analyse logs
- `Plugins` - plugins for parsing and analyse logs
- `logs` - logs of a project
- 'Input' - input files for parsing and analyse logs

