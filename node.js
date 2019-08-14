const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.PG_URL
});

client.connect();

const assignments = new Set();
const NODE_ID = `${Math.floor(Math.random() * 2)}`; 

console.log('> Node id: ' + NODE_ID);

client.on('notification', async function(msg) {
	let payload = JSON.parse(msg.payload);

	if (payload.data.nodeId === NODE_ID) {
		assignments.add(payload.data.programId);
		// node acquires the lock
    // or
    // waiting for another node unlock()
		await lock(payload.data.programId);

		// remove blocking for
		// other nodes to use the program
		setTimeout(async () => {
			await unlock(payload.data.programId);
			console.log('unlock');
		}, 8000);
	}
	// Programs assigned to this node
	console.log(assignments);
});

client.query('LISTEN events');

function lock(id) {
	const query =
		'SELECT pg_advisory_lock("lockId") AS success  FROM "programInstance" WHERE "lockId" = $1';
	return client.query(query, [id]);
}

function unlock(id) {
	const query =
		'SELECT pg_advisory_unlock("lockId") AS success  FROM "programInstance" WHERE "lockId" = $1';
	return client.query(query, [id]);
}
