from langgraph.graph import StateGraph, START, END

from graph.state import AgentState

from agents.router_agent import router_node

from agents.complaint_agent import complaint_node
from agents.complaint_creation_agent import complaint_creation_node

from agents.status_agent import status_node
from agents.status_response_agent import status_response_node

from agents.assignment_agent import assignment_node
from agents.assignment_response_agent import assignment_response_node

from agents.rag_agent import rag_node
from agents.rag_response_agent import rag_response_node

from agents.completion_agent import completion_node
from agents.completion_response_agent import completion_response_node

from memory.conversation_memory import memory


# Create Graph
builder = StateGraph(AgentState)


# =========================
# Register Nodes
# =========================

builder.add_node("router", router_node)

builder.add_node("complaint", complaint_node)
builder.add_node("complaint_creation", complaint_creation_node)

builder.add_node("status", status_node)
builder.add_node("status_response", status_response_node)

builder.add_node("assignment", assignment_node)
builder.add_node("assignment_response", assignment_response_node)

builder.add_node("rag", rag_node)
builder.add_node("rag_response", rag_response_node)

builder.add_node("completion",completion_node)
builder.add_node("completion_response",completion_response_node)


# =========================
# Start
# =========================

builder.add_edge(START, "router")


# =========================
# Router
# =========================

builder.add_conditional_edges(
    "router",
    lambda state: state["intent"],
    {
        "complaint": "complaint",
        "status": "status",
        "assignment": "assignment",
        "rag": "rag",
        "completion": "completion",
    },
)


# =========================
# Complaint Flow
# =========================

builder.add_edge("complaint", "complaint_creation")
builder.add_edge("complaint_creation", END)


# =========================
# Status Flow
# =========================

builder.add_edge("status", "status_response")
builder.add_edge("status_response", END)


# =========================
# Assignment Flow
# =========================

builder.add_edge("assignment", "assignment_response")
builder.add_edge("assignment_response", END)


# =========================
# RAG Flow
# =========================

builder.add_edge("rag", "rag_response")
builder.add_edge("rag_response", END)

# =========================
# Completion Flow
# =========================

builder.add_edge(
    "completion",
    "completion_response",
)

builder.add_edge(
    "completion_response",
    END,
)

# =========================
# Compile Graph
# =========================

graph = builder.compile(
    checkpointer=memory
)