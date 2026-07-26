from tools.completion_tools import complete_complaint

from agents.completion_formatter_agent import (
    format_completion_response,
)


async def completion_response_node(state):
    """
    Completion Response Agent

    Marks the complaint as resolved using the
    Completion Tool and formats the backend
    response into natural language.
    """

    completion_query = state["completion_query"]
    cookies = state.get("cookies")

    try:

        result = await complete_complaint(
            completion_query=completion_query,
            cookies=cookies,
        )

        formatted_response = await format_completion_response(
            result
        )

    except Exception as exc:

        formatted_response = (
            f"Sorry, I couldn't complete the complaint. ({exc})"
        )

    return {
        **state,
        "response": formatted_response,
    }