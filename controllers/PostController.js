import PostSchema from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = await PostSchema({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't create article",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't get articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Can't find",
        });
      }
      res.json(doc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get articles",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostSchema.findOneAndDelete({
      _id: postId,
    }).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Can't find",
        });
      }
      res.json({ success: true });
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: postId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Couldn't edit article",
    });
  }
};
