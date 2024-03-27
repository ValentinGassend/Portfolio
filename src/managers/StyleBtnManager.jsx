const StyleBtnManager = (style) => {
    switch (style) {
        case 1:
            return 'PrimaryBtn';
        case 2:
            return 'SecondaryBtn';
        case 3:
            return 'TertiaryBtn';
        default:
            return '';
    }
};
export default StyleBtnManager;