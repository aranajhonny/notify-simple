const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.PG_URL
});

client.connect();

const assignments = new Set();
const NODE_ID = `${Math.floor(Math.random() * 4)}`; // 0..3

console.log('> Node id: ' + NODE_ID);

client.on('notification', function(msg) {
	let payload = JSON.parse(msg.payload);

	if (payload.data.node_id === NODE_ID) {
		assignments.add(payload.data.program_id);
	}
	// Programs assigned to this node
	console.log(assignments);
});

client.query('LISTEN events');
