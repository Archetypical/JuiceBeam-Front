var initialState = {
    data: [],
    total: 1,
    params: {},
    allData: []
  }

export function videos(state = initialState, action) {
    switch (action.type) {
        case "GETVIDEOS_SUCCESS": 
            return {             
                data: action.videos.data,
                params: action.videos.params,
                allData: action.videos.allData,
                total: action.videos.total,
            }
        case "GETVIDEOS_FAILURE":
            return { state }
        default:
            return state
    }
}



