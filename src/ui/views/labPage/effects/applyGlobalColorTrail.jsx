import {COLOR_PALETTE} from '../constants';

export const applyGlobalColorTrail = (ctx, canvas, offsetX, offsetY, dragVelocityX, dragVelocityY, effectStrength, isGridMode = false) => {
    // Completely disable global color trail in grid mode
    if (isGridMode) return;

    const velocityMagnitude = Math.sqrt(dragVelocityX * dragVelocityX + dragVelocityY * dragVelocityY);

    // Don't apply the effect if the speed is too low
    if (velocityMagnitude < 0.3) return;

    // Calculate the offset direction (opposite to the direction of movement)
    const dirX = dragVelocityX !== 0 ? -Math.sign(dragVelocityX) : 0;
    const dirY = dragVelocityY !== 0 ? -Math.sign(dragVelocityY) : 0;

    // Reduce the offset amplitude as requested
    // Smaller offset but still proportional to speed
    const shiftAmount = Math.max(5, Math.min(15, velocityMagnitude * 0.8));

    // Store the current state of the entire canvas
    const originalCanvas = document.createElement('canvas');
    originalCanvas.width = canvas.width;
    originalCanvas.height = canvas.height;
    const originalCtx = originalCanvas.getContext('2d');
    originalCtx.drawImage(canvas, 0, 0);

    // Create two copies for the colored versions (purple and green)
    const purpleCanvas = document.createElement('canvas');
    purpleCanvas.width = canvas.width;
    purpleCanvas.height = canvas.height;
    const purpleCtx = purpleCanvas.getContext('2d');

    const greenCanvas = document.createElement('canvas');
    greenCanvas.width = canvas.width;
    greenCanvas.height = canvas.height;
    const greenCtx = greenCanvas.getContext('2d');

    // Copy the original canvas state to both colored versions
    purpleCtx.drawImage(originalCanvas, 0, 0);
    greenCtx.drawImage(originalCanvas, 0, 0);

    // Apply a more pronounced purple tint to the first copy
    purpleCtx.globalCompositeOperation = 'overlay';
    purpleCtx.fillStyle = COLOR_PALETTE.accent1; // Purple
    purpleCtx.fillRect(0, 0, canvas.width, canvas.height);
    // Second pass to intensify the color
    purpleCtx.fillRect(0, 0, canvas.width, canvas.height);
    purpleCtx.globalCompositeOperation = 'source-over';

    // Apply a more pronounced green tint to the second copy
    greenCtx.globalCompositeOperation = 'overlay';
    greenCtx.fillStyle = COLOR_PALETTE.accent3; // Green
    greenCtx.fillRect(0, 0, canvas.width, canvas.height);
    // Second pass to intensify the color
    greenCtx.fillRect(0, 0, canvas.width, canvas.height);
    greenCtx.globalCompositeOperation = 'source-over';

    // Clear the original canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the offset versions first
    ctx.globalCompositeOperation = 'lighter';

    // Increase opacity as requested
    // Purple version offset in the direction opposite to movement
    ctx.globalAlpha = Math.min(0.85, effectStrength * 0.85); // Higher opacity
    ctx.drawImage(
        purpleCanvas,
        dirX * shiftAmount * (Math.abs(dragVelocityX) / (velocityMagnitude + 0.001)),
        dirY * shiftAmount * (Math.abs(dragVelocityY) / (velocityMagnitude + 0.001))
    );

    // Green version offset in the opposite direction (but slightly different)
    ctx.globalAlpha = Math.min(0.85, effectStrength * 0.85); // Higher opacity
    ctx.drawImage(
        greenCanvas,
        -dirX * shiftAmount * 0.7 * (Math.abs(dragVelocityX) / (velocityMagnitude + 0.001)),
        -dirY * shiftAmount * 0.7 * (Math.abs(dragVelocityY) / (velocityMagnitude + 0.001))
    );

    // Finally, draw the original version on top with slight transparency
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.85; // Slightly more opaque for a more subtle effect
    ctx.drawImage(originalCanvas, 0, 0);

    // Reset context parameters
    ctx.globalAlpha = 1.0;
};