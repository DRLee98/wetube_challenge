import routes from "../routes";
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

// Home

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// Search

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location  },
  } = req;
  const newVideo = await Video.create({
    fileUrl: location ,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

// Video Detail

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate({path: "comments" ,populate: {path: "creator"}})
      .populate("creator");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Edit Video

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
    user: { id: userId }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== userId) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (req.user.id !== video.creator.toString()) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ id });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
  } = req;
  try {
    const video = await Video.findById(id);
    const user = await User.findById(req.user.id);
    const newComment = await Comment.create({
      text: comment,
      creator: req.user.id,
      video: video.id
    });
    user.comments.push(newComment.id);
    video.comments.push(newComment.id);
    user.save();
    video.save();
    const sendComment = await Comment.findById(newComment.id).populate("creator");
    res.json(sendComment);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postRemoveComment = async (req, res) => {
  const {
    params: { id },
    user
  } = req;
  try{
    const comment = await Comment.findById(id).populate("video").populate("creator");
    if(user.id === comment.creator.id.toString() || user.id === comment.video.creator.toString()){
      const { creator: { comments: userComments, id: userId }, video: { comments: videoComments, id: videoId } } = comment
      const updateUser = userComments.filter(c => c.toString() !== id);
      const updateVideo = videoComments.filter(c => c.toString() !== id);
      await User.findByIdAndUpdate(userId, {comments: updateUser});
      await Video.findByIdAndUpdate(videoId, {comments: updateVideo});
      await Comment.findByIdAndRemove(id);
    } else {
      throw Error
    }
  }catch(error){
    console.log(error);
    res.status(400);
  }finally{
    res.end();
  }
}