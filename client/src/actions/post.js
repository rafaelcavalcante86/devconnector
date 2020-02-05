import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR } from './types';

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