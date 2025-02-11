const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create a new chat with a default title
exports.createChat = async (req, res) => {
  try {
    const chat = await Chat.create({ user: req.user._id, messages: [], title: "New Chat" });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all chats for the authenticated user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a new message in a chat (using the entire conversation context)
exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message)
    return res.status(400).json({ message: 'Message is required' });
  
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat)
      return res.status(404).json({ message: 'Chat not found' });
    
    // Append the user's message
    chat.messages.push({ role: 'user', content: message });
    
    // Automatically update the chat title if still default
    if (chat.title === "New Chat") {
      chat.title = message.length > 20 ? message.substring(0, 20) + "..." : message;
    }
    
    await chat.save();
    
    // Build conversation context from all messages
    const conversationContext = chat.messages
      .map(msg => (msg.role === 'user' ? 'User: ' : 'Assistant: ') + msg.content)
      .join('\n');
    
    // Generate the assistant reply based on the conversation context
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(conversationContext);
    const assistantMessage = result.response.text();
    
    // Append the assistant reply
    chat.messages.push({ role: 'assistant', content: assistantMessage });
    await chat.save();
    
    res.json({ assistantMessage, chat });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

// Delete an entire chat
exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!chat)
      return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update (edit) a user message and regenerate subsequent assistant reply
exports.updateMessage = async (req, res) => {
  const { content } = req.body;
  if (!content)
    return res.status(400).json({ message: 'Content is required' });
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });
    if (!chat)
      return res.status(404).json({ message: 'Chat not found' });
    
    // Find the index of the user message to update (only user messages are editable)
    const msgIndex = chat.messages.findIndex(
      (msg) => String(msg._id) === req.params.messageId && msg.role === 'user'
    );
    if (msgIndex === -1)
      return res.status(404).json({ message: 'Message not found' });
    
    // Update the user message
    chat.messages[msgIndex].content = content;
    // Remove all messages after the updated message
    chat.messages = chat.messages.slice(0, msgIndex + 1);
    
    // Build updated conversation context
    const conversationContext = chat.messages
      .map(msg => (msg.role === 'user' ? 'User: ' : 'Assistant: ') + msg.content)
      .join('\n');
    
    // Generate a new assistant reply
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(conversationContext);
    const assistantReply = result.response.text();
    
    chat.messages.push({ role: 'assistant', content: assistantReply });
    await chat.save();
    
    res.json({ message: 'Message updated', chat });
  } catch (error) {
    console.error("Error in updateMessage:", error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};

// Update the chat title (customizable by the user)
exports.updateChatTitle = async (req, res) => {
  const { title } = req.body;
  if (!title)
    return res.status(400).json({ message: 'Title is required' });
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat)
      return res.status(404).json({ message: 'Chat not found' });
    chat.title = title;
    await chat.save();
    res.json({ message: 'Title updated', chat });
  } catch (error) {
    console.error("Error in updateChatTitle:", error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
};
