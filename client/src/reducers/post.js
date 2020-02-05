import { GET_POSTS, POST_ERROR } from '../actions/types'

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const {type, data} = action;

  switch(type){
    case GET_POSTS :
      return {
        ...state,
        posts: data,
        loading: false
      }
    case POST_ERROR :
      return {
        ...state,
        error: data,
        loading: false
      }
    default :
      return state;
  }
}