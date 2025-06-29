const { Router } = require('express');
const sectionController = require('../controllers/SectionController');

const router = Router();

router.get('/sections/:course_id', sectionController.getSections);
router.post('/sections/:course_id', sectionController.createMultipleSections);

module.exports = router;