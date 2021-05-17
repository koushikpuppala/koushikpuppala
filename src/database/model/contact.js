import pkg from 'mongoose';
const { Schema, model } = pkg;

const ContactSchema = Schema({
	Name: {
		type: String,
		required: true,
	},
	Email: {
		type: String,
		required: true,
	},
	Subject: {
		type: String,
		required: true,
	},
	Message: {
		type: String,
		required: true,
	},
});

const ContactForm = model('Contact Forms', ContactSchema);

export default ContactForm;
