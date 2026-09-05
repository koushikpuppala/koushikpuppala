module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': [
			'ts-jest',
			{
				useESM: false,
				tsconfig: {
					module: 'commonjs',
					moduleResolution: 'node',
					allowSyntheticDefaultImports: true,
					esModuleInterop: true,
					experimentalDecorators: true,
					emitDecoratorMetadata: true,
				},
			},
		],
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', 'src'],
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/$1',
		'^(database|firebase|modules|config|redis|types)(.*)$': '<rootDir>/$1$2',
	},
}
