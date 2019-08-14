const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.PG_URL
});

client.connect();

(async () => {
	try {
		const NODE_ID = `${Math.floor(Math.random() * 2)}`;
		const PROGRAM_ID = 5; // STATIC FOR TEST // `${Math.floor(Math.random() * 8)}`;

		const query = 'INSERT INTO assignment ("nodeId", "programId") VALUES ($1, $2);';
		const values1 = ['0', PROGRAM_ID];
		const values2 = ['1', PROGRAM_ID];
		// console.log(values);

		client.query(query, values1);
		client.query(query, values2);
	} catch (err) {
		console.log(err);
	}
})();
