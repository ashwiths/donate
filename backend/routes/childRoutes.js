const express = require('express')
const router = express.Router()
const { getAllChildren, getChildById } = require('../controllers/childController')

router.get('/', getAllChildren)
router.get('/:id', getChildById)

module.exports = router
