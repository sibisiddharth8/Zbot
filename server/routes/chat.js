const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createChat,
  getChats,
  getChatById,
  sendMessage,
  deleteChat,
  updateMessage,
  updateChatTitle
} = require('../controllers/chatController');

router.post('/', protect, createChat);
router.get('/', protect, getChats);
router.get('/:id', protect, getChatById);
router.post('/:id/message', protect, sendMessage);
router.delete('/:id', protect, deleteChat);
router.put('/:chatId/message/:messageId', protect, updateMessage);
router.put('/:id/title', protect, updateChatTitle);

module.exports = router;
