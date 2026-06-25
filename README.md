
# VectorShift Pipeline Builder

A visual pipeline builder with drag-and-drop nodes, built with React + ReactFlow on the frontend and FastAPI on the backend.

## Setup & Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs at http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs at http://localhost:3000
```

## Features

### Part 1 — Node Abstraction
- `BaseNode` component in `src/nodes/BaseNode.js` provides a reusable abstraction
- All nodes are built using `BaseNode` with minimal code
- 5 new nodes added: **API Request**, **Transform**, **Conditional**, **Note**, **Merge**

### Part 2 — Styling
- Dark theme with CSS custom properties design system
- Smooth hover/focus transitions, glowing handles, animated edges
- Color-coded node types with icons and badges

### Part 3 — Text Node Logic
- Auto-resizes width and height as you type
- Detects `{{variable}}` patterns and creates input Handles dynamically

### Part 4 — Backend Integration
- Submit button sends nodes + edges to `POST /pipelines/parse`
- Backend calculates node count, edge count, and DAG detection (Kahn's algorithm)
- Alert displays results in a user-friendly format


## How it works
- The user builds a pipeline in the frontend UI
- On clicking Submit Pipeline, the frontend sends the pipeline data (nodes and edges) to the backend API
- The backend processes the graph and returns:
      - Number of nodes
      - Number of edges
      - Whether the pipeline is a Directed Acyclic Graph (DAG)
