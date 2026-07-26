from services.groq_service import llm
from prompts.status_prompt import STATUS_PROMPT
from schemas.status_schema import StatusOutput

structured_llm = llm.with_structured_output(StatusOutput)

async def status_node(state):
    """
    Status Agent

    Understands what type of complaint status
    information the user is requesting.
    """

    message = state["message"]

    result = structured_llm.invoke(
        [
            ("system", STATUS_PROMPT),
            ("human", message),
        ]
    )

    return {
        **state,
        "status_query": result.model_dump(),
    }