import axios from 'axios';
// import { setAlert } from './alert';
import { 
  GET_PROFILE, 
  PROFILE_ERROR 
} from './types';

// Get current user profile
export const getCurrentProfile = () => async dispatch => {

  try {
    
    const rest = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      data: rest.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      data: { msg: err.response.statusText, status: err.response.status }
    });
  }

}
