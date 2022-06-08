/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
	return (
		<Html>
			<Head>
				<link
					href='https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i&display=optional'
					rel='stylesheet'
				/>
			</Head>
			<body>
				<Main />

				<script
					src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js'
					integrity='sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2'
					crossOrigin='anonymous'></script>
				<script src='https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/noframework.waypoints.min.js' />

				<script type='text/javascript' src='/js/index.js' />
				<NextScript />
			</body>
		</Html>
	)
}

export default Document
