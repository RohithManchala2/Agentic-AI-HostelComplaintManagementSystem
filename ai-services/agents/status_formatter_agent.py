import json

from services.groq_service import llm

from prompts.status_formatter_prompt import (
    STATUS_FORMATTER_PROMPT,
)


async def format_status_response(data: dict):

    response = llm.invoke(
        [
            ("system", STATUS_FORMATTER_PROMPT),
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