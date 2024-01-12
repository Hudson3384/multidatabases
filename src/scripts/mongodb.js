// CRUD

// create
db.heros.insert({
  name: "Flash",
  power: "Velocity",
  dateOfbirth: "1999-02-01",
});

// read
db.heros.find();
db.heros.find().pretty();

//update

db.heros.update(
  // replace all to  { name: "WonderWoman" }
  { _id: ObjectId("65a17173b3e2952a06b6e2ce") },
  { name: "WonderWoman" }
);

db.heros.update(
  // replace only the prop in $set or create the prop if it dont exists
  { _id: ObjectId("65a17173b3e2952a06b6e2ce") },
  { $set: { name: "WonderWoman" } }
);

//delete
db.heros.remove({}); // remove all colection
db.heros.remove({ name: "WonderWoman" });

for (let i = 0; i <= 100000; i++) {
  db.heros.insert({
    name: `47-Clone-${i}`,
    power: "Velocity",
    dateOfbirth: "1999-02-01",
  });
}

// count items
db.heros.count();
// show one item
db.heros.findOne();
// limit items and sort by name in descent order
db.heros.find().limit(1000).sort({ name: -1 });

/*
docker-compose ls
docker-compose exec  mongodb /
mongo -u $USER -p $PASSWORD --authenticationDatabase admin

show dbs -> show disponibily dbs 
use heros -> define heros as context
show collections
*/
