let profile = (state = "123", action = null) => {
    switch (action.type) {
        case "test":
            return state + 1;
        default:
            return state;
    }
}
export default profile;