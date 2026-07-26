from services.groq_service import llm
from prompts.router_prompt import ROUTER_PROMPT
from schemas.router_schema import RouterOutput


structured_llm = llm.with_structured_output(RouterOutput)


def _fallback_intent(message: str) -> str:
    """
    Backup intent classifier used only if the LLM fails.
    """

    text = (message or "").lower()

    # -------------------------------
    # Completion (Highest Priority)
    # -------------------------------
    if any(
        keyword in text
        for keyword in [
            "complete",
            "completed",
            "resolved",
            "fixed",
            "finished",
            "repaired",
            "done",
            "mark complete",
            "mark completed",
            "mark as completed",
            "mark as resolved",
        ]
    ):
        return "completion"

    # -------------------------------
    # Assignment
    # -------------------------------
    if any(
        keyword in text
        for keyword in [
            "assign",
            "assigned",
            "technician",
            "warden",
            "assignment",
        ]
    ):
        return "assignment"

    # -------------------------------
    # Status
    # -------------------------------
    if any(
        keyword in text
        for keyword in [
            "status",
            "pending",
            "show my complaints",
            "my complaints",
            "track complaint",
        ]
    ):
        return "status"

    # -------------------------------
    # Complaint Creation
    # -------------------------------
    if any(
        keyword in text
        for keyword in [
            "complaint",
            "fan",
            "water",
            "wifi",
            "light",
            "leak",
            "broken",
            "not working",
            "issue",
            "problem",
            "create complaint",
            "register complaint",
            "raise complaint",
        ]
    ):
        return "complaint"

    # -------------------------------
    # RAG
    # -------------------------------
    if any(
        keyword in text
        for keyword in [
            "timing",
            "hostel",
            "rule",
            "policy",
            "mess",
            "visitor",
            "fee",
            "leave",
            "fire",
            "emergency",
            "library",
            "clean",
        ]
    ):
        return "rag"

    return "rag"


def router_node(state):
    """
    Router Agent

    Determines which specialized agent should
    handle the user's request.
    """

    message = state["message"]
    history = state.get("history", "No previous conversation.")

    try:

        result = structured_llm.invoke(
            [
                ("system", ROUTER_PROMPT),
                (
                    "human",
                    f"""
Previous Conversation

{history}

Current User Message

{message}
""",
                ),
            ]
        )

        intent = result.intent

    except Exception as e:

        intent = _fallback_intent(message)

    return {
        "message": message,
        "intent": intent,
        "response": "",
    }