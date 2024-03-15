const { defaults } = require('ts-jest/presets');
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	...defaults,
}
