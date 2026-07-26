from tools.complaint_tools import create_complaint

from agents.complaint_formatter_agent import (
    format_complaint_response,
)


async def complaint_creation_node(state):
    """
    Complaint Creation Agent

    Creates a complaint using the backend API
    and converts the backend response into a
    user-friendly AI response.
    """

    try:
        # ----------------------------------------
        # Create complaint using backend API
        # ----------------------------------------
        backend_response = await create_complaint(
            complaint_data=state["complaint"],
            cookies=state.get("cookies"),
        )

        # ----------------------------------------
        # Convert backend response into
        # natural language using LLM
        # ----------------------------------------
        formatted_response = await format_complaint_response(
            backend_response
        )

    except Exception as exc:

        formatted_response = (
            f"Sorry, I couldn't create your complaint. ({exc})"
        )

    return {
        **state,
        "response": formatted_response,
    }