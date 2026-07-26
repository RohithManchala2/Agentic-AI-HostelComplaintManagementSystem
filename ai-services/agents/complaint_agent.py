from services.groq_service import llm
from prompts.complaint_prompt import COMPLAINT_PROMPT
from schemas.complaint_schema import ComplaintOutput


structured_llm = llm.with_structured_output(ComplaintOutput)


async def complaint_node(state):
    """
    Complaint Extraction Agent

    Extracts structured complaint information
    from the user's message.
    """

    message = state["message"]

    complaint = structured_llm.invoke(
        [
            ("system", COMPLAINT_PROMPT),
            ("human", message),
        ]
    )

    return {
        **state,
        "complaint": complaint.model_dump(),
    }