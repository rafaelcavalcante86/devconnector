import { GET_PROFILE, CLEAR_PROFILE, PROFILE_ERROR } from "../actions/types";

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
      return {
        ...state,
        profile: data,
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
    default : 
      return state;
  }

}