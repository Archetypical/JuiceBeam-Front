var initialState = {
    api: {},
    accounts: {},
    videoParam: {},
    eventParam: {},
  }

export function admin(state = initialState, action) {
    switch (action.type) {
        case "GETSETTINGS_SUCCESS": 
            return {      
                ...state,    
                api: action.settings.api,
                accounts: action.settings.accounts,
                videoParam: action.settings.videoParam,
                eventParam: action.settings.eventParam,
            }
        case "GETSETTINGS_FAILURE":
            return { state }
        default:
            return state
    }
}



