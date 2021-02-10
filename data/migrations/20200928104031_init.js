function foreignKey(tbl, refTable, name, refColumn) {
  return tbl
    .integer(name)
    .unsigned()
    .references(refColumn || "id")
    .inTable(refTable)
    .onDelete("RESTRICT")
    .onUpdate("CASCADE");
}
function foreignKeyUsername(tbl, refTable, name, refColumn) {
  return tbl
    .string(name)
    .unsigned()
    .references(refColumn || "id")
    .inTable(refTable)
    .onDelete("RESTRICT")
    .onUpdate("CASCADE");
}
exports.up = function (knex) {
  return knex.schema
    .createTable("user", (tbl) => {
      tbl.increments();
      tbl.string("username").notNullable().unique().index();
      tbl.string("profile_picture");
      tbl.string("password").notNullable();
      tbl.string("email").notNullable();
      tbl.string("first_name").notNullable();
      tbl.string("last_name").notNullable();
      tbl.boolean("isGrowr").defaultTo(false);
      tbl.string("street_address").notNullable();
      tbl.string("city").notNullable();
      tbl.string("state").notNullable();
      tbl.integer("zipcode").notNullable();
      tbl.string("role");
      tbl.integer("hourly_rate").defaultTo(0);
      tbl.integer("star_rating").defaultTo(0);
      tbl.string("description");
      tbl.integer("follower_count").defaultTo(0);
      tbl.integer("max_mile_range");
    })
    .createTable("growr_client_connection", (tbl) => {
      tbl.increments();
      foreignKey(tbl, "user", "client_id");
      foreignKey(tbl, "user", "growr_id");
    })
    .createTable("message", (tbl) => {
      tbl.increments();
      foreignKeyUsername(tbl, "user", "sender", "username");
      foreignKeyUsername(tbl, "user", "recipient", "username");
      tbl.string("message");
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("message")
    .dropTableIfExists("growr_client_connection")
    .dropTableIfExists("user");
};
