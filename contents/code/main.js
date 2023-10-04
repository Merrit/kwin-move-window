/**
 * An enumeration of the possible positions to move a window to.
 * 
 * The available positions are the eight cardinal and intercardinal 
 * directions on the screen, plus the center of the screen.
 * 
 * The positions are relative to the screen, not the window.
 */
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

/**
 * Moves the window to the specified position on the screen.
 * @param {Client} client The window to move.
 * @param {Position} position The position to move the window to.
 * @returns {void}
 */
function moveWindow(client, position) {
    print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    print(`Beginning window move to ${position.toString()}.`);
    
    /** @type {Rect} */
    var clientGeometry = new Rect(
        client.geometry.x,
        client.geometry.y,
        client.geometry.width,
        client.geometry.height,
        client.geometry.x,
        client.geometry.x + client.geometry.width,
        client.geometry.y,
        client.geometry.y + client.geometry.height
    );

    var kwinClientArea = workspace.clientArea(KWin.MaximizeArea, client);

    /** @type {Rect} */
    var area = new Rect(
        kwinClientArea.x,
        kwinClientArea.y,
        kwinClientArea.width,
        kwinClientArea.height,
        kwinClientArea.left,
        kwinClientArea.right,
        kwinClientArea.top,
        kwinClientArea.bottom
    );

    print("clientGeometry: " + clientGeometry.toString());
    print("area: " + area.toString());
    print("areaCenterX: " + area.centerX);
    print("areaCenterY: " + area.centerY);
    print("clientCenterX: " + clientGeometry.centerX);
    print("clientCenterY: " + clientGeometry.centerY);

    /** @type {number} */
    var positionX;
    /** @type {number} */
    var positionY;

    switch (position) {
        case Position.Center:
            positionX = area.centerX - (clientGeometry.width / 2);
            positionY = area.centerY - (clientGeometry.height / 2);
            break;
        case Position.TopLeft:
            positionX = area.left;
            positionY = area.top;
            break;
        case Position.TopCenter:
            positionX = area.centerX - (clientGeometry.width / 2);
            positionY = area.top;
            break;
        case Position.TopRight:
            positionX = area.right - clientGeometry.width;
            positionY = area.top;
            break;
        case Position.CenterRight:
            positionX = area.right - clientGeometry.width;
            positionY = area.centerY - (clientGeometry.height / 2);
            break;
        case Position.BottomRight:
            positionX = area.right - clientGeometry.width;
            positionY = area.bottom - clientGeometry.height;
            break;
        case Position.BottomCenter:
            positionX = area.centerX - (clientGeometry.width / 2);
            positionY = area.bottom - clientGeometry.height;
            break;
        case Position.BottomLeft:
            positionX = area.left;
            positionY = area.bottom - clientGeometry.height;
            break;
        case Position.CenterLeft:
            positionX = area.left;
            positionY = area.centerY - (clientGeometry.height / 2);
            break;
    }

    print("positionX: " + positionX);
    print("positionY: " + positionY);

    client.frameGeometry = {
        x: Math.round(positionX),
        y: Math.round(positionY),
        height: clientGeometry.height,
        width: clientGeometry.width,
    };
}

/* 
    * A rectangle with the following properties:
    * x: The x coordinate of the top-left corner of the client area.
    * y: The y coordinate of the top-left corner of the client area.
    * width: The width of the client area.
    * height: The height of the client area.
    * left: The x coordinate of the left edge of the client area.
    * right: The x coordinate of the right edge of the client area.
    * top: The y coordinate of the top edge of the client area.
    * bottom: The y coordinate of the bottom edge of the client area.
*/
class Rect {
    constructor(x, y, width, height, left, right, top, bottom) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    /* Returns a pretty json string representation of the rectangle. */
    toString() {
        return JSON.stringify(this, null, 2);
    }

    /* Returns the x coordinate of the center of the rectangle. */
    get centerX() {
        return this.x + (this.width / 2);
    }

    /* Returns the y coordinate of the center of the rectangle. */
    get centerY() {
        return this.y + (this.height / 2);
    }
}

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

/**
 * Prints a message to the console.
 * 
 * Other print methods are not showing up, so we are using console.info.
 * 
 * We are including a prefix to make it easier to find the messages.
 * 
 * Monitor output with:
 * $ journalctl -g "move-window:" -f
 * 
 * @param {string} message The message to print.
 * @returns {void}
 */
function print(message) {
    console.info("move-window: " + message);
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
