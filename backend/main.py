from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: List[Any]
    edges: List[Any]


def is_dag(nodes, edges):
    # Build adjacency list
    graph = {node["id"]: [] for node in nodes}
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in graph:
            graph[src].append(tgt)

    # Kahn's algorithm for cycle detection
    in_degree = {node["id"]: 0 for node in nodes}
    for edge in edges:
        tgt = edge.get("target")
        if tgt in in_degree:
            in_degree[tgt] += 1

    queue = [n for n in in_degree if in_degree[n] == 0]
    visited = 0

    while queue:
        node = queue.pop(0)
        visited += 1
        for neighbor in graph.get(node, []):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(nodes)


@app.get("/")
def read_root():
    return {"message": "VectorShift Pipeline API"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": dag}
