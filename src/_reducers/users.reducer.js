import { userConstants } from '../_constants';
var initialState = {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedUser: null,
  }
  
export function users(state = initialState, action) {
    switch (action.type) {
        case userConstants.GETALL_REQUEST:
            return {
                ...state
            };
        case userConstants.GETALL_SUCCESS:
            return {
                ...state,
                allData: action.users.allData,
            };
        case userConstants.GETALL_FAILURE:
            return {
                ...state
            };
        case userConstants.GETSORTED_REQUEST:
            return {
                ...state
            };
        case userConstants.GETSORTED_SUCCESS:
            return {
                ...state,
                data: action.users.data,
                total: action.users.totalPages,
                params: action.users.params,
            };
        case userConstants.GETSORTED_FAILURE:
            return {
                ...state,
            };
        case userConstants.RESET_REQUEST:
            return {
                loading: true
            };
        case userConstants.RESET_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.response
            };
        case userConstants.RESET_FAILURE:
            return {
                error: action.error
            };
        case userConstants.RANKUPDATE_REQUEST:
            return {

            }
        case userConstants.RANKUPDATE_SUCCESS:
            return {
                error: action.response
            };
        case userConstants.RANKUPDATE_FAILURE:
            return {
                error: action.error          
            };
        case userConstants.ADDNEW_REQUEST:
            return {
                ...state
            };
        case userConstants.ADDNEW_SUCCESS:
            return {
                ...state
            };
        case userConstants.ADDNEW_FAILURE:
            return {
                ...state
            };
        default:
            return state
    }
}