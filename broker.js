const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.PG_URL
});

client.connect();

(async () => {
	try {
		const NODE_ID = `${Math.floor(Math.random() * 5)}`;
		const PROGRAM_ID = 5; // STATIC FOR TEST // `${Math.floor(Math.random() * 8)}`;

		const getLock = await lock(PROGRAM_ID);
		if (getLock) {
			console.log('lock acquired');
			const query = 'INSERT INTO assignment ("nodeId", "programId") VALUES ($1, $2);';
			const values = [NODE_ID, PROGRAM_ID];
			console.log(values);

			client.query(query, values);
			// remove lock for other nodes
			setTimeout(async () => {
				await unlock(PROGRAM_ID);
				console.log('unlock');
			}, 5000);
		}
	} catch (err) {
		console.log(err);
	}
})();

function lock(id) {
	try {
		const query = 'SELECT pg_advisory_lock("lockId") AS success  FROM "programInstance" WHERE "lockId" = $1';
		return client.query(query, [id]);
	} catch (e) {
		console.log(e);
	}
}

function unlock(id) {
	try {
		const query = 'SELECT pg_advisory_unlock("lockId") AS success  FROM "programInstance" WHERE "lockId" = $1';
		return client.query(query, [id]);
	} catch (e) {
		console.log(e);
	}
}
