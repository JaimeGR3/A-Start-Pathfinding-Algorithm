import sys
import json
import math
from heapq import heappush, heappop

class Node:
    def __init__(self, position, g=0, h=0, parent=None):
        """
        Initializes the Node with position, g cost, h cost, and parent node.
        """
        self.position = position
        self.g = g
        self.h = h
        self.f = g + h
        self.parent = parent

    def set_f(self):
        """
        Sets the f value as the sum of g and h.
        """
        self.f = self.g + self.h

    def __lt__(self, other):
        """
        Compares two nodes based on their f value.
        """
        if self.f == other.f:
          return self.g < other.g  # Prefer nodes with lower g if f is tied
        return self.f < other.f
    
def heuristic(node1, node2):
    """
    Heuristic function using Manhattan distance.
    """
    x1, y1 = node1
    x2, y2 = node2
    return abs(x1 - x2) + abs(y1 - y2)


def get_neighbors(node, array):
        x, y = node.position
        neighbors = []

        directions = [(-1, 0), (1, 0), (0, -1), (0, 1),
                       (-1, -1), (-1, 1), (1, -1), (1, 1)]
        for dx, dy in directions:
            new_x, new_y = x + dx, y + dy

            if 0 <= new_x < len(array) and 0 <= new_y < len(array[0]) and array[new_x][new_y] != 0:
                move_cost = math.sqrt(2) if dx != 0 and dy != 0 else 1
                move_cost += array[new_x][new_y]
                neighbors.append(((new_x, new_y), move_cost))

        return neighbors


def reconstruct_path(current_node):
    """
    Reconstructs the path from start to goal by following parent links.
    """
    path = []
    while current_node:
        path.append(current_node.position)
        current_node = current_node.parent
    return path[::-1]

def a_star_search(start_pos, goal_pos, grid):
    """
    A* search algorithm to find the shortest path.
    """
    to_search = []
    processed = set()

    if grid[start_pos[0]][start_pos[1]] == 0:
        return None
    
    start_node = Node(start_pos, h=heuristic(start_pos, goal_pos))
    heappush(to_search, start_node)
    

    while to_search:
        current_node = heappop(to_search)
        
        processed.add(current_node.position)
        if current_node.position == goal_pos:
            return [reconstruct_path(current_node), list(processed)]


        for neighbor_pos, move_cost in get_neighbors(current_node, grid):
            if neighbor_pos in processed:
                continue

            g_cost = current_node.g + move_cost
            neighbor_node = Node(neighbor_pos, g=g_cost, h=heuristic(neighbor_pos, goal_pos), parent=current_node)
            
            heappush(to_search, neighbor_node)

    return None  # No path found






if __name__ == "__main__":
    data = json.loads(sys.argv[1]) 
    start = tuple(map(int, sys.argv[2].strip("()").split(",")))
    goal = tuple(map(int, sys.argv[3].strip("()").split(",")))

    path = a_star_search(start, goal, data)

    print(json.dumps(path))
