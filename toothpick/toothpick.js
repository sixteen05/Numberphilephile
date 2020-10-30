/**
 * Created By : Lalit Umbarkar
 * Created On : 11/10/20
 */

const toothpick = (function () {

    const oliveColor = "#b5cc18", blackColor = "#1b1c1d", greyColor = "#767676", pickWidth = 1, pickHeight = 100;
    let ctx, visitedPicks = [], latestVertical = [], latestHorizontal = [];

    const addEdgeToothpicks = () => {

        let halfDiff = pickHeight / 2,
            previousVerticals = [...latestVertical],
            previousHorizontal = [...latestHorizontal];
        latestVertical = [];
        latestHorizontal = [];
        while (previousVerticals.length) {
            let eachPick = previousVerticals.pop(),
                ex = eachPick[0], ey = eachPick[1],
                abovePick = [ex, ey - halfDiff],
                belowPick = [ex, ey + halfDiff];
            if (visitedPicks.indexOf(abovePick) === -1)
                drawHorizontalToothpick(...abovePick);
            if (visitedPicks.indexOf(belowPick) === -1)
                drawHorizontalToothpick(...belowPick);
        }
        while (previousHorizontal.length) {
            let eachPick = previousHorizontal.pop(),
                ex = eachPick[0], ey = eachPick[1],
                leftPick = [ex - halfDiff, ey],
                rightPick = [ex + halfDiff, ey];
            if (visitedPicks.indexOf(leftPick) === -1)
                drawVerticalToothpick(...leftPick);
            if (visitedPicks.indexOf(rightPick) === -1)
                drawVerticalToothpick(...rightPick);
        }
    };

    const getColorInd = (x, y) => {
        let imageData = ctx.getImageData(x, y, 1, 1).data;
        return "#" + ("000000" + rgbToHex(imageData[0], imageData[1], imageData[2])).slice(-6);
    }

    const rgbToHex = (r, g, b) => {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    const drawVerticalToothpick = (cx, cy) => {
        ctx.fillStyle = oliveColor;
        console.log("vc", cx, cy, pickWidth, pickHeight,);
        console.log("color", getColorInd(cx - pickWidth, cy), getColorInd(cx + pickWidth, cy));
        ctx.fillRect(cx, cy - (pickHeight / 2), pickWidth, pickHeight);
        latestVertical.push([cx, cy]);
        visitedPicks.push([cx, cy]);
    };

    const drawHorizontalToothpick = (cx, cy) => {
        ctx.fillStyle = greyColor;
        console.log("hc", cx, cy, pickWidth, pickHeight);
        console.log("color", getColorInd(cx, cy - pickWidth), getColorInd(cx, cy + pickWidth));
        ctx.fillRect(cx - (pickHeight / 2), cy, pickHeight, pickWidth);
        latestHorizontal.push([cx, cy]);
        visitedPicks.push([cx, cy]);
    };

    const resetAndKeepOneToothpick = () => {
        if (!ctx) {
            console.error("Context not setup");
            return;
        }

        visitedPicks = [];
        latestVertical = [];
        latestHorizontal = [];
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        ctx.fillStyle = blackColor;
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        drawVerticalToothpick(ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2);
    };

    const registerListeners = () => {
        document.getElementById("reset-grid").onclick = resetAndKeepOneToothpick;
        document.getElementById("next-trigger").onclick = addEdgeToothpicks;
    };

    return {
        init: () => {
            registerListeners();
            // let rootEle = document.getElementsByClassName("root-grid")[0];
            // rootEle.setAttribute("style", "height: " + rootEle.clientWidth + "px");
            const canvas = document.getElementById("root");
            let cH = canvas.parentElement.clientHeight, cW = canvas.parentElement.clientWidth,
                smallerDimension = cW > cH ? cW : cH;
            canvas.setAttribute("height", smallerDimension + "px");
            canvas.setAttribute("width", smallerDimension + "px");
            if (canvas.getContext)
                ctx = canvas.getContext('2d');
            resetAndKeepOneToothpick();
        },
    };

})();




