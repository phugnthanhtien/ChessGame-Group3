// create borad
function Board() {
    this.col = 8
    this.row = 8
    this.boxesChess = null
    this.squares = [] // Square[]
    this.rows = [] // Row[]
    this.currentPieceMove = []

    // put chess in board
    this.putChessToBoard = function() {
        let currentBoard = []
        for(let i = 0; i < this.row; i++) {
            const rowChess = []
            for(let j = 0; j < this.col; j++) {
                rowChess[j] = null
            }
            currentBoard.push(rowChess)
        }
        for(let j = 0; j < this.col; j++) {
            currentBoard[1][j] = new Pawn(1, j, "white")
            currentBoard[6][j] = new Pawn(6, j, "black")
        }
        // create white rook
        currentBoard[0][0] = new Rook(0, 0, "white") 
        currentBoard[0][7] = new Rook(0, 7, "white")
        // create black rook
        currentBoard[7][0] = new Rook(7, 0, "black")
        currentBoard[7][7] = new Rook(7, 7, "black")
        // create white knight
        currentBoard[0][1] = new Knight(0, 1, "white")
        currentBoard[0][6] = new Knight(0, 6, "white")
        // create black knight
        currentBoard[7][1] = new Knight(7, 1, "black")
        currentBoard[7][6] = new Knight(7, 6, "black")
        // create white Bishop 
        currentBoard[0][2] = new Bishop(0, 2, "white")
        currentBoard[0][5] = new Bishop(0, 5, "white")
        // create black Bishop
        currentBoard[7][2] = new Bishop(7, 2, "black")
        currentBoard[7][5] = new Bishop(7, 5, "black")
        // create white king
        currentBoard[0][4] = new King(0, 4, "white")
        // create black king
        currentBoard[7][4] = new King(7, 4, "black")
        // create white queen
        currentBoard[0][3] = new Queen(0, 3, "white")
        // create black queen
        currentBoard[7][3] = new Queen(7, 3, "black")

        // currentBoard[4][4] = new Queen(4, 4, "white")
        // currentBoard[5][0] = new Pawn(5, 0, "black")
        this.boxesChess = currentBoard
        // console.log(this.boxesChess)
    }

    this.initializeBoard = function() {
        let currentRows = []
        for (let i = 0; i < this.row; i++) {
            const row = new Row(i)
            let currentSqares = []
            for (let j = 0; j < this.row; j++) {
                let color
                let currentPiece = this.boxesChess[i][j]
                if (i % 2 == 0) 
                    color = j % 2 == 0 ? SquareColor.White : SquareColor.Black
                else
                    color = j % 2 == 0 ? SquareColor.Black : SquareColor.White 
                const square = new Square(i, j, color)
                square.piece = currentPiece
                currentSqares.push(square)
            }
            row.squares = currentSqares
            currentRows.push(row)
        }
        this.rows = currentRows
    }

    this.renderBoard = function() {
        let chessBoard = document.getElementById("chess-board")
        for(let row of this.rows) {
            for(let square of row.squares) {
                let piece = square.piece
                if(piece) {
                    square.squareElement.appendChild(piece.renderChess()) 
                }
                row.rowElement.appendChild(square.renderSquare())
            }
            chessBoard.appendChild(row.renderRow())
        }
    }
    this.toggleAvailableSquare = function toggleAvailableSquare(isSelected, square, color) {
        if(isSelected) {
            square.squareElement.style.backgroundColor = color
            square.squareElement.style.cursor = "pointer"
        }
        else {
            square.squareElement.style.backgroundColor= square.color
            square.squareElement.style.cursor = "auto"
        }
    }
    this.deleteChess = function deleteChess(squareElement) {
        let coordinate = {x: squareElement.attributes.data.x, y: squareElement.attributes.data.y}
        // clear quân cờ trên ô dc click
        chessBoard.rows[chessBoard.currentPieceMove[0].x].squares[chessBoard.currentPieceMove[0].y].piece = null
        chessBoard.rows[coordinate.x].squares[coordinate.y].piece.isAlive = false

        // chessBoard.boxesChess[coordinate.x][coordinate.y] = null
        chessBoard.rows[coordinate.x].squares[coordinate.y].piece = null
        chessBoard.rows[coordinate.x].squares[coordinate.y].squareElement.firstChild.remove()

        chessBoard.currentPieceMove[0].x = coordinate.x
        chessBoard.currentPieceMove[0].y = coordinate.y
        chessBoard.currentPieceMove[0].isSelected = false

        chessBoard.boxesChess[coordinate.x][coordinate.y] = chessBoard.currentPieceMove[0]
        chessBoard.rows[coordinate.x].squares[coordinate.y].piece = chessBoard.currentPieceMove[0]

        chessBoard.renderBoard()
        chessBoard.currentPieceMove[0].toggleAvailabeMoveChess()
        console.log(squareElement.attributes.data)
    }

}

function Row(line, square) {
    this.line = line
    this.rowElement = document.createElement("div") 
    this.renderRow = function renderRow() {
        this.rowElement.style.display = "flex"
        this.rowElement.attributes.data = this
        return this.rowElement
    }
}

function Square(x = 0, y = 0, color = "#8B4513") {
    this.x = x
    this.y = y
    this.color = color
    this.piece = null
    this.squareElement = document.createElement("div") 
    this.renderSquare = function renderSquare() {
        this.squareElement.style.backgroundColor = this.color
        this.squareElement.style.width = "75px"
        this.squareElement.style.height = "75px"
        this.squareElement.style.display = "flex"
        this.squareElement.style.justifyContent  = "center"
        this.squareElement.style.alignItems = "center"
        this.squareElement.style.border = "1px solid"
        this.squareElement.attributes.data = this
        return this.squareElement
    }
    this.squareElement.addEventListener('click', getSquare => {
        if (event.target.style.backgroundColor == SquareColor.Green) {
            //get coordinate of square is selected
            let coordinate = {x: event.target.attributes.data.x, y: event.target.attributes.data.y}

            // update boxesChess ans row
            // chessBoard.boxesChess[coordinate.x][coordinate.y] = null
            chessBoard.rows[chessBoard.currentPieceMove[0].x].squares[chessBoard.currentPieceMove[0].y].piece = null

            chessBoard.currentPieceMove[0].isSelected = false
            chessBoard.currentPieceMove[0].findAvailableMovePosition()

            chessBoard.currentPieceMove[0].x = coordinate.x
            chessBoard.currentPieceMove[0].y = coordinate.y

            

            chessBoard.boxesChess[coordinate.x][coordinate.y] = chessBoard.currentPieceMove[0]
            chessBoard.rows[coordinate.x].squares[coordinate.y].piece = chessBoard.currentPieceMove[0]

            chessBoard.renderBoard()
            chessBoard.currentPieceMove[0].toggleAvailabeMoveChess()
        }
        else if (event.target.style.backgroundColor == SquareColor.Red) {
            chessBoard.deleteChess(event.target)
        }
    })
}

// tien ne

