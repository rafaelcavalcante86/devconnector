import { GET_PROFILE, GET_PROFILES, UPDATE_PROFILE, CLEAR_PROFILE, PROFILE_ERROR, GET_REPOS } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  errors: {}
};

export default function(state = initialState, action) {

  const { type, data } = action;

  switch(type) {
    case GET_PROFILE :
    case UPDATE_PROFILE :
      return {
        ...state,
        profile: data,
        loading: false
      };
    case GET_PROFILES :
      return {
        ...state,
        profiles: data,
        loading: false
      };
    case CLEAR_PROFILE :
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    case PROFILE_ERROR :
        return {
          ...state,
          error: data,
          loading: false
        };
    case GET_REPOS :
      return {
        ...state,
        repos: data,
        loading: false
      };
    default : 
      return state;
  }

}