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

const spiral = (function () {

    const calculatedPrimes = [2, 3, 5, 7, 11, 13, 13, 17, 19, 23, 25, 29, 31, 37, 41, 43, 47, 49, 53, 59, 61, 67,
        71, 73, 79], showNumbersLimit = 20, scrollFactor = 1 / 5;
    let currentChecked = 79, gridSize = 80, scrollGridSize = 80, grid;

    const nextPrimes = () => {
        const isPrime = (_n) => {
            for (let eachPrime of calculatedPrimes) {
                if (eachPrime >= Math.sqrt(_n))
                    return true;
                if (_n % eachPrime === 0)
                    return false;
            }
            return true;
        };
        while (currentChecked <= scrollGridSize) {
            if (isPrime(currentChecked))
                calculatedPrimes.push(currentChecked);
            currentChecked += 1;
        }
    };

    const getHTMLFromGrid = () => {
        let _html = "";
        for (let rowInd = 0; rowInd < grid.length; rowInd++) {
            const row = grid[rowInd];
            let rowHtml = "";
            for (let colInd = 0; colInd < row.length; colInd++) {
                let value = grid[rowInd][colInd], showValue = value + "",
                    classNames = "block ", colorStyle = "";
                if (value === 0) classNames += "grey ";
                else if (calculatedPrimes.indexOf(value) !== -1) classNames += "olive ";
                else classNames += "black ";
                if (grid.length > showNumbersLimit) showValue = "";
                rowHtml += "<div " + colorStyle + " title='" + value + "' id='" + rowInd + "," + colInd + "'" +
                    " class='" + classNames + "'>" + showValue + "</div>";
            }
            _html += "<div class='rowBlock'>" + rowHtml + "</div>";
        }
        return "<div class='root-grid'>" + _html + "</div>";
    };

    const resetGrid = () => {
        grid = gridMaker.createGrid(gridSize);
        spiral.render();
    };

    const updateGridSize = (_e) => {
        let delta = Math.floor(_e.deltaY * scrollFactor), diffReached, percent, sizeDiffToReach, prevSize, nextSize;
        scrollGridSize += delta;
        if (scrollGridSize < 8) {
            // revert and return
            scrollGridSize -= delta;
            return;
        }
        if (scrollGridSize >= gridSize) {
            nextSize = gridSize + (grid.length * 4) + 4;
            sizeDiffToReach = nextSize - gridSize;
            diffReached = scrollGridSize - gridSize;
        } else {
            prevSize = grid[grid.length - 2][grid.length - 2];
            sizeDiffToReach = gridSize - prevSize;
            diffReached = prevSize - scrollGridSize;
        }
        percent = (diffReached / sizeDiffToReach) * 100;
        if (percent < 0) percent = 0; else if (percent > 100) percent = 100;
        $("#scroll-progress").progress({percent});
        nextPrimes();
        if (scrollGridSize >= nextSize) {
            gridSize = nextSize;
            resetGrid();
        } else if (scrollGridSize < gridSize) {
            gridSize = prevSize;
            resetGrid();
        }
        return false;
    };

    const registerListeners = () => {
        document.getElementById("root").onwheel = updateGridSize;
        $("#scroll-progress").progress({percent: 0});
    };

    return {
        init: () => {
            registerListeners();
            grid = gridMaker.createGrid(gridSize);
            spiral.render();
        },
        render: () => {
            document.getElementById("root").innerHTML = getHTMLFromGrid();
            let rootEle = document.getElementsByClassName("root-grid")[0];
            rootEle.setAttribute("style", "height: " + rootEle.clientWidth + "px");
        },
    };

})();




