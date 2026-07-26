from services.groq_service import llm

from prompts.assignment_prompt import ASSIGNMENT_PROMPT
from schemas.assignment_schema import AssignmentOutput


structured_llm = llm.with_structured_output(AssignmentOutput)


async def assignment_node(state):
    """
    Assignment Agent

    Understands assignment-related requests from
    Students and Wardens and converts them into
    structured output.
    """

    message = state["message"]

    result = structured_llm.invoke(
        [
            ("system", ASSIGNMENT_PROMPT),
            ("human", message),
        ]
    )

    return {
        **state,
        "assignment_query": result.model_dump(),
    }