"""두 명이 번갈아 O와 X를 두는 3x3 틱택토 게임을 터미널에서 실행합니다."""

BOARD_SIZE = 3
EMPTY_CELL = " "
PLAYERS = ("O", "X")

# 가로, 세로, 대각선 8개 줄. 인덱스는 0~8 칸 번호입니다.
WINNING_LINES = (
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6),
)


def print_board(board):
    """현재 판을 칸 번호와 함께 출력합니다."""
    for row in range(BOARD_SIZE):
        cells = []
        for col in range(BOARD_SIZE):
            index = row * BOARD_SIZE + col
            # 빈 칸에는 칸 번호를 보여 줘서 입력할 번호를 알 수 있게 합니다.
            cells.append(board[index] if board[index] != EMPTY_CELL else str(index + 1))
        print(" " + " | ".join(cells))
        if row < BOARD_SIZE - 1:
            print("-----------")
    print()


def is_valid_move(board, index):
    """선택한 칸이 비어 있는지 확인합니다."""
    return 0 <= index < len(board) and board[index] == EMPTY_CELL


def find_winner(board):
    """한 줄이 같은 말로 채워졌으면 그 말(O 또는 X)을, 없으면 None을 반환합니다."""
    for first, second, third in WINNING_LINES:
        if board[first] != EMPTY_CELL and board[first] == board[second] == board[third]:
            return board[first]
    return None


def is_board_full(board):
    """빈 칸이 하나도 없는지 확인합니다."""
    return EMPTY_CELL not in board


def ask_move(player):
    """플레이어에게 둘 칸 번호(1~9)를 입력받아 0~8 인덱스로 돌려줍니다."""
    while True:
        answer = input(f"{player} 차례입니다. 둘 칸 번호(1~9)를 입력하세요: ").strip()
        if answer.isdigit() and 1 <= int(answer) <= BOARD_SIZE * BOARD_SIZE:
            return int(answer) - 1
        print("1부터 9 사이의 숫자를 입력해 주세요.")


def play_game():
    """게임 한 판을 진행하고 결과를 출력합니다."""
    board = [EMPTY_CELL] * (BOARD_SIZE * BOARD_SIZE)
    turn = 0

    print("틱택토를 시작합니다. 칸 번호는 아래 판과 같습니다.\n")
    print_board(board)

    while True:
        player = PLAYERS[turn % 2]
        index = ask_move(player)

        if not is_valid_move(board, index):
            print("이미 놓인 칸입니다. 다른 칸을 선택해 주세요.\n")
            continue

        board[index] = player
        print_board(board)

        winner = find_winner(board)
        if winner:
            print(f"{winner} 승리!")
            return
        if is_board_full(board):
            print("무승부입니다.")
            return

        turn += 1


if __name__ == "__main__":
    play_game()
