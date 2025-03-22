export const drawImageWithColorTrail = (ctx, image, x, y, width, height, velocity, opacity, isGridMode = false) => {
    // Disable trail effect completely in grid mode
    if (isGridMode) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(image.canvas, x, y, width, height);
        return;
    }

    const velocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

    // If speed is too low, just draw the image without effect
    if (velocityMagnitude < 0.3) {
        ctx.globalAlpha = opacity;
        ctx.drawImage(image.canvas, x, y, width, height);
        return;
    }

    // Adjust effect strength based on parallax factor
    // The closer an element is to the camera (parallaxFactor close to 1),
    // the more pronounced its trail effect is
    const effectMultiplier = (image.parallaxFactor - 0.7) / 0.3; // Normalize between 0 and 1

    // Calculate the offset direction (opposite to the direction of movement)
    const dirX = velocity.x !== 0 ? -Math.sign(velocity.x) : 0;
    const dirY = velocity.y !== 0 ? -Math.sign(velocity.y) : 0;

    // Effect strength based on speed and depth
    const effectStrength = Math.min(velocityMagnitude / 10, 1.5) * effectMultiplier;

    // Adjust trail amplitude based on depth
    const trailOffset = Math.max(10, Math.min(50, velocityMagnitude * 2.0 * effectMultiplier));

    // 1. Calculate dimensions and positions of trails (larger than the image)
    // Purple trail
    const purpleTrailX = x + dirX * trailOffset * (Math.abs(velocity.x) / (velocityMagnitude + 0.001));
    const purpleTrailY = y + dirY * trailOffset * (Math.abs(velocity.y) / (velocityMagnitude + 0.001));
    // Enlarge the trail relative to the image
    const trailWidthFactor = 1.2 + effectStrength * 0.3; // Up to 50% wider
    const trailHeightFactor = 1.2 + effectStrength * 0.3; // Up to 50% taller
    const purpleTrailWidth = width * trailWidthFactor;
    const purpleTrailHeight = height * trailHeightFactor;

    // Green trail (in the opposite direction)
    const greenTrailX = x - dirX * trailOffset * 0.7 * (Math.abs(velocity.x) / (velocityMagnitude + 0.001));
    const greenTrailY = y - dirY * trailOffset * 0.7 * (Math.abs(velocity.y) / (velocityMagnitude + 0.001));
    const greenTrailWidth = width * (trailWidthFactor - 0.1); // Slightly different
    const greenTrailHeight = height * (trailHeightFactor - 0.1);

    // 2. Draw colored trails first
    ctx.globalCompositeOperation = 'lighter';

    // Purple trail
    ctx.globalAlpha = Math.min(effectStrength * 0.9, 0.8) * opacity;
    // Use a transformation to correctly center the enlarged trail
    ctx.save();
    ctx.translate(purpleTrailX + width / 2, purpleTrailY + height / 2);
    ctx.scale(trailWidthFactor, trailHeightFactor);
    ctx.drawImage(
        image.redSplitCanvas,
        -width / 2,
        -height / 2,
        width,
        height
    );
    ctx.restore();

    // Green trail
    ctx.globalAlpha = Math.min(effectStrength * 0.9, 0.8) * opacity;
    ctx.save();
    ctx.translate(greenTrailX + width / 2, greenTrailY + height / 2);
    ctx.scale(trailWidthFactor - 0.1, trailHeightFactor - 0.1);
    ctx.drawImage(
        image.greenSplitCanvas,
        -width / 2,
        -height / 2,
        width,
        height
    );
    ctx.restore();

    // 3. Draw the main image on top
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = opacity;
    ctx.drawImage(image.canvas, x, y, width, height);
};