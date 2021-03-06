const router = require('express').Router()

const BranchController = require('../controllers/branchs')

router.get('/branchs', BranchController.branch_list)
router.post('/branchs', BranchController.branch_create_post)
router.put('/branchs/:id', BranchController.branch_update_put)

module.exports = router
