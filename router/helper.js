const db = require("../data/db-config");

function find(table) {
  return db(table);
}

function findById(id, table) {
  return db(table).where({ id }).first();
}

//findBy requires that you pass an object {name: value} as the filter or it won't work.
//Alternatively if the valiable and the name being passed are the same, the object can be passed like so:
//  const id = value
//  findBy({id}, table)
function findBy(filter, table) {
  return db(table).where(filter).orderBy("id");
}

function findByAnd(filter1, filter2, table) {
  return db(table).where(filter1).andWhere(filter2).orderBy("id");
}

function add(addedObject, table) {
  return db(table)
    .insert(addedObject)
    .then((id) => {
      console.log(id);
      return findById(addedObject.id, table);
    });
}

function update(changes, id, table) {
  return db(table)
    .update(changes)
    .where({ id })
    .then(() => {
      return findById(id, table);
    });
}

function remove(id, table) {
  let removed;
  findById(id, table).then((rez) => (removed = rez));
  return db(table)
    .where({ id })
    .del()
    .then(() => {
      return removed;
    });
}

module.exports = {
  find,
  findBy,
  findById,
  findByAnd,
  add,
  update,
  remove,
};
