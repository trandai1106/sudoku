class People{
    constructor(name, point){
        this.name = name;
        this.life = 5;
        this.isLive= true;
        this.point = point;
    }
}

class Sudoku {
    constructor(container, mode = null, people, settings) {
        this.mode = mode;
        this.container = container;
        let peoplearr = [];
        this.people = [];
        console.log(people);
        console.log(this.people);
        util.each(people, (i, value)=>{
            let tmp = new People(value[0], Number(value[1]));
            console.log(tmp);
            this.people[i] = tmp;
        })
        //  = peoplearr;
        if (typeof container === 'string')
            this.container = document.querySelector(container);
        this.sect = []
        this.game = new Game(util.extend(defaultConfig, settings), this.people);
        this.container.appendChild(this.getGameBoard());
        this.data = []
    }
    getGameBoard() {
        return this.game.buildGUI();
    }
    start() {
        this.matrix = this.game.matrix.row;
       
        let arr = [],
            x = 0,
            values,
            rows = this.game.matrix.row,
            inputs = this.game.table.getElementsByTagName('input'),
            difficulties = {
                'easy': 40,
                'normal': 30,
                'hard': 20,
                'impossible': 10,
            };

        // Solve the game to get the solution
        this.game.solveGame(0, 0);

        util.each(rows, function(i, row) {
            util.each(row, function(r, val) {
                arr.push({
                    index: x,
                    value: val
                });
                x++;
            });
        });
        // console.log(arr);
        // Get random values for the start of the game
        // values = getUnique(arr, difficulties[this.game.config.difficulty() || this.mode]);
        values = [{index: 71, value: 7},
            {index: 75, value: 3},
            {index: 68, value: 4},
            {index: 15, value: 9},
            {index: 32, value: 1},
            {index: 66, value: 8},
            {index: 72, value: 6},
            {index: 77, value: 7},
            {index: 6, value: 7},
            {index: 45, value: 9},
            {index: 4, value: 2},
            {index: 16, value: 1},
            {index: 38, value: 6},
            {index: 35, value: 5},
            {index: 25, value: 5},
            {index: 23, value: 8},
            {index: 73, value: 9},
            {index: 79, value: 8},
            {index: 78, value: 1},
            {index: 63, value: 2},
            {index: 43, value: 7},
            {index: 20, value: 9},
            {index: 70, value: 6},
            {index: 48, value: 7},
            {index: 27, value: 3},
            {index: 44, value: 3},
            {index: 41, value: 5},
            {index: 21, value: 1},
            {index: 18, value: 4},
            {index: 53, value: 1},
            {index: 61, value: 4},
            {index: 42, value: 8},
            {index: 31, value: 8},
            {index: 39, value: 9},
            {index: 47, value: 8},
            {index: 9, value: 8},
            {index: 30, value: 2},
            {index: 55, value: 8},
            {index: 0, value: 5},
            {index: 7, value: 3}]
        // console.log(values);
        this.values = values;
        this.game.valuesMatrix = this.game.matrix.row;
        this.sect = this.game.matrix.sect;
        // Reset the game
        this.reset();

        util.each(values, function(i, data) {
            let input = inputs[data.index];
            let row = input.row,
                col = input.col;
            let sectRow = Math.floor(row / 3),
                sectCol = Math.floor(col / 3),
                secIndex = row % 3 * 3 + col % 3;
            cp[sectRow][sectCol][secIndex] = data.value;
            input.value = data.value;
            input.classList.add('disabled');
            input.classList.add('default');
            input.tabIndex = -1;
            triggerEvent(input, 'keyup');
        });
    }
    joinGame(matrix, valuesMatrix) {
        let arr = [],
            x = 0,
            values,
            rows = matrix,
            inputs = this.game.table.getElementsByTagName('input');

        // Solve the game to get the solution
        this.game.solveGame(0, 0);

        util.each(rows, function(i, row) {
            util.each(row, function(r, val) {
                arr.push({
                    index: x,
                    value: val
                });
                x++;
            });
        });

        values = valuesMatrix;
        this.game.valuesMatrix = matrix;

        // Reset the game
        this.reset();

        util.each(values, function(i, data) {
            let input = inputs[data.index];
            input.value = data.value;
            input.classList.add('disabled');
            input.tabIndex = -1;
            triggerEvent(input, 'keyup');
        });
    }
    reset() {
        this.game.resetGame();
    }
}
