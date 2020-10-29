/**
 * Created By : Lalit Umbarkar
 * Created On : 11/10/20
 */

const toothpick = (function () {

    const getHTMLFromGrid = () => {
        return "<div class='root-grid'>" + "</div>";
    };

    const resetGrid = () => {
        toothpick.render();
    };

    const registerListeners = () => {
    };

    return {
        init: () => {
            registerListeners();
            toothpick.render();
        },
        render: () => {
            document.getElementById("root").innerHTML = getHTMLFromGrid();
            let rootEle = document.getElementsByClassName("root-grid")[0];
            rootEle.setAttribute("style", "height: " + rootEle.clientWidth + "px");
        },
    };

})();




