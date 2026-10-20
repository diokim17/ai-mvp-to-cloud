"""두 명이 번갈아 O와 X를 두는 3x3 틱택토 게임을 pygame 창으로 실행합니다.

규칙 판정은 tic_tac_toe.py의 함수를 가져다 쓰고, 이 파일은 화면 그리기와 마우스 클릭만 담당합니다.
"""

import sys

import pygame

from tic_tac_toe import BOARD_SIZE, EMPTY_CELL, PLAYERS, find_winner, is_board_full, is_valid_move

WINDOW_WIDTH = 480
WINDOW_HEIGHT = 580
BOARD_TOP = 100
CELL_SIZE = 150
BOARD_LEFT = (WINDOW_WIDTH - CELL_SIZE * BOARD_SIZE) // 2
FPS = 30

BACKGROUND_COLOR = (245, 245, 245)
LINE_COLOR = (51, 51, 51)
TEXT_COLOR = (40, 40, 40)
BUTTON_COLOR = (90, 90, 90)
BUTTON_TEXT_COLOR = (255, 255, 255)
PLAYER_COLORS = {"O": (30, 136, 229), "X": (229, 57, 53)}
BUTTON_RECT = pygame.Rect(WINDOW_WIDTH // 2 - 70, WINDOW_HEIGHT - 70, 140, 44)


def cell_index_at(position):
    """마우스 좌표를 칸 번호(0~8)로 바꾸고, 판 바깥이면 None을 반환합니다."""
    x, y = position
    col = (x - BOARD_LEFT) // CELL_SIZE
    row = (y - BOARD_TOP) // CELL_SIZE
    if not (0 <= col < BOARD_SIZE and 0 <= row < BOARD_SIZE):
        return None
    return row * BOARD_SIZE + col


def cell_center(index):
    """칸 번호(0~8)의 화면상 중심 좌표를 반환합니다."""
    row, col = divmod(index, BOARD_SIZE)
    return (BOARD_LEFT + col * CELL_SIZE + CELL_SIZE // 2,
            BOARD_TOP + row * CELL_SIZE + CELL_SIZE // 2)


def draw_board(screen, board, fonts):
    """격자 선과 현재 놓인 O, X를 그립니다."""
    size = CELL_SIZE * BOARD_SIZE
    for line in range(1, BOARD_SIZE):
        offset = line * CELL_SIZE
        pygame.draw.line(screen, LINE_COLOR, (BOARD_LEFT + offset, BOARD_TOP),
                         (BOARD_LEFT + offset, BOARD_TOP + size), 4)
        pygame.draw.line(screen, LINE_COLOR, (BOARD_LEFT, BOARD_TOP + offset),
                         (BOARD_LEFT + size, BOARD_TOP + offset), 4)
    for index, mark in enumerate(board):
        if mark != EMPTY_CELL:
            text = fonts["mark"].render(mark, True, PLAYER_COLORS[mark])
            screen.blit(text, text.get_rect(center=cell_center(index)))


def draw_screen(screen, board, message, fonts):
    """배경, 상단 문구, 판, 다시 시작 버튼을 한 화면에 그립니다."""
    screen.fill(BACKGROUND_COLOR)
    text = fonts["status"].render(message[0], True, message[1])
    screen.blit(text, text.get_rect(center=(WINDOW_WIDTH // 2, BOARD_TOP // 2)))
    draw_board(screen, board, fonts)
    pygame.draw.rect(screen, BUTTON_COLOR, BUTTON_RECT, border_radius=8)
    label = fonts["button"].render("다시 시작", True, BUTTON_TEXT_COLOR)
    screen.blit(label, label.get_rect(center=BUTTON_RECT.center))
    pygame.display.flip()


def main():
    """창을 열고 클릭 이벤트에 따라 게임을 진행합니다."""
    pygame.init()
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    pygame.display.set_caption("틱택토")
    clock = pygame.time.Clock()
    fonts = {
        "status": pygame.font.SysFont("applesdgothicneo", 26),
        "mark": pygame.font.SysFont("arial", 110, bold=True),
        "button": pygame.font.SysFont("applesdgothicneo", 20),
    }

    board = [EMPTY_CELL] * (BOARD_SIZE * BOARD_SIZE)
    turn = 0
    game_over = False
    message = ("", TEXT_COLOR)

    while True:
        if not game_over:
            player = PLAYERS[turn % 2]
            message = (f"{player} 차례입니다.", PLAYER_COLORS[player])
        draw_screen(screen, board, message, fonts)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type != pygame.MOUSEBUTTONDOWN or event.button != 1:
                continue

            if BUTTON_RECT.collidepoint(event.pos):
                board = [EMPTY_CELL] * (BOARD_SIZE * BOARD_SIZE)
                turn = 0
                game_over = False
                continue
            index = cell_index_at(event.pos)
            if game_over or index is None:
                continue
            if not is_valid_move(board, index):
                message = ("이미 놓인 칸입니다. 다른 칸을 선택해 주세요.", TEXT_COLOR)
                continue

            board[index] = PLAYERS[turn % 2]
            winner = find_winner(board)
            if winner:
                game_over = True
                message = (f"{winner} 승리! 다시 시작 버튼을 눌러 주세요.", PLAYER_COLORS[winner])
            elif is_board_full(board):
                game_over = True
                message = ("무승부입니다. 다시 시작 버튼을 눌러 주세요.", TEXT_COLOR)
            else:
                turn += 1

        clock.tick(FPS)


if __name__ == "__main__":
    main()
