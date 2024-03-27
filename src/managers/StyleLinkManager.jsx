const StyleLinkManager = (style) => {
    switch (style) {
        case 1:
            return 'PrimaryLink';
        case 2:
            return 'SecondaryLink';
        case 3:
            return 'TertiaryLink';
        default:
            return '';
    }
};
export default StyleLinkManager;