import json

from services.groq_service import llm

from prompts.complaint_formatter_prompt import (
    COMPLAINT_FORMATTER_PROMPT,
)


async def format_complaint_response(data: dict):

    response = llm.invoke(
        [
            ("system", COMPLAINT_FORMATTER_PROMPT),
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