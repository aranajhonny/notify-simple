const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.PG_URL
});

client.connect();

const assignments = new Set();
const NODE_ID = '1' //`${Math.floor(Math.random() * 2)}`;

console.log('> Node id: ' + NODE_ID);

client.on('notification', async function(msg) {
  let payload = JSON.parse(msg.payload);
  console.log(payload)
  if (payload.data.nodeId === NODE_ID) {
    assignments.add(payload.data.programId);

    console.log(
      `program assigned: ${payload.data.programId}, adquiring lock ${(new Date().toString()).replace(/ \w+-\d+ \(.*\)$/,"")}`
    );
    // node acquires the lock
    // or
    // waiting for another node unlock()
    await lock(payload.data.nodeId, payload.data.programId);
    console.log(`node_id ${payload.data.nodeId} LOCK programInstance ${payload.data.programId} ${(new Date().toString()).replace(/ \w+-\d+ \(.*\)$/,"")}`);
    // remove blocking for
    // other nodes to use the program
    setTimeout(async () => {
      await unlock(payload.data.nodeId, payload.data.programId);
      console.log(`node_id ${payload.data.nodeId} UNLOCK programInstance ${payload.data.programId} ${(new Date().toString()).replace(/ \w+-\d+ \(.*\)$/,"")}`);
    }, 8000);
  }
  // Programs assigned to this node
  // console.log(assignments);
});

client.on('error', err => {
   process.exit(1);
})

client.query('LISTEN events');

function lock(node, program) {
  const query =
    'SELECT pg_advisory_lock("id") FROM "programInstance" WHERE "id" = $1';
  return client.query(query, [program]);
}

function unlock(node, program) {
  const query =
    'SELECT pg_advisory_unlock("id") FROM "programInstance" WHERE "id" = $1';
  return client.query(query, [program]);
}
