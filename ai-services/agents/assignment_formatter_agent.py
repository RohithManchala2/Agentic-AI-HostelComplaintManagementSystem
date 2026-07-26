import json

from services.groq_service import llm
from prompts.assignment_formatter_prompt import (
    ASSIGNMENT_FORMATTER_PROMPT,
)


async def format_assignment_response(data: dict):

    response = llm.invoke(
        [
            ("system", ASSIGNMENT_FORMATTER_PROMPT),
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