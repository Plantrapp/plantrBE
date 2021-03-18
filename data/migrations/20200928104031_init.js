function foreignKey(tbl, refTable, name, refColumn) {
  return tbl
    .integer(name)
    .unsigned()
    .references(refColumn || "id")
    .inTable(refTable)
    .onDelete("RESTRICT")
    .onUpdate("CASCADE");
}
function foreignKeyString(tbl, refTable, name, refColumn) {
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
      tbl.string("id").unique().index().primary();
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
      tbl.integer("lat").notNullable();
      tbl.integer("lng").notNullable();
      tbl.string("role");
      tbl.integer("hourly_rate").defaultTo(0);
      tbl.integer("star_rating").defaultTo(0);
      tbl.string("description");
      tbl.integer("follower_count").defaultTo(0);
      tbl.integer("max_mile_range").defaultTo(25);
      tbl.string("created_at");
      tbl.boolean("isSubscribed");
    })
    .createTable("client_growr_connection", (tbl) => {
      tbl.increments();
      foreignKeyString(tbl, "user", "dwellr_id");
      foreignKeyString(tbl, "user", "growr_id");
    })
    .createTable("message", (tbl) => {
      tbl.increments();
      foreignKeyString(tbl, "user", "sender_id");
      foreignKeyString(tbl, "user", "recipient_id");
      tbl.string("sender");
      tbl.string("recipient");
      tbl.string("message");
      tbl.string("created_at");
    })
    .createTable("blogs", (tbl) => {
      tbl.increments();
      foreignKeyString(tbl, "user", "author_id").notNullable();
      tbl.string("author").notNullable();
      tbl.string("title").notNullable();
      tbl.string("description");
      tbl.string("category").notNullable();
      tbl.string("message").notNullable();
      tbl.string("created_at");
    })
    .createTable("portfolio_posts", (tbl) => {
      tbl.increments();
      foreignKeyString(tbl, "user", "user_id");
      tbl.string("url").notNullable();
      tbl.string("description");
      tbl.string("created_at");
    })
    .createTable("reviews", (tbl) => {
      tbl.increments();
      foreignKeyString(tbl, "user", "reviewee_id").notNullable();
      foreignKeyString(tbl, "user", "reviewer_id").notNullable();
      tbl.integer("star_rating").notNullable();
      tbl.string("message").notNullable();
      tbl.string("created_at").notNullable();
    });
};
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("reviews")
    .dropTableIfExists("portfolio_posts")
    .dropTableIfExists("blogs")
    .dropTableIfExists("message")
    .dropTableIfExists("client_growr_connection")
    .dropTableIfExists("user");
};
