from tools.status_tools import get_complaint_status

from agents.status_formatter_agent import (
    format_status_response,
)


async def status_response_node(state):
    """
    Fetches complaint status from the backend and
    converts the backend response into a natural
    language response using the Status Formatter Agent.
    """

    try:
        # -------------------------------
        # Get status from backend
        # -------------------------------
        result = await get_complaint_status(
            status_query=state["status_query"],
            cookies=state.get("cookies"),
        )

        # -------------------------------
        # Format response using LLM
        # -------------------------------
        formatted_response = await format_status_response(result)

    except Exception as exc:

        formatted_response = (
            f"Sorry, I couldn't retrieve your complaint status. ({exc})"
        )

    return {
        **state,
        "response": formatted_response,
    }