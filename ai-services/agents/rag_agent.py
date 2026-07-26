from services.groq_service import llm

from prompts.rag_prompt import RAG_PROMPT
from schemas.rag_schema import RagOutput


structured_llm = llm.with_structured_output(RagOutput)


async def rag_node(state):
    """
    RAG Agent

    Identifies hostel knowledge questions and converts
    them into structured output for the Retrieval Tool.
    """

    message = state["message"]

    result = structured_llm.invoke(
        [
            ("system", RAG_PROMPT),
            ("human", message),
        ]
    )

    return {
        **state,
        "rag_query": result.model_dump(),
    }