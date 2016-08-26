# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.0.8] - 2016.08.26
### Changed
- [Webpack] HardSourceWebpackPlugin uses different cache folder for dev and prod mode

## [0.0.7] - 2016.08.25
### Changed
- [Webpack] HardSourceWebpackPlugin's cache should be invalided if `config.js`
  changed

## [0.0.6] - 2016.08.25
### Added
- [Template] Build and pack your application with electron-builder
### Changed
- Move `config.js` to the right location. Use it to override your config
  (eg: Webpack config)

## [0.0.5] - 2016.08-24
### Added
- [Webpack] Load global css with file extension `.global.css`

## [0.0.4] - 2016.08.24
### Changed
- [Webpack] Babel loader was applied for all files in `src/folder`

## [0.0.3] - 2016-08-24
### Changed
- Use `find-cache-dir` folder instead of OS' temp folder
- Clean up template

## [0.0.2] - 2016-08-23
### Changed
- CLI `electron-react-app` should correctly install `electron-react-app-scripts`
on `new` command

## 0.0.1 - 2016-08-23

- Forked and Initial release

[Unreleased]: https://github.com/thangngoc89/electron-react-app/compare/v0.0.6...HEAD
[0.0.2]: https://github.com/thangngoc89/electron-react-app/compare/v0.0.1...v0.0.2
[0.0.3]: https://github.com/thangngoc89/electron-react-app/compare/v0.0.2...v0.0.3
[0.0.4]: https://github.com/thangngoc89/electron-react-app/compare/v0.0.3...v0.0.4
[0.0.5]: https://github.com/thangngoc89/electron-react-app/compare/v0.0.4...v0.0.5
[0.0.6]: https://github.com/thangngoc89/electron-react-app/compare/v0.0.5...v0.0.6
