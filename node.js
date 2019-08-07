const assignments = new Set();

const NODE_ID = Math.floor(Math.random() * 4);

assignments.add('1');
assignments.add('2');

for (let a of assignments){
	console.log('Program assignment to this node ' + a)
}