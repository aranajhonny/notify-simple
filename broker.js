const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.PG_URL
});

client.connect();

const query = 'INSERT INTO assignment ("nodeId", "programId") VALUES ($1, $2);';

for (let i = 8; i > 0; i--) {
	const NODE_ID = `${Math.floor(Math.random() * 2)}`;
	const PROGRAM_ID = `${Math.floor(Math.random() * 4)}`; // 0..7
	const values = [NODE_ID, PROGRAM_ID];
	console.log(values);
	client.query(query, values);
}
