import pkg from 'mongoose';
const { connect, connection } = pkg;

export default (database) => {
	connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		autoIndex: false,
		poolSize: 5,
		connectTimeoutMS: 10000,
		family: 4,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	connection.on('connected', () => {
		console.log('Mongoose connection successfully opened');
	});
	connection.on('err', (err) => {
		console.log(`Mongoose connection error: \n ${err.stack}`);
	});
	connection.on('disconnected', () => {
		console.log('Mongoose disconnected');
	});
};
