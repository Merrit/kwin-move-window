const Position = Object.freeze({
    Center: Symbol("center"), /** Center of the screen. */
    TopLeft: Symbol("top-left"), /** North-West corner of the screen. */
    TopCenter: Symbol("top-center"), /** North centered portion of the screen. */
    TopRight: Symbol("top-right"), /** North-East corner of the screen. */
    CenterRight: Symbol("center-right"), /** East centered portion of the screen. */
    BottomRight: Symbol("bottom-right"), /** South-East corner of the screen. */
    BottomCenter: Symbol("bottom-center"), /** South centered portion of the screen. */
    BottomLeft: Symbol("bottom-left"), /** South-West corner of the screen. */
    CenterLeft: Symbol("center-left"), /** West centered portion of the screen. */
});

function moveWindow(client, position) {
    var clientGeometry = client.frameGeometry;
    var area = workspace.clientArea(KWin.MaximizeArea, client);
    var areaCenterX = area.width / 2;
    var areaCenterY = area.height / 2;

    var positionX;
    var positionY;

    switch (position) {
        case Position.Center:
            positionX = areaCenterX - (clientGeometry.width / 2);
            positionY = areaCenterY - (clientGeometry.height / 2);
            break;
        case Position.TopLeft:
            positionX = area.left;
            positionY = area.top;
            break;
        case Position.TopCenter:
            positionX = areaCenterX - (clientGeometry.width / 2);
            positionY = area.top;
            break;
        case Position.TopRight:
            positionX = area.right - clientGeometry.width;
            positionY = area.top;
            break;
        case Position.CenterRight:
            positionX = area.right - clientGeometry.width;
            positionY = areaCenterY - (clientGeometry.height / 2);
            break;
        case Position.BottomRight:
            positionX = area.right - clientGeometry.width;
            positionY = area.bottom - clientGeometry.height;
            break;
        case Position.BottomCenter:
            positionX = areaCenterX - (clientGeometry.width / 2);
            positionY = area.bottom - clientGeometry.height;
            break;
        case Position.BottomLeft:
            positionX = area.left;
            positionY = area.bottom - clientGeometry.height;
            break;
        case Position.CenterLeft:
            positionX = area.left;
            positionY = areaCenterY - (clientGeometry.height / 2);
            break;
    }

    client.frameGeometry = {
        x: positionX,
        y: positionY,
        height: clientGeometry.height,
        width: clientGeometry.width,
    }
};

function runScript(position) {
    var client = workspace.activeClient;

    var intendedScreen = client.screen;

    moveWindow(client, position);

    // There is a strange bug sometimes where moving the window to the 
    // top or bottom of the screen moves it to a different screen.
    // This works around the bug by moving the window to the correct position 
    // on whatever screen it ended up on, then moving it to the same 
    // relative position on the intended screen.
    if (client.screen != intendedScreen) {
        moveWindow(client, position);
        workspace.sendClientToScreen(client, intendedScreen);
    }
}

registerShortcut("Move Window to the Center", "Move Window to the Center", "Meta+Num+5", function () {
    runScript(Position.Center);
});

registerShortcut("Move Window to the Top-Left", "Move Window to the Top-Left", "Meta+Num+7", function () {
    runScript(Position.TopLeft);
});

registerShortcut("Move Window to the Top-Center", "Move Window to the Top-Center", "Meta+Num+8", function () {
    runScript(Position.TopCenter);
});

registerShortcut("Move Window to the Top-Right", "Move Window to the Top-Right", "Meta+Num+9", function () {
    runScript(Position.TopRight);
});

registerShortcut("Move Window to the Center-Right", "Move Window to the Center-Right", "Meta+Num+6", function () {
    runScript(Position.CenterRight);
});

registerShortcut("Move Window to the Bottom-Right", "Move Window to the Bottom-Right", "Meta+Num+3", function () {
    runScript(Position.BottomRight);
});

registerShortcut("Move Window to the Bottom-Center", "Move Window to the Bottom-Center", "Meta+Num+2", function () {
    runScript(Position.BottomCenter);
});

registerShortcut("Move Window to the Bottom-Left", "Move Window to the Bottom-Left", "Meta+Num+1", function () {
    runScript(Position.BottomLeft);
});

registerShortcut("Move Window to the Center-Left", "Move Window to the Center-Left", "Meta+Num+4", function () {
    runScript(Position.CenterLeft);
});
