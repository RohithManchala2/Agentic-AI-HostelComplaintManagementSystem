import json

from services.groq_service import llm
from prompts.rag_formatter_prompt import (
    RAG_FORMATTER_PROMPT,
)


async def format_rag_response(data):

    response = llm.invoke(
        [
            ("system", RAG_FORMATTER_PROMPT),
            (
                "human",
                json.dumps(
                    data,
                    indent=2,
                    default=str,
                ),
            ),
        ]
    )

    return response.content