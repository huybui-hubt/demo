const knex = require('../db')
const { isDef } = require('../../utils')

exports.branch_list = async (req, res) => {
  const { page = 1, limit = 20, name = '', status = '' } = req.query

  const offset = page > 1 ? (page - 1) * limit : 0

  const queryUnits = knex('branch')
    .select('id', 'name', 'status', 'createdAt', 'updatedAt')
    .modify((query) => {
      if (name) {
        query.where('name', 'like', `%${name}%`)
      }

      if (status) {
        query.whereIn('status', status.split(',').map(Number))
      }
    })
    .offset(offset)
    .limit(limit)
    .orderBy('updatedAt', 'desc')

  const queryTotal = knex('branch')
    .count('* AS total')
    .modify((query) => {
      if (name) {
        query.where('name', 'like', `%${name}%`)
      }

      if (status) {
        query.whereIn('status', status.split(',').map(Number))
      }
    })
    .first()

  const [units, { total }] = await Promise.all([queryUnits, queryTotal])

  const pageCount = parseInt(total / limit) || 1

  return res.jsonp({
    units,
    _metaData: { total, pageCount, page: Number(page), perPage: Number(limit) },
  })
}

exports.branch_update_put = async (req, res) => {
  const branchId = req.params.id
  const { name, status } = req.body

  const updatingData = { updatedAt: knex.fn.now() }

  if (isDef(status)) {
    updatingData.status = status ? 1 : 0
  }

  if (isDef(name)) {
    updatingData.name = name
  }

  await knex('branch').update(updatingData).where('id', branchId)

  return res.sendStatus(200)
}

exports.branch_create_post = async (req, res) => {
  const { name, status } = req.body

  await knex('branch').insert({
    name,
    status,
    createdAt: knex.fn.now(),
    updatedAt: knex.fn.now(),
  })

  return res.sendStatus(200)
}
