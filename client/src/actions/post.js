import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, GET_POST, ADD_POST, DELETE_POST, POST_ERROR, UPDATE_LIKES, ADD_COMMENT, REMOVE_COMMENT } from './types';

// Get posts
export const getPosts = () => async dispatch => {
  try {

    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      data: res.data
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get post
export const getPost = postId => async dispatch => {
  try {

    const res = await axios.get(`/api/posts/${postId}`);

    dispatch({
      type: GET_POST,
      data: res.data
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add like
export const addLike = postId => async dispatch => {
  try {

    const res = await axios.put(`/api/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      data: { postId, likes: res.data }
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove like
export const removeLike = postId => async dispatch => {
  try {

    const res = await axios.put(`/api/posts/unlike/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      data: { postId, likes: res.data }
    });

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add post
export const addPost = formData => async dispatch => {

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {

    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ADD_POST,
      data: res.data
    });

    dispatch(setAlert('Post created', 'success'));

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete post
export const deletePost = postId => async dispatch => {
  try {

    const res = await axios.delete(`/api/posts/${postId}`);

    dispatch({
      type: DELETE_POST,
      data: postId
    });

    dispatch(setAlert('Post removed', 'success'));

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {

    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

    dispatch({
      type: ADD_COMMENT,
      data: res.data
    });

    dispatch(setAlert('Comment added', 'success'));

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {

    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      data: commentId
    });

    dispatch(setAlert('Comment removed', 'success'));

  } catch (err) {
    dispatch({
      type: POST_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
