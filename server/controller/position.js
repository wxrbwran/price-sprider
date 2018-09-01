const { knex } = require('../config/db');
const moment = require('moment');

knex.schema.withSchema('public').hasTable('position').then(function(exists) {
  if (!exists) {
    return knex.schema.withSchema('public').createTable('position', function(table) {
      table.increments();
      table.string('position');
      table.integer('job_type').defaultTo(1);
      table.string('experience');
      table.string('location');
      table.specificType('temptation', 'text[]');
      table.specificType('responsibility', 'text[]');
      table.specificType('skill', 'text[]');
      table.specificType('professionalism', 'text[]');
      table.boolean('is_open').defaultTo(true);
      table.boolean('is_draft').defaultTo(false);
      table.boolean('is_delete').defaultTo(false);
      table.timestamp('publish_time');
      table.timestamp('created_time');
    });
  }
});

const positionColumn = ['id', 'position', 'job_type', 'experience', 'location',
    'temptation', 'responsibility', 'skill', 'professionalism', 'is_open',
    'is_draft', 'publish_time', 'created_time'];

const FEPositionColumn = ['id', 'position', 'job_type', 'experience', 'location',
    'temptation', 'responsibility', 'skill', 'professionalism', 'publish_time'];

module.exports = {

    getAllPositions: async (ctx) => {
        try {
            const offset = ctx.request.query.page_size * (ctx.request.query.page_at - 1);
            const total = await knex
                .column(positionColumn)
                .where({'is_delete': false})
                .from('position');
            const positions = await knex
                .column(positionColumn)
                .where({'is_delete': false})
                .limit(ctx.request.query.page_size)
                .offset(offset)
                .orderBy('created_time', 'desc')
                .from('position');
            return ctx.body = {
                status: 'success',
                data: {
                    positions: positions.map((item, idx) => {
                        item.index = offset + idx + 1;
                        item.created_time = moment(item.created_time)
                            .format('YYYY/MM/DD HH:mm');
                        item.publish_time = moment(item.publish_time)
                            .format('YYYY/MM/DD HH:mm');
                        return item;
                    }),
                    total: total.length,
                },
            };
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },

    getPostPositions: async (ctx) => {
        try {
            const offset = ctx.request.query.page_size * (ctx.request.query.page_at - 1);
            const total = await knex
                .column(FEPositionColumn)
                .where(
                    {
                        is_delete: false,
                        is_open: true,
                        is_draft: false,
                    })
                .from('position');
            const positions = await knex
                .column(FEPositionColumn)
                .where(
                    {
                        is_delete: false,
                        is_open: true,
                        is_draft: false,
                    })
                .limit(ctx.request.query.page_size)
                .offset(offset)
                .orderBy('publish_time', 'desc')
                .from('position');
            return ctx.body = {
                status: 'success',
                data: {
                    positions: positions.map(item => {
                        item.publish_time = moment(item.created_time)
                            .format('YYYY/MM/DD');
                        return item;
                    }),
                    total: total.length,
                },
            };
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },

    getPositionById: async (ctx) => {
        const { id } = ctx.params;
        try {
            const position = await knex
                .first(positionColumn)
                .where({id, is_delete: false})
                .from('position');
            return ctx.body = {
                status: 'success',
                data: {
                    position,
                },
            };
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },

    addPosition:async (ctx, next) => {
        try {
            await knex('position').insert(ctx.request.body);
            return ctx.body = {
                status: 'success',
                data: null,
            };
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },

    editPositionById: async (ctx, next) => {
        const { id } = ctx.params;
        try {
            await knex('position')
                .update(ctx.request.body)
                .where({id});
            return ctx.body = {
                status: 'success',
                data: null,
            };
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },

    deletePositionById: async (ctx, next) => {
        const { id } = ctx.params;
        try {
            await knex('position')
                .update({is_delete: true})
                .where({id});
            return ctx.body = {
                status: 'success',
                data: null,
            };
        } catch (e) {
            return ctx.body = {
                status: 'fail',
                data: e.stack,
            };
        }
    },
};
