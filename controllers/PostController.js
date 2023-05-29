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
    console.log(error);
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
    console.log(error);
    res.status(500).json({
      message: "Couldn't get articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(postId);
    const { error, doc } = await PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).then((error, doc) => {
      console.log(doc);
      if (error) {
        return res.status(500).json({
          message: error,
        });
      }
      if (!doc) {
        console.log("123");

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
