const Sequelize = require('sequelize')

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/pg-visualizer', {logging: false})

const Schema = db.define('schema', {
    key: {
      type: Sequelize.STRING,
      allowNull: false
    }
})

const Table = db.define('table', {
    name: {
        type: Sequelize.STRING,
    }
})

const Field = db.define('field', {
    name: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.ENUM(['string','float','integer','boolean'])
    },
    allowNull: {
        type: Sequelize.BOOLEAN,
    }
})

Schema.hasMany(Table);
Table.belongsTo(Schema);

Table.hasMany(Field);
Field.belongsTo(Table);

module.exports = {
    db,
    Schema,
    Table,
    Field
}
