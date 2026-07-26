from tools.assignment_tools import handle_assignment

from agents.assignment_formatter_agent import (
    format_assignment_response,
)


async def assignment_response_node(state):
    """
    Assignment Response Agent

    Executes assignment-related operations using the
    Assignment Tool and converts the backend response
    into a natural language response.
    """

    assignment_query = state["assignment_query"]
    cookies = state.get("cookies")

    try:
        # Execute assignment operation
        result = await handle_assignment(
            assignment_query=assignment_query,
            cookies=cookies,
        )

        # Format the backend response using the LLM
        formatted_response = await format_assignment_response(
            result
        )

    except Exception as exc:

        formatted_response = (
            f"Sorry, I couldn't complete the assignment request. ({exc})"
        )

    return {
        **state,
        "response": formatted_response,
    }