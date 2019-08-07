const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.PG_URL
});

client.connect();

const query = 'INSERT INTO assignment (node_id, program_id) VALUES ($1, $2);';

for (let i = 8; i > 0; i--) {
	const NODE_ID = `${Math.floor(Math.random() * 4)}`; // 0..3
	const PROGRAM_ID = `${Math.floor(Math.random() * 8)}`; // 0..7
	const values = [NODE_ID, PROGRAM_ID];
	console.log(values);
	client.query(query, values);
}
