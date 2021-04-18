const Sequelize = require('sequelize')

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/pg-visualizer', { logging: false })

const Schema = db.define('schema', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    }
})

const Table = db.define('table', {
    frontId: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    }
})

const Field = db.define('field', {
    name: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.ENUM(['string', 'float', 'integer', 'boolean'])
    },
    allowNull: {
        type: Sequelize.BOOLEAN
    }
})

const Association = db.define('association', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})
Schema.hasMany(Table, { onDelete: 'cascade', hooks: true })
Table.belongsTo(Schema)

Table.hasMany(Field, { onDelete: 'cascade', hooks: true })
Field.belongsTo(Table)

Table.belongsToMany(Table, { through: Association, as: 'has', foreignKey: 'belongsToId' })
Table.belongsToMany(Table, { through: Association, as: 'belongsTo', foreignKey: 'hasId' })

module.exports = {
    db,
    Schema,
    Table,
    Association,
    Field
}
