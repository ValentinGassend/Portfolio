const IsMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const IsWidthLessThanOrEqualToHeight = () => {
    return window.innerWidth <= window.innerHeight;
};

export { IsMobile, IsWidthLessThanOrEqualToHeight };