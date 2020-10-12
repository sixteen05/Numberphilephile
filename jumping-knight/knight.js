/**
 * Created By : Lalit Umbarkar
 * Created On : 11/10/20
 */

const gridMaker = (function () {

    let grid = [[0]];

    const initializeGrid = (_size) => {
        let _val = 1, currentPos = [0, 0];
        while (_val < _size) {
            _val = goUpNewRound(currentPos[0], currentPos[1], _val);
            _val = goLeft(0, grid[0].length - 2, _val);
            _val = goDown(1, 0, _val);
            _val = goRight(grid.length - 1, 1, _val);
            currentPos = [Math.floor(grid.length / 2), grid[0].length - 1];
        }
        return grid;
    };

    const goUpNewRound = (initI, initJ, _val) => {
        for (let _j = initJ; _j >= 0; _j--, _val++) {
            grid[_j].push(_val);
        }
        grid = [grid[0].map(_ => 0), ...grid];
        grid[0][grid[0].length - 1] = _val;
        return _val + 1;
    };

    const goLeft = (initI, initJ, _val) => {
        for (let _j = initJ; _j >= 0; _j--, _val++) {
            grid[0][_j] = _val;
        }
        grid = grid.map(row => [0, ...row]);
        grid[0][0] = _val++;
        return _val;
    };

    const goDown = (initI, initJ, _val) => {
        for (let _i = initI; _i < grid.length; _i++, _val++) {
            grid[_i][0] = _val;
        }
        grid.push(grid[grid.length - 1].map(_ => 0));
        grid[grid.length - 1][0] = _val++;
        return _val;
    };

    const goRight = (initI, initJ, _val) => {
        for (let _j = initJ; _j < grid[0].length; _j++, _val++) {
            grid[initI][_j] = _val;
        }
        return _val;
    };

    return {
        createGrid: (_size) => {
            grid = [[0]];
            return initializeGrid(_size);
        }
    }
})();

const jumper = (function () {

    const limit = 130;
    let currentPos, intervalId, lastPos,
        grid, visitedPoints = [];

    const getValidJumps = (posI, posJ) => {
        const isValidPos = (_i, _j) => {
            return _i >= 0 && _i < grid.length && _j >= 0 && _j < grid[_i].length;
        }
        return [
            [posI + 2, posJ - 1], [posI + 2, posJ + 1],
            [posI - 2, posJ - 1], [posI - 2, posJ + 1],
            [posI + 1, posJ + 2], [posI - 1, posJ + 2],
            [posI + 1, posJ - 2], [posI - 1, posJ - 2],
        ]
            .filter(_pos => isValidPos(_pos[0], _pos[1]))
            .filter(_pos => visitedPoints.indexOf(grid[_pos[0]][_pos[1]]) === -1);
    };

    const nextJump = () => {
        if (!currentPos) {
            currentPos = [Math.floor(grid.length / 2), Math.floor(grid[0].length / 2)]
            visitedPoints.push(grid[currentPos[0]][currentPos[1]]);
            jumper.render();
            return;
        }
        const allValidJumps = getValidJumps(currentPos[0], currentPos[1]);
        if (!allValidJumps.length) {
            console.error("No more valid jumps");
            lastPos = currentPos;
            if (intervalId)
                clearInterval(intervalId);
            jumper.render();
            return;
        }
        let minValue, nextJumpPos;
        for (let jumpPos of allValidJumps) {
            let _val = grid[jumpPos[0]][jumpPos[1]];
            if (!minValue || minValue > _val) {
                minValue = _val;
                nextJumpPos = jumpPos;
            }
        }
        currentPos = nextJumpPos;
        visitedPoints.push(minValue);
        jumper.render();
    };

    const getHTMLFromGrid = () => {
        let _html = "";
        for (let rowInd = 0; rowInd < grid.length; rowInd++) {
            const row = grid[rowInd];
            let rowHtml = "";
            for (let colInd = 0; colInd < row.length; colInd++) {
                let value = grid[rowInd][colInd],
                    classNames = "block ";
                if (lastPos && lastPos[0] === rowInd && lastPos[1] === colInd)
                    classNames += "red ";
                else
                    classNames += visitedPoints.indexOf(value) === -1 ? "black" : "olive";
                rowHtml += "<div id='" + rowInd + "," + colInd + "' class='" + classNames + "'>" + "</div>";
            }
            _html += "<div class='rowBlock'>" + rowHtml + "</div>";
        }
        return "<div class='root-grid'>" + _html + "</div>";
    };

    const registerListeners = () => {
        document.getElementById("next-trigger").onclick = nextJump;
        document.getElementById("auto-trigger").onclick = () => {
            if (intervalId)
                clearInterval(intervalId);
            else
                intervalId = setInterval(nextJump, 450);
        };
        document.getElementById("reset-grid").onclick = () => {
            if (intervalId)
                clearInterval(intervalId);
            visitedPoints = [];
            grid = gridMaker.createGrid(limit);
            lastPos = null;
            jumper.render();
        };
    };

    return {
        init: () => {
            registerListeners();
            grid = gridMaker.createGrid(limit);
            jumper.render();
        },
        render: () => {
            document.getElementById("root").innerHTML = getHTMLFromGrid();
            let rootEle = document.getElementsByClassName("root-grid")[0];
            rootEle.setAttribute("style", "height:" + rootEle.clientWidth + "px");
        },
    };

})();




