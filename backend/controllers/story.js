const Story = require("../models/Story");
const { v4: id } = require("uuid");
const User = require("../models/User");

exports.getStory = async (req, res) => {
  try {
    if (req.query.highlight === "true") {
      const story = await Story.findOne({ id: req.params.id });
      return res.send(story);
    }
    const story = await Story.findOne({
      $and: [
        { id: req.params.id },
        { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    });
    res.send(story);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.userStory = async (req, res) => {
  try {
    const stories = await Story.find({
      $and: [
        { owner: req.params.uid },
        { createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    });
    res.send(stories);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.newStory = async (req, res) => {
  try {
    const newStory = new Story({
      id: id(),
      owner: req.user._id,
      data: req.body.data,
      seen: [],
    });
    const story = await newStory.save();
    res.send(story);
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addSeen = async (req, res) => {
  try {
    const story = await Story.findOne({ id: req.params.id });
    if (story.id === req.user._id)
      return res.send({ success: false, message: "Unsupported" });
    if (story?.seen?.includes(req.user._id))
      return res.send({ success: false, message: "Unsupported" });
    Story.updateOne(
      { id: req.params.id },
      { $push: { seen: req.user._id } }
    ).then(() => {
      res.send({
        success: true,
        message: "done",
      });
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.homeStory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    
    // Get current user's stories
    const userStories = await Story.find({
      owner: userId,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).populate('owner', 'username avatar');

    // Get stories from followings
    const followingStories = await Story.find({
      owner: { $in: user.followings },
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).populate('owner', 'username avatar');

    // Group stories by owner
    const storiesByOwner = new Map();
    
    // Add user's own stories if they exist
    if (userStories.length > 0) {
      storiesByOwner.set(userId.toString(), userStories);
    }

    // Add following's stories
    followingStories.forEach(story => {
      const ownerId = story.owner._id.toString();
      if (!storiesByOwner.has(ownerId)) {
        storiesByOwner.set(ownerId, []);
      }
      storiesByOwner.get(ownerId).push(story);
    });

    // Convert map to array and sort by latest story
    const allStories = Array.from(storiesByOwner.values())
      .sort((a, b) => {
        const latestA = Math.max(...a.map(s => new Date(s.createdAt)));
        const latestB = Math.max(...b.map(s => new Date(s.createdAt)));
        return latestB - latestA;
      });

    console.log('Sending stories:', allStories);
    res.send(allStories);
  } catch (err) {
    console.error('Error in homeStory:', err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// addHighlight

// removeHighlight

// viewHighlight
