import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItemStatus,
  deleteItem,
  getPotentialMatches,
} from '../controllers/itemController.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(createItem);

router.route('/:id')
  .get(getItemById)
  .delete(deleteItem);

router.route('/:id/status')
  .patch(updateItemStatus);

router.route('/:id/matches')
  .get(getPotentialMatches);

export default router;
