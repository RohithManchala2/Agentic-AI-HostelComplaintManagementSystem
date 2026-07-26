from services.groq_service import llm
from prompts.completion_prompt import COMPLETION_PROMPT
from schemas.completion_schema import CompletionSchema


structured_llm = llm.with_structured_output(CompletionSchema)


async def completion_node(state):
    """
    Completion Extraction Agent

    Extracts the room number from the technician's
    message indicating that the complaint has been
    completed.
    """

    message = state["message"]

    completion = structured_llm.invoke(
        [
            ("system", COMPLETION_PROMPT),
            ("human", message),
        ]
    )

    return {
        **state,
        "completion_query": completion.model_dump(),
    }