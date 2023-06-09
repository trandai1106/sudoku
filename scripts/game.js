'use strict';

var life = 3;
var myScore = 0;

var util = {
    extend: function(src, props) {
        props = props || {};
        for (let p in src) {
            if (!props.hasOwnProperty(p)) {
                props[p] = src[p];
            }
        }
        return props;
    },
    each: function(a, b, c) {
        if ('[object Object]' === Object.prototype.toString.call(a)) {
            for (let d in a) {
                if (Object.prototype.hasOwnProperty.call(a, d)) {
                    b.call(c, d, a[d], a);
                }
            }
        } else {
            for (let e = 0, f = a.length; e < f; e++) {
                b.call(c, e, a[e], a);
            }
        }
    },
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    includes: function(a, b) {
        return a.indexOf(b) > -1;
    },
};

var defaultConfig = {
    validate_on_insert: true,

    difficulty: function() {
        return $('#gameMode').val();
    }
};

class Game {
    constructor(config, people) {
        this.config = config;

        this.cellMatrix = {};
        this.matrix = {};
        this.validation = {};

        this.values = [];
        this.valuesMatrix = [];
        this.people = people;
        this.resetValidationMatrices();

        return this;
    }
    listPlayer(){
        let elements = document.getElementsByClassName('life');
        let elementsPoints = document.getElementsByClassName('point');
        for(let i = 0; i < 4; i++){
            elements[i].innerHTML = this.people[i].life
            elementsPoints[i].innerHTML = this.people[i].point
        }
    }
    checkLive(){
        elements = document.getElementsByClassName('playerSwatch');
        let isLive = 0;
        let count = 0;
        for(let i = 0; i < 4; i++){
            if(this.people[i].isLive == false){
                elements[i].classList.add('death');

                count += 1;
            }
        }
        
        count = 0;
        if(this.people[player].isLive == false){
            for(let i = player; i < 4; i++){
                if(this.people[i].isLive){
                    player = i;
                    break;
                }else{
                    count += 1;
                }
                if(count == 4){
                    this.lose();
                    return;
                }
                if(i==3){
                    i = 0;
                    continue;
                }
            }
        }
        
        selectPerson();
    }
    buildGUI() {
        $('.playerUser').css("display","block");
        $("#nameFirst").append("&nbsp;"+"<p>"+this.people[0].name+"</p>");
        $("#colorFirst").css("background-color","var(--player0-bg-color)");
        // $("#pointFirst").append("&nbsp;"+"<p>"+this.people[0].point+"</p>");

        $("#nameSecond").append("&nbsp;"+"<p>"+this.people[1].name+"</p>");
        $("#colorSecond").css("background-color","var(--player1-bg-color)");
        // $("#pointSecond").append("&nbsp;"+"<p>"+this.people[1].point+"</p>");
        

        $("#nameThird").append("&nbsp;"+"<p>"+this.people[2].name+"</p>");
        $("#colorThird").css("background-color","var(--player2-bg-color)");
        // $("#pointThird").append("&nbsp;"+"<p>"+this.people[2].point+"</p>");
        

        $("#nameFourth").append("&nbsp;"+"<p>"+this.people[3].name+"</p>");
        $("#colorFourth").css("background-color","var(--player3-bg-color)");
        // $("#pointFourth").append("&nbsp;"+"<p>"+this.people[3].point+"</p>");

        let btn1 = document.createElement('button');
        btn1.innerHTML = '<i class="fa fa-mail-reply" style="font-size:36px"></i>';
        btn1.onclick = ()=>{
            if(this.people[player].life > 0){
                this.people[player].life -=1;
            }
            if(this.people[player].life == 0){
                this.people[player].isLive = false;
                elements = document.getElementsByClassName('playerSwatch');
                elements[player].classList.add('death')
                this.checkLive();
            }
            this.listPlayer();
            
        };
        $(".btnLife").append(btn1);

        let btn2 = document.createElement('button');
        btn2.innerHTML = '<i class="fa fa-mail-forward" style="font-size:36px"></i>';
        btn2.onclick = ()=>{
            if(this.people[player].life == 0){
                elements = document.getElementsByClassName('playerSwatch');
                elements[player].classList.remove('death');

            }
            this.people[player].life +=1;
            this.people[player].isLive = true;
            
            this.listPlayer();
        };
        $(".btnLife").append(btn2);

        let btn3 = document.createElement('button');
        btn3.innerHTML = '<i class="fa fa-angle-double-down" style="font-size:36px"></i>';
        btn3.onclick = ()=>{
            this.people[player].point -=20;
            this.listPlayer();
        };
        $(".btnPoint").append(btn3);

        let btn4 = document.createElement('button');
        btn4.innerHTML = '<i class="fa fa-angle-double-up" style="font-size:36px"></i>';
        btn4.onclick = ()=>{
            this.people[player].point +=20;
            this.listPlayer();
        };
        $(".btnPoint").append(btn4);

        this.listPlayer()

        let td, tr;
        this.table = document.createElement('table');
        this.table.classList.add('sudoku-container');

        for (let i = 0; i < 9; i++) {
            tr = document.createElement('tr');
            this.cellMatrix[i] = {};

            for (let j = 0; j < 9; j++) {
                this.cellMatrix[i][j] = document.createElement('input');
                this.cellMatrix[i][j].maxLength = 1;

                this.cellMatrix[i][j].row = i;
                this.cellMatrix[i][j].col = j;

                this.cellMatrix[i][j].addEventListener('keyup', this.onKeyUp.bind(this));

                td = document.createElement('td');

                td.appendChild(this.cellMatrix[i][j]);

                let sectIDi = Math.floor(i / 3);
                let sectIDj = Math.floor(j / 3);
                if ((sectIDi + sectIDj) % 2 === 0) {
                    td.classList.add('sudoku-section-one');
                } else {
                    td.classList.add('sudoku-section-two');
                }
                tr.appendChild(td);
            }
            td = document.createElement('td');
            td.innerHTML = '<p> ' + (i+1) + '</p>';
            tr.appendChild(td);
            this.table.appendChild(tr);
        }
        let abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G','H', 'I'];
        tr = document.createElement('tr');
        for(let j = 0; j < 9; j++){
            td = document.createElement('td');
            td.classList.add('index')
            td.innerHTML = '<span> ' + abc[j] + '</span>';
            tr.appendChild(td);
        }
        this.table.appendChild(tr);
        this.table.addEventListener('mousedown', this.onMouseDown.bind(this));

        // Return the GUI table
        return this.table;
    }
    onKeyUp(e) {
        let sectRow,
            sectCol,
            secIndex,
            val, row, col,
            isValid = true,
            input = e.currentTarget

        val = input.value.trim();
        row = input.row;
        col = input.col;
        // this.table.classList.remove('valid-matrix');
        // input.classList.remove('invalid');

        sectRow = Math.floor(row / 3);
        sectCol = Math.floor(col / 3);
        secIndex = row % 3 * 3 + col % 3;
        if(input.classList.contains('invalid')){
            input.classList.remove('invalid')
        }
        if (!util.isNumber(val)) {
            input.value = '';
            return false;
        }
        // console.log(input.classList.length);
        if (input.classList.length > 1) return;

        // send(channel, 'choose', [val, input]);

        // if (this.config.validate_on_insert) {
        isValid = this.validateNumber(val, row, col,this.people[player]);
        // Indicate error
        input.classList.toggle('invalid', !isValid);
        if (isValid){
            game.game.cellMatrix[row][col].classList.add('highlight'+player);
            cp[sectRow][sectCol][secIndex] = -player;
        }
        this.listPlayer();
        this.checkLive();
        

        this.matrix.row[row][col] = val;
        this.matrix.col[col][row] = val;
        this.matrix.sect[sectRow][sectCol][secIndex] = val;
        
    
        this.checkWin(this.people[player], row, col)
    }
    onMouseDown(e) {
        let t = e.target;
        if (
            t.nodeName === 'INPUT' &&
            t.classList.contains('disabled') ||
            t.classList.contains('player1') ||
            t.classList.contains('player2')
        ) {
            e.preventDefault();
        }
    }
    winLose(num, rowID, colID) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.cellMatrix[i][j].value != this.valuesMatrix[i][j]) {
                    return;
                }
            }
        }
        this.checkWinner();
    }
    checkWin(person, row, col) {
        
        let check = true;
        let count = 0;
        for (let i = 0; i < 9; i++){
            if ( this.cellMatrix[row][i].value != this.valuesMatrix[row][i]){
                
                check = false;
                // break;
            }
            else{
                if(this.cellMatrix[row][i].classList.contains('highlight'+player)){
                    count+=1;
                }
            }
        }
        // if(check){
        //     for (let i = 0; i < 9; i++){
        //         check = true;
        //         for (let j = 0; j < 9; j++){
        //             if ( this.cellMatrix[j][i].value != this.valuesMatrix[j][i]){
        //                 console.log(i, j, check);
        //                 check = false;
        //                 break;
        //             }
        //         }
        //         if(check){
        //             break;
        //         }
        //     }
        // }
        
        if(check && count >=3){
            this.win();
        }
        check = true;
        count = 0;
        for (let i = 0; i < 9 ; i++){
            if ( this.cellMatrix[i][col].value != this.valuesMatrix[i][col]){
                
                check = false;
                break;
            }
            else{
                if(this.cellMatrix[row][i].classList.contains('highlight'+player)){
                    count+=1;
                }
            }
        }
        // if(check){
        //     for (let i = 0; i < 9; i++){
        //         check = true
        //         for (let j = 0; j < 9; j++){
        //             if ( this.cellMatrix[i][j].value != this.valuesMatrix[i][j]){
        //                 console.log(i, j, check);
        //                 check = false;
        //                 break;
        //             }
        //         }
        //         if(check){
        //             break;
        //         }
        //     }
        // }
        
        if(check && count >=3){
            this.win();
        }
        let sectRow = Math.floor(row / 3),
            sectCol = Math.floor(col / 3);
        count = 0;
        if(!cp[sectRow][sectCol].includes('')){
            for(let i = 0; i < 9; i++){
                if(cp[sectRow][sectCol][i] == -player){
                    count +=1;
                }
            }
        }else{
            return;
        }
        if(count >= 3){
            this.win();
        }
    }
    lose(){
        new HTMLBuilder().add(`
            <div id='mask'></div>
            <div id="enterName-window" class="result">
                <p id='playerWin'>All defeated!!!!</p>
                <div class="createPlayer"><button onclick="location.reload();">New game</button></div>
            </div>
         `).appendInto('body');

         $('#mask').fadeIn();
         $('#enterName-window').fadeIn();
    }
    win(){
        new HTMLBuilder().add(`
            <div id='mask' ></div>
            <div id="enterName-window" class="result">
                <p id='playerWin'></p>
                <div class="createPlayer"><button onclick="location.reload();">New game</button></div>
            </div>
         `).appendInto('body');
        //  console.log(this.people[player].name + 'Win!!!!!!!!');
         document.getElementById('playerWin').innerText = this.people[player].name + ' Win!!!!!!!!';
         $('#mask').fadeIn();
         $('#enterName-window').fadeIn();
    }
    checkWinner(IS_LEFT, userId) {
        const opponentScore = games[channel].players[Object.keys(games[channel].players)
                            .filter(i => i !== uuid)].score;
        if (IS_LEFT) {
            if (userId != uuid) addMsg('You won, your opponent has left');
        }
		else {
            addMsg(
                (myScore > opponentScore) ?
                'You won !!' :
                (myScore == opponentScore) ?
                'Tied !!' :
                'You Lost !!'
            );
        }

        $('#menu').css('display', 'block');
        $('.container').css('display', 'none');
        $('.sudoku-container').remove();
        $('#messages').html('');

        msgCount = myScore = 0;
        mySide = -1;
        this.showPoints(0, 0);

        if (!IS_ONLINE) return;

		let oldChannel = channel;
		channel = 'lobby';

        pubnubSubscribe(channel);

		send(channel, 'delete-lobby', oldChannel);

		window.clearInterval(spamLobby);
		delete games[oldChannel];
		showGames();

		IS_ONLINE = false;
		inGame = false;
    }
    showPoints(a, b) {
        $('#myScore').html(a + ' Points');
        $('#opponentScore').html(b + ' Points');
    }
    resetGame() {
        this.resetValidationMatrices();
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                this.cellMatrix[row][col].value = '';
            }
        }
        let inputs = this.table.getElementsByTagName('input');

        util.each(inputs, function(i, input) {
            input.classList.remove('disabled');
            input.tabIndex = 1;
        });
        this.table.classList.remove('valid-matrix');
    }
    resetValidationMatrices() {
        this.matrix = {
            row: {},
            col: {},
            sect: {}
        };
        this.validation = {
            row: {},
            col: {},
            sect: {}
        };

        // Build the row/col matrix and validation arrays
        for (let i = 0; i < 9; i++) {
            this.matrix.row[i] = ['', '', '', '', '', '', '', '', ''];
            this.matrix.col[i] = ['', '', '', '', '', '', '', '', ''];
            this.validation.row[i] = [];
            this.validation.col[i] = [];
        }

        // Build the section matrix and validation arrays
        for (let row = 0; row < 3; row++) {
            this.matrix.sect[row] = [];
            this.validation.sect[row] = {};
            for (let col = 0; col < 3; col++) {
                this.matrix.sect[row][col] = ['', '', '', '', '', '', '', '', ''];
                this.validation.sect[row][col] = [];
            }
        }
    }
    validateNumber(num, rowID, colID, people) {
        let isValid = true;
        // console.log(num, rowID, colID, people.name);
        if (num != this.valuesMatrix[rowID][colID]) {
            isValid = false;
            if (people.life > 0) {
                people.life--;
                people.point -= 20;
                if (people.life <= 0) {
                    people.isLive = false;
                    // addMsg('YOU LOST, You were wrong 3 times');
                    // $('#menu').css('display', 'block');
                    // $('#singleMatch').css('display', 'none');
                    // $('#singleMatch').empty();
                    people.life = 0;
                    
                }
            }
        }else {
            if (people.life > 0) {
                people.point += 20;
            }
        }
        return isValid;
    }
    validateMatrix() {
        let isValid, val, $element, hasError = false;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                val = this.matrix.row[row][col];
                var result = this.people.filter(obj => {
                    return obj.name === player;
                })
                isValid = this.validateNumber(val, row, col,this.people[player]);
                
                this.cellMatrix[row][col].classList.toggle('invalid', !isValid);

                if (!isValid) hasError = true;
            }
        }
        return !hasError;
    }
    solveGame(row, col, string) {
        let data = [[5, 6, 1, 4, 2, 9, 7, 3, 8],
        [8, 7, 2, 5, 3, 6, 9, 1, 4],
        [4, 3, 9, 1, 7, 8, 2, 5, 6],
        [3, 4, 7, 2, 8, 1, 6, 9, 5],
        [1, 2, 6, 9, 4, 5, 8, 7, 3],
        [9, 5, 8, 7, 6, 3, 4, 2, 1],
        [7, 8, 3, 6, 1, 2, 5, 4, 9],
        [2, 1, 5, 8, 9, 4, 3, 6, 7],
        [6, 9, 4, 3, 5, 7, 1, 8, 2]]
        
        let cval,
            sqRow,
            sqCol,
            nextSquare,
            legalValues,
            sectRow,
            sectCol,
            secIndex,
            gameResult;

        nextSquare = this.findClosestEmptySquare(row, col);
        if (!nextSquare) {
            return true;
        } else {
            sqRow = nextSquare.row;
            sqCol = nextSquare.col;
            legalValues = this.findLegalValuesForSquare(sqRow, sqCol);

            sectRow = Math.floor(sqRow / 3);
            sectCol = Math.floor(sqCol / 3);
            secIndex = sqRow % 3 * 3 + sqCol % 3;

            for (let i = 0; i < legalValues.length; i++) {
                cval = legalValues[i];
                nextSquare.value = string ? '' : cval;

                this.matrix.row[sqRow][sqCol] = data[sqRow][sqCol];
                this.matrix.col[sqCol][sqRow] = data[sqRow][sqCol];
                this.matrix.sect[sectRow][sectCol][secIndex] = data[sqRow][sqCol];

                if (this.solveGame(sqRow, sqCol, string)) {
                    return true;
                } else {
                    this.cellMatrix[sqRow][sqCol].value = '';
                    this.matrix.row[sqRow][sqCol] = '';
                    this.matrix.col[sqCol][sqRow] = '';
                    this.matrix.sect[sectRow][sectCol][secIndex] = '';
                }
            }
            return false;
        }
    }
    findClosestEmptySquare(row, col) {
        let walkingRow, walkingCol, found = false;
        for (let i = col + 9 * row; i < 81; i++) {
            walkingRow = Math.floor(i / 9);
            walkingCol = i % 9;
            if (this.matrix.row[walkingRow][walkingCol] === '') {
                found = true;
                return this.cellMatrix[walkingRow][walkingCol];
            }
        }
    }
    findLegalValuesForSquare(row, col) {
        let temp,
            legalVals,
            legalNums,
            val,
            i,
            sectRow = Math.floor(row / 3),
            sectCol = Math.floor(col / 3);

        legalNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (i = 0; i < 9; i++) {
            val = Number(this.matrix.col[col][i]);
            if (val > 0) {
                if (util.includes(legalNums, val)) {
                    legalNums.splice(legalNums.indexOf(val), 1);
                }
            }
        }

        for (i = 0; i < 9; i++) {
            val = Number(this.matrix.row[row][i]);
            if (val > 0) {
                if (util.includes(legalNums, val)) {
                    legalNums.splice(legalNums.indexOf(val), 1);
                }
            }
        }

        sectRow = Math.floor(row / 3);
        sectCol = Math.floor(col / 3);
        for (i = 0; i < 9; i++) {
            val = Number(this.matrix.sect[sectRow][sectCol][i]);
            if (val > 0) {
                if (util.includes(legalNums, val)) {
                    legalNums.splice(legalNums.indexOf(val), 1);
                }
            }
        }

        for (i = legalNums.length - 1; i > 0; i--) {
            let rand = getRandomInt(0, i);
            temp = legalNums[i];
            legalNums[i] = legalNums[rand];
            legalNums[rand] = temp;
        }
        return legalNums;
    }
}

var game;
